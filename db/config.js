const mongoose = require('mongoose');

// cloud storage
mongoose.connect(
    "mongodb+srv://ashutoshbehera:XOEJSGYGiYkrsd60@cluster0.3582sgz.mongodb.net/e-commerce?retryWrites=true&w=majority"
);


// local storage
// mongoose.connect("mongodb://127.0.0.1:27017/e-commerce");