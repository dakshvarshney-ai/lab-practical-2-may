const express = require('express');
const mongoose = require('mongoose');
const { nanoid } = require('nanoid');
const Url = require('./Url');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/shortener');

app.post('/shorten', async (req, res) => {
    const { longUrl } = req.body;
    const shortId = nanoid(8); 

    const newUrl = new Url({ fullUrl: longUrl, shortId: shortId });
    await newUrl.save();

    res.json({ shortUrl: `http://localhost:3000/${shortId}` });
});

app.get('/:shortId', async (req, res) => {
    const urlData = await Url.findOne({ shortId: req.params.shortId });

    if (urlData) {
        urlData.clicks++;
        await urlData.save();
        return res.redirect(urlData.fullUrl);
    } else {
        return res.status(404).json('URL not found');
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));

