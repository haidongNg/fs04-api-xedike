// 3rd packages
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const app = express();
require('dotenv').config();
// my packages

let moongoUrl = '';
if(process.env.STAGE === 'development'){
  moongoUrl = process.env.MONGO_URL_DEV;
} else if(process.env.STAGE === 'production') {
  moongoUrl = process.env.MONGO_URL_PROD;
}
// linux export=development
// window SET=development
// mongodb+srv://xedikedb:IssVsBr6nFHnssDg@xedike-api-wtcsu.azure.mongodb.net/test?retryWrites=true&w=majority
mongoose
  .connect(moongoUrl, {
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(() => console.log("Connected to DB"))
  .catch(err => console.log(err));
// mongoose.connect('mongodb://localhost:27017/xedike', { useNewUrlParser: true, useCreateIndex: true })
//     .then(() => console.log('Connected to DB'))
//     .catch((err) => console.log(err));

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

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

// parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', express.static('public'));

// Middleware: passport
app.use(passport.initialize());
require("./config/passport")(passport);

// static
app.use("/uploads", express.static("uploads"));

// router
app.use("/api/users", require("./routes/api/users/index"));
app.use("/api/trips", require("./routes/api/trips/index"));

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
