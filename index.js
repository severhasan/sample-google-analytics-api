const express = require('express');
const app = express();
const { getData } = require('./lib/ga');


app.get('/', (req, res) => {
    res.send('hello world');
})

app.get('/analytics', async (req, res) => {
    const data = await getData();
    res.send(data);
    // res.sendFile('view/analytics.html', { root: __dirname });
})

app.listen(8080, () => console.log('> Listening on port 3000'));