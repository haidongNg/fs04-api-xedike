// 3rd packages
const express = require('express');
const mongoose = require('mongoose');
const app = express();

// my packages


mongoose.connect('mongodb://localhost:27017/xedike', {useNewUrlParser: true})
    .then(() => console.log('Connected to DB'))
    .catch((err) => console.log(err));
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})