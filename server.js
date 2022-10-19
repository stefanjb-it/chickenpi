const server = require('express');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('config.json'));
const app = server();
const GPIO = require('onoff').Gpio;

const SW_UP = new GPIO(config.SW_UP,'in','rising', {debounceTimeout: 10});
const SW_DW = new GPIO(config.SW_DW,'in','rising', {debounceTimeout: 10});
const LED_UP = new GPIO(config.LED_UP,'out');
const LED_G = new GPIO(config.LED_G,'out');
const LED_DW = new GPIO(config.LED_DW,'out');
const END_UP = new GPIO(config.END_UP,'in');
const END_DW = new GPIO(config.END_DW,'in');
const REL_DW = new GPIO(config.REL_DW,'out');
const REL_UP = new GPIO(config.REL_UP,'out');

SW_UP.watch((err,value) => {
    STOP();
    if(END_UP != 1){
        while(END_UP != 1){
            UP();
        }
        STOP();
    }
});
SW_DW.watch((err,value) => {
    STOP();
    if(END_DW != 1){
        while(END_DW != 1){
            DOWN();
        }
        STOP();
    }
});
app.use(server.text());

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/index.html')
})

app.post('/up',(req,res)=>{
    if(SW_UP.readSync() == 1 |  SW_DW.readSync() == 1){
        res.json({success: "Not Successfully",status: 403});
    }
    else{
        while(Test_UP != 1){
            UP();
        }
        STOP();
        res.json({success: "Successfully",status: 200});
    }
});
app.post('/down',(req,res)=>{
    if(SW_UP.readSync() == 1 |  SW_DW.readSync() == 1){
        res.json({success: "Not Successfully",status: 403});
    }
    else{
        while(Test_DOWN != 1){
            DOWN();
        }
        STOP();
        res.json({success: "Successfully",status: 200});
    }
});

function UP(){
    REL_UP.writesync(1);
    LED_DW.writeSync(0);
    LED_G.writeSync(0);
    LED_UP.writeSync(1);
}
function DOWN(){
    REL_DW.writeSync(1);
    LED_DW.writeSync(1);
    LED_G.writeSync(0);
    LED_UP.writeSync(0);
}
function STOP(){
    REL_DW.writeSync(0);
    REL_UP.writeSync(0);
    LED_DW.writeSync(0);
    LED_G.writeSync(1);
    LED_UP.writeSync(0);
}
function Test_UP(){
    if(END_UP.readSync() == 1){
        return 0;
    }
    else{
        return 1;
    }
}
function Test_DOWN(){
    if(END_DW.readSync() == 1){
        return 0;
    }
    else{
        return 1;
    }
}
LED_G.writeSync(1);

app.listen(8080);