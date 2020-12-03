const express = require('express')
const ping = require ("net-ping")

const app = express()
const pingSession = ping.createSession({
	retries: 3,
	timeout: 1000
})

const SERVER_PORT = 8080

app.get('/heartbeat/:ip_address', (req, res) => {
    const ip_address = req.params.ip_address

    pingSession.pingHost(ip_address, (error, target) => {
        if(error) {
            if (error instanceof ping.RedirectReceivedError) {
                res.status(200);
                res.send({ result: true, message: target + " is not receiving but redirecting itself!" });
            }

            res.status(400);
			if (error instanceof ping.RequestTimedOutError)
                res.send({ result: false, message: target + ": Not alive" });
            else
                res.send({ result: false, message: target + ": " + error.toString() });
            return;
        }
        res.status(200);
        res.send({ result: true, message: target + " is alive" });
    })
})

app.listen(SERVER_PORT, () => {
    console.log(`Listening on server ${SERVER_PORT}`)
})