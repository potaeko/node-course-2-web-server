//express
const express = require('express');
//Handlebars
const hbs = require('hbs')
//fs because we want to print req to a file system
const fs =require('fs')

//set heroku port
const port = process.env.PORT || 3000; //if env.port not exist using 3000

var app = express(__dirname + '/views/partials');

//reuse for template
hbs.registerPartials(__dirname + '/views/partials')
//Noticed that we will use handlebars
app.set('view engine','hbs');

//Using Middleware

//register middleware with app.use and put in funtion
app.use((req, res, next)=>{
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`; //show Time Method URl in Terminal from req
    console.log(log) 
    fs.appendFile('server.log', log+ '\n',(err) =>{ //check server.log for info
        if(err){
            console.log('Unable to append to server.log')
        }
    })
    next() //next to tell express to continue
})
//maintenace middleware will stop before app.get in every res.render because there is no next()
// app.use((req, res, next)=>{
//     res.render('maintenance.hbs')
// });

//For static directory*** 
//move to below all middleware to access only passed all the middleware
app.use(express.static(__dirname + '/public')); //express.static serve the path of folder

//handlebars helper function(name of the helper, funtion to run)
hbs.registerHelper('getCurrentYear',()=>{
    return new Date().getFullYear()
})
//Capitalize Helper
hbs.registerHelper('screamIt',(text)=>{
    return text.toUpperCase();
})
// /route
app.get('/', (req,res)=>{ //request, response methods
    //ex1 res.send('<h1>Hello Express</h1>');
    //ex2 JSON object
    // res.send({
    //     name: 'Thomas',
    //     likes:[
    //         'Biking',
    //         'Cities'
    //     ]
    // })
    //ex3 hbs,handlebars
    res.render('home.hbs',{
        pageTitle: 'Home Page',
        welcomeMessage: 'Welcome to my website!',
        //currentYear: new Date().getFullYear()
    })
});

// about route with Dynamic rendering handlebars
app.get('/about',(req,res)=>{
    res.render('about.hbs',{
        pageTitle: 'About Page',
        //currentYear: new Date().getFullYear()
    })
})

// /bad route - callback JSON with errorMessage
app.get('/bad',(req,res)=>{
    res.send({ //pass in object for 
        errorMessage:'Unable to handle request'
    })
})

// project route with Dynamic rendering handlebars
app.get('/project',(req,res)=>{
    res.render('project.hbs',{
        project1: 'Project Test#1',
        project2: 'Project Test#2',
        project3: 'Project Test#3',
        project4: 'Project Test#4',
        project5: 'Project Test#5',
        //currentYear: new Date().getFullYear()
    })
})

//heroku port
app.listen(port,()=>{ //listen can take 2 arguments (port, function)
    console.log(`Server is up on port ${port}`)
});
