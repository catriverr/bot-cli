import express from 'express';

const app = express();
app.use(express.json());
app.use(express.urlencoded());

app.post(`/auth-check`, (req, res) => {
    let body = req.body;
    if (!body.pass) return res.status(201).send({url: req.headers.host, auth: false});
    const SERVER_PASSWORD = `test-password-123`;
    console.log('checking password', body.pass);
    if (body.pass == SERVER_PASSWORD) return res.status(200).send({url: req.headers.host, auth: true});
    else return res.status(201).send({url: req.headers.host, auth: false});
});


app.listen(15555, () => {
    console.log(`server alive`);
});