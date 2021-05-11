const express = require('express')
const app = express()
const port = 3001

/*app.get('/bpm', function (req, res) {
    const EmpaticaE4 = require('empatica-e4-client');
    const dev1 = new EmpaticaE4();

    const portNumber = 28000;
    const ipAddress = '127.0.0.1';
    const deviceID = '484c5c';        //Empatica E4 device ID //543a64 ou 484c5c
    try {
        dev1.connect(portNumber, ipAddress, deviceID, (data) => {
            const sensorData = EmpaticaE4.getString(data);
            console.log(sensorData);
            res.send(EmpaticaE4.E4_BVP)
        });
    } catch (e) {
        res.send("error")
    }
});*/

const EmpaticaE4 = require('empatica-e4-client');
const dev1 = new EmpaticaE4();

const portNumber = 28000;
const ipAddress = '127.0.0.1';
const deviceID = '484c5c';        //Empatica E4 device ID //543a64 ou 484c5c
try {
    dev1.connect(portNumber, ipAddress, deviceID, (data) => {
        const sensorData = EmpaticaE4.getString(data);
        console.log(sensorData);
        //res.send(EmpaticaE4.E4_BVP)
    });
} catch (e) {
    console.log("error")
}
setTimeout(function() {
    //dev1.subscribe(EmpaticaE4.E4_IBI);
    var cmd = 'device_subscribe '+ EmpaticaE4.E4_IBI +' ON \n'
    var cmdBinary = EmpaticaE4.conv(cmd, { in:'binary' })
    EmpaticaE4.client.write(cmdBinary,'ascii')

    EmpaticaE4.client.on("data", (message) => {
        var split = message.toString().split("\n")
        split.forEach(line => {
            if(line.includes("Hr")) {
                let i = line.lastIndexOf(" ")
                let hr = line.toString().substring(i, line.length)
                console.log("Hr = " + hr)
            }
        })
    });

}, 1000);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
