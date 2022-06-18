const express = require('express');
const { result } = require('lodash');
const { default: mongoose } = require('mongoose');
const morgan = require('morgan');  
const User = require('./models/users');

//express app
const app=express();

//connect to mongodb
const dbURI = 'mongodb+srv://test:test1234@learn-node.ryfno.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(dbURI, {useNewUrlParser:true ,useUnifiedTopology:true}) //it is asynchronous so takes time
    .then((result)=> {
        console.log('connected to db');
        app.listen(3000);
    })
    .catch((err)=> console.log(err))


//register view engine
app.set('view engine', 'ejs'); 

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));


app.get('/birthday', (req, res) => {

    const { username } = req.query;
    const user = User.findOne({ username });
    if (!user) {
    throw Error('User not found!');
    }
    res.send({ username, birthday: user.birthday });
});

app.post('/birthday/add', (req, res)=>{

    const { username, birthday } = req.query;
    const user = await User.create({ username, birthday });
    res.send({ username, birthday });
});

app.delete('/birthday/delete', (req,res)=>{
      const { username, birthday } = req.query;
      const user = await User.findOne({ username });
      if (!user) {
        throw Error("User not found");
      }
      if (user.birthday != birthday) {
        throw Error("Give correct birthdate");
      }
      await User.deleteOne(user);
      res.send({ username, birthday });
});

app.patch('/birthday/update', (req,res)=>{
    const { username, newDate } = req.query;
    const user = await User.findOneAndUpdate(
      { username },
      { $set: { birthday: newDate } }
    );
    if (!user) {
      throw Error('User not found');
    }
    res.send({ user });
})