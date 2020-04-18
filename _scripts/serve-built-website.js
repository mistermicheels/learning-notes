const express = require('express');
const app = express();

const port = 3000;

app.use(express.static('_website/build'));

app.listen(port, () => { 
    console.log(`Listening at http://localhost:${port}`);
    console.log("If necessary, you can make this publicly available through ngrok");
});