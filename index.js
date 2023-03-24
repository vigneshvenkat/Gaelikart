const express = require('express');
const axios = require("axios");
const fs = require("fs");
const https = require("https");
const frameguard = require('frameguard')
//const csrf = require('csurf');

//var csrfProtection = csrf({ cookie: false });
// deepcode ignore UseCsurfForExpress: <please specify a reason of ignoring this>
const app = express();
const port = 8000;

app.use(express.static('./app'));


const helmet = require("helmet");
app.use(helmet());
app.use(frameguard({ action: 'SAMEORIGIN' }));

const options = {
    key: fs.readFileSync('localhost-key.pem'),
    cert: fs.readFileSync('localhost-cer.pem'),
    pfx: fs.readFileSync('localhost.pfx'),
    passphrase: '123456'
};
https.globalAgent.options.ca = [
    fs.readFileSync('localhost-key.pem'),
    fs.readFileSync('localhost-cer.pem')
];

//http.createServer(app).listen(80)
https.createServer(options, app).listen(port)

app.get('/verify/account-verified', (req, res) => {
    res.send("<h1>Your Account has been activated. Go to the website to login.</h1>");
});

app.get('/verify/invalid-account', (req, res) => {
    res.send("<h1>Not Verified.</h1>");
});


/*
app.get('/verify/:value',csrfProtection, (req, res) => {
    // Reading isbn from the URL
    const value = req.params.value;
    let regex = /^[0-9A-Fa-f]{8}(?:-[0-9A-Fa-f]{4}){3}-[0-9A-Fa-f]{12}$/

    if(regex.test(value))
    {
        axios({
            method: 'get',
            url: 'https://10.211.55.2/verify',
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            }),
            data: {token : value},
            headers: {
                'Content-Type' : 'application/json'
            }
        }).then((response) => {res.send(response);
            if(response.status == 200)
            {
                res.send("<h1>Your Account has been activated. Go to the website to login.</h1>");
            }else
            {
                res.send("Not Verified.");
            }
        })
        .catch(error => {console.error(error);
            res.send("Not Verified.");
        });
    }else
    {
        res.send("Not a valid token.");
    }
});*/