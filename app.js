const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https=require("https");
const { dirname } = require('path');
 
const app = express();
app.use(bodyParser.urlencoded({ extended: true}));
 
const port = process.env.PORT || 3000;
 


// app.use(express.static('public'));
app.use(express.static(__dirname));
 
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/signup.html');
});

app.post("/",function(req,res){
    const first_name=req.body.firstName;
    const lastName=req.body.lastName;
    const email=req.body.email;
    console.log(first_name,lastName,email);

    const data={
        members:[
            {
                email_address:email,
                status:"subscribed",
                merge_fields:{
                    FNAME:first_name,
                    LNAME:lastName
                }
            }
        ]
    };

    const jsonData=JSON.stringify(data);
    const url="https://us13.api.mailchimp.com/3.0/lists/5cae6047a3";
    const options={
        method:"POST",
        auth:"angela1:77d4096e69872f2a367e0847e32ebeed-us13"
    }

    const request=https.request(url,options,function(response){

        if(response.statusCode===200){
            res.sendFile(__dirname+"/success.html");
        }
        else{
            res.sendFile(__dirname+"/failure.html");
        }


        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
});

app.post("/failure", function (req,res){
    res.redirect("/");
})
 
app.listen(port, function() {
     console.log(`Example app listening at http://localhost:${port}`);
});

// api keys:77d4096e69872f2a367e0847e32ebeed-us13
//unique id 5cae6047a3
