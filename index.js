const express = require('express')
const ping = require ("net-ping")
const isPortReachable = require('is-port-reachable');

const app = express()
const pingSession = ping.createSession({
	retries: 3,
	timeout: 100
})

const SERVER_PORT = 8080
const checkCommonlyUsedPortsOpened = async (ip_address) => {
    const portList = [80, 22, 3389, 443, 41222, 8080, 8443]
    
    for(const port of portList)
        if(await isPortReachable(port, { host: ip_address, timeout: 100 }))
            return true;
            
    return false;
}

app.get('/heartbeat/:ip_address', (req, res) => {
    const ip_address = req.params.ip_address

    pingSession.pingHost(ip_address, async (error, target) => {
        if(error) {
            if (await checkCommonlyUsedPortsOpened(ip_address)) {
                res.status(200);
                res.send({ result: true, message: target + " is alive" });
                return;
            } else if (error instanceof ping.RedirectReceivedError) {
                res.status(200);
                res.send({ result: true, message: target + " is not receiving but redirecting itself!" });
                return;
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
