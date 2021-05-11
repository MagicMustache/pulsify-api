const express = require('express')
const app = express()
const port = 3001

app.get('/bpm', function (req, res) {
    const EmpaticaE4 = require('empatica-e4-client');
    const dev1 = new EmpaticaE4();

    const portNumber = 28000;
    const ipAddress = '127.0.0.1';
    const deviceID = '543a64';        //Empatica E4 device ID //543a64 ou 484c5c
    try {
        dev1.connect(portNumber, ipAddress, deviceID, (data) => {
            const sensorData = EmpaticaE4.getString(data);
            console.log(sensorData);
            res.send(EmpaticaE4.E4_BVP)
        });
    } catch (e) {
        res.send("error")
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
