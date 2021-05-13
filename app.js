const express = require('express')
const cors = require('cors')
const app = express()
const port = 3001
const EmpaticaE4 = require('empatica-e4-client')
const dev1 = new EmpaticaE4()
const portNumber = 28000
const ipAddress = '127.0.0.1'
const deviceID = '484c5c'        //Empatica E4 device ID //543a64 ou 484c5c

app.use(cors())

let count = 0;
let addedBPM = 0;
let lastAverageBPM = 0;

try {
    dev1.connect(portNumber, ipAddress, deviceID, (data) => {
        const sensorData = EmpaticaE4.getString(data);
        console.log(sensorData);
    });
} catch (e) {
    console.log("error")
}

app.get("/bpm", (req,res)=>{
    if (count == 0){
        res.send(""+lastAverageBPM)
    }
    else{
        let averageBPM = addedBPM/count
        lastAverageBPM = averageBPM
        count = 0
        addedBPM = 0
        res.send(""+averageBPM)
    }
})

setTimeout(()=>{
    const cmd = 'device_subscribe ' + EmpaticaE4.E4_IBI + ' ON \n'
    const cmdBinary = EmpaticaE4.conv(cmd, {in: 'binary'})

    EmpaticaE4.client.write(cmdBinary,'ascii')

    EmpaticaE4.client.on("data", (message) => {
        const split = message.toString().split("\n")
        split.forEach(line => {
            if(line.includes("Hr")) {
                let i = line.lastIndexOf(" ")
                let hr = line.toString().substring(i, line.length)
                console.log("Hr = " + hr)
                count += 1
                addedBPM += parseInt(hr, 10)
                console.log("count = " + count + "\nadded hr = " + addedBPM)
            }
        })
    });

}, 1000);

app.listen(port, () => {
    console.log(`Pulsify API listening at http://localhost:${port}`)
})
