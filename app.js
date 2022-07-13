require('dotenv').config()
const express=require("express");
const bodyParser=require("body-parser");
const request=require("request");
const https =require("https");
const mailchimp=require("@mailchimp/mailchimp_marketing");
const path = require('path');


const app=express();

app.use(express.static("public")); //used to use static files

app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
	res.sendFile(__dirname+"/signup.html");
});


//setting up mailchimp 

mailchimp.setConfig({
	apiKey:process.env.API_KEY,
	server:process.env.SERVER
});


app.post("/",function(req,res)
{
	const ListID=process.env.LIST_ID;

	const subsUser={

	 fName:req.body.fName,
	 lName:req.body.lName,
	 eMail:req.body.eMail,
		
	};


	//Uploading data to the server

	async function run() {
	try{

		
		const response=await mailchimp.lists.addListMember(ListID,{
			email_address:subsUser.eMail,
			status:"subscribed",
			merge_fields:{
				FNAME: subsUser.fName,
				LNAME: subsUser.lName
			}

		});

		res.sendFile(__dirname+"/success.html");

	}
	catch(e){

		res.sendFile(__dirname+"/failure.html");


	}


	}
	

	run();




});

app.get('/about', function(req, res) {
  res.sendFile(path.join(__dirname, '/about.html'));
});

app.post("/failure",function(req,res){
	res.redirect("/");
});

app.get('/back-home',function(req,res){
	res.redirect("/");
})


	

	

app.listen(process.env.PORT||3000, function (req,res) {    //process.env.PORT is used for Heroku server

	console.log("server listening");
});




