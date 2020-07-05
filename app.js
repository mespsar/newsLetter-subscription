const express = require("express")
const bodyParser = require("body-parser")
const https = require("https");
const app = express()
app.use(express.static("public"))
app.use(bodyParser.urlencoded({
  extended: true
}));


app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
})

app.post("/failure.html",function(req,res){
  res.redirect("/")
})

app.post("/", function(req, res) {
  console.log("here")
  var firstName = req.body.firstName
  var lastName = req.body.lastName
  var email = req.body.email

  var data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME:lastName
      }
    }]
  }
  const jsonData = JSON.stringify(data)
  const audianceId=""//put your mailchimp audianceId here as a string
  const apiKey=""//put your mailchimp api key here as a string
  //replace X in the url below with your server number in mailchimp
  const url="https://usX.api.mailchimp.com/3.0/lists/"+audianceId;
  const options={
    method:"POST",
    auth:"user:"+apiKey;
  }
  const request = https.request(url, options, function(response) {
    console.log(response.statusCode)
    if(response.statusCode==200)
    {
      res.sendFile(__dirname+"/success.html")

    }
    else{
      res.sendFile(__dirname+"/failure.html")
    }

    response.on("data", function(data) {
      console.log(JSON.parse(data))


    })
  });
  request.write(jsonData)
  request.end()
})

app.listen(process.env.PORT || 3000, function() {
  console.log("server running on 3000")
})
