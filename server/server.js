const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

const mongoose = require('mongoose');
const config = require('./config');
const app = express();
// mongoose connect
mongoose.connect(config.database, { useNewUrlParser: true, useCreateIndex: true }, (err) =>{
    if(err){
        console.log(err);
    }else{
        console.log('Connected to database');
    }
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended: false }));
app.use(morgan('dev'));
// router
const UserRoutes = require('./routes/account');
const CategoryRoutes = require('./routes/main');
const ProductRoutes = require('./routes/seller');
const SearchRoutes = require('./routes/product-search');

// Routes Settings
app.use('/api/accounts', UserRoutes);
app.use('/api', CategoryRoutes);
app.use('/api/seller', ProductRoutes);
app.use('/api', SearchRoutes);

app.listen(config.port, () =>{
    console.log(`server running port : ${config.port}`);
});