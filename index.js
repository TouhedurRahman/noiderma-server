const express = require('express');

require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("✅ Database Successfully Connected!");
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});