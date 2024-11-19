const createError=require('http-errors');
const express=require('express');
const path=require('path');
const connection=require('./src/config/database')
const app=express();
const cors = require('cors')


app.use(cors());


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// app.use(function(req,res,next){
//     next(createError(404))
// })


//for deployment, provide dynamic directive name as given locally 
//const __dirname = path.resolve();

app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    // console.log(err,res,next);
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'production' ? err : {};
    // render the error page
    // res.status(err.status || 500);
    res.status(500).render('error', { error: err });
    // res.render('error');
  });
  
//used for production static file

const indexWEB = require("./src/routes/index");
app.use("/", indexWEB);

const apiRoutes = require("./src/routes/api");
app.use("/", apiRoutes);

const PORT =process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`server started at ${PORT}`) 
})