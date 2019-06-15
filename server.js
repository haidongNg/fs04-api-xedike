// 3rd packages
const express = require('express');
const mongoose = require('mongoose');
const app = express();

// my packages


mongoose.connect('mongodb://localhost:27017/xedike', { useNewUrlParser: true, useCreateIndex: true })
    .then(() => console.log('Connected to DB'))
    .catch((err) => console.log(err));

// Middleware
// app.get('/', (rep, res, next) => {
//     console.log('Now 1');
//     next();
// }, (rep, res, next) => {
//     console.log('Now 2');
//     next();
// }, (rep, res, ) => {
//     res.send('Hello world');
//     // res.send('Hello world');
// })

// parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', require('./routes/api/index'));


const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})