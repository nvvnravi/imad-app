var express = require('express');
var morgan = require('morgan');
var path = require('path');
var pool=require('pg').Pool;
const crypto = require('crypto');
var bodyParser=require('body-parser');
var session=require('express-session');

var config={
  user: 'nvvnravi',
  host: 'db.imad.hasura-app.io',
  database: 'nvvnravi',
  password: process.env.DB_PASSWORD,
  port: 5432	
};


var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
    secret:"some_random_value",
    cookie:{maxAge:1000*60*60}
}));

//Create JS array of HTML template pages
var contents={
'article-one':{
title1:'JavaScript',
heading:"About JavaScript",
q1:"what is Javascript?",
a1:`JavaScript is a scripting language designed primarily for adding interactivity to Web pages and creating Web applications. 
The language was first implemented by Netscape Communications Corp. in Netscape Navigator 2 beta (1995). `,
q2:" why use Javascript?",
a2:`<ol>
<li>JavaScript is very easy to learn. No setup is required; it’s built right into the web browser! Just start writing code and see the results immediately in your browser.</li>
<li>JavaScript is used everywhere…web browser (Angular, React), server-side (Node), mobile, desktop, games, Internet of Things, robotics, virtual reality, etc.</li>
<li>Node is super popular. Proof: there are over 30,000 NPM packages available!</li>
<li>There are lots of high-paying jobs for JavaScript developers. What a great way to start your IT career!</li>
<li>JavaScript is an incredibly expressive and powerful language.!</li>
</ol>`
},
'article-two':{
title1:'HTML',
heading:'About HTML',
q1:'what is HTML?',
a1:`HTML is a computer language devised to allow website creation. 
These websites can then be viewed by anyone else connected to the Internet. It is relatively easy to learn, with the basics being accessible to most people in one sitting; and quite powerful in what it allows you to create. It is constantly undergoing revision and evolution to meet the demands and requirements of the growing Internet audience under the direction of the » W3C, the organisation charged with designing and maintaining the language.`,
q2:" why use HTML?",
a2:`<ol>
<li>Accesessibility</li>
<li>Video & Audio</li>
<li>Better Interations</li>
</ol>`
},
'article-three':{
title1:'CSS',
heading:'About CSS',
q1:'what is CSS?',
a1:'CSS is the language for describing the presentation of Web pages, including colors, layout, and fonts. It allows one to adapt the presentation to different types of devices, such as large screens, small screens, or printers. CSS is independent of HTML and can be used with any XML-based markup language.',
q2:" why use CSS?",
a2:`CSS is used to define styles for your web pages, including the design, layout and variations in display for different devices and screen sizes.`

}
};
function generateHTML( content){

var title1=content.title1;
var heading=content.heading
var q1=content.q1;
var a1=content.a1;
var q2=content.q2;
var a2=content.a2;
var today=new Date();

var articleHTMLTemplate=`
<!doctype html>
<html>
    <head>
    <Title>
       ${title1}
       </Title>
       <meta name="viewport" content="width-device-width,initial-scale=1"/>
        <link href="/ui/style.css" rel="stylesheet" />
    </head>
    <body>
    <div class="contaner">
        <div>
        <a href="/">Go To HomePage</a>
        </div>
        <hr/>
        <h1>
        ${heading}
        </h1>
<hr/>
         <h2>
        ${today}
        </h2>
        <h2>
       ${q1}
        </h2>
    
        <div>
        <p>
       ${a1}
        </p>
        <h2>
        ${q2}
        </h2>
    
        <div>
        <p>
		${a2}
        </p>
        </div>
        </div>
    </body>
</html>
`;
return articleHTMLTemplate;
}


function generateArticleFromDB(articleContent){

var title=articleContent.title;
var heading=articleContent.heading;
var textContent=articleContent.content;
var date=articleContent.date;
var articleId=articleContent.id;

var articleHTMLTemplate=`
<!doctype html>
<html>
    <head>
    <Title>
       ${title}
       </Title>
       <meta name="viewport" content="width-device-width,initial-scale=1"/>
        <link href="/ui/style.css" rel="stylesheet" />
         <script type="text/javascript" >
         var articleId= ${articleId};
var userId="";
function checkLogin(){
var request=new XMLHttpRequest();
request.onreadystatechange=function(){
if(request.readyState=== 4 ){
    if( request.status=== 200){
     //alert("checkLogin :"+request.responseText);
        if(request.responseText === 'false'){
 //      alert("user not logged in");
       document.getElementById('commentArea').style.display="none";
        }else{
            userId=request.responseText;
        }
}
}
};
//Now Make the request
request.open('GET','/checkLogin');
request.send();
}


function addComment(){
//alert("addComment  :"+userId);
var request=new XMLHttpRequest();
request.onreadystatechange=function(){
if(request.readyState===4){
if( request.status===200){
var responseValue=request.responseText;
    if(responseValue ==='true'){
         var errorValue=document.getElementById('errorArea');
    errorValue.innerHTML='';
        getCommentHistory(articleId);
        document.getElementById('comment').value='';
    }else{
     var errorValue=document.getElementById('errorArea');
    errorValue.innerHTML='';
    //alert("errorValue :"+request.responseText);
    errorValue.innerHTML=request.responseText;
     }
}else{
     var errorValue=document.getElementById('errorArea');
    errorValue.innerHTML='';
    //alert("errorValue :"+request.responseText);
    errorValue.innerHTML=request.responseText;
}
}
};
//Now Make the request
var commentValue=document.getElementById('comment').value;

//alert("comment :"+commentValue+"    articleId:"+articleId+"    userId:"+userId);

request.open('POST','http://nvvnravi.imad.hasura-app.io/addComment',true);
request.setRequestHeader('Content-Type','application/json');
request.send(JSON.stringify({comment:commentValue,articleId:articleId,userId:userId}));
}

function getCommentHistory(articleId){

var request=new XMLHttpRequest();
request.onreadystatechange=function(){
if(request.readyState===4){

if( request.status===200){
var spanTagValue=document.getElementById('commentHistory');
//alert("comment History :"+request.responseText);
spanTagValue.innerHTML=request.responseText;
  //clear if any errors are there
  var errorValue=document.getElementById('errorArea');
     errorValue.innerHTML='';
    
}else{
//alert("errorValue :"+request.responseText);

    var errorValue=document.getElementById('errorArea');
     errorValue.innerHTML='';
    errorValue.innerHTML=request.responseText;
}
}
};
//Now Make the request
request.open('POST','http://nvvnravi.imad.hasura-app.io/getCommentHistory',true);
request.setRequestHeader('Content-Type','application/json');
request.send(JSON.stringify({articleId:articleId}));
}

function logout(){
var request=new XMLHttpRequest();
request.onreadystatechange=function(){
if(request.readyState===4){
    if( request.status===200){
        //alert(request.responseText);
        
		 window.location.href = "/";
     }else if(request.status===403){
        alert("Could not log you out.");
    }else if(request.status===500){
         alert("Something went wrong on server.");
    }
 }
};
//Now Make the request
request.open('GET','/logout',true);
request.send();
}
</script>
    </head>
    <body onload="javascript:checkLogin();getCommentHistory(articleId);">
    <div class="container">
        <div>
        <a href="/landingPage">Go To Article List</a>
        </div>
        <hr/>
        <h1>
        ${heading}
        </h1>
<hr/>
         <h2>
        ${date.toDateString()}
        </h2>
        ${textContent}
       
        <div>
        <br/>
         <div id="errorArea" name="errorArea" style="color:red;">
        </div>
        <br/>
        <div id="commentArea" name="commentArea">
        <textarea rows="4" cols="50" name="comment" id="comment" >Enter text here....</textarea>
        <input type="button" name="cmt_sbt_btn"  value="AddComment" id="cmt_sbt_btn" onclick="javascript:addComment();"/>
        <br/>
        <input type="button" name="logout_btn"  id="logout_btn" onclick="javascript:logout();" value="Logout"/>
        </div>
         <div id="commentHistory" name="commentHistory">
        </div>
        </div>
         </div>
    </body>
</html>
`;
return articleHTMLTemplate;
}

var counter=0;
//Go to Landing Page
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});



//Function to calculate Hash
function hash(input,salt){
const key = crypto.pbkdf2Sync(input, salt, 100000, 512, 'sha512');
return ["pbkdf2","100000",salt,key.toString('hex')].join('$');
}
//GET method for calculating hashValue of a value
app.get('/hash/:inputValue',function(req,res){
    var hashValue=hash(req.params.inputValue,'This-is-a-test-salt');
    res.send(hashValue);
}
);

app.get('/article/:articleName', function (req, res) {
var articleNameParam=req.params.articleName;
res.send(generateHTML(contents[articleNameParam]));
});
//create database pool
var client=new pool(config);
//POST method to create a new user
app.post('/create-user',function(req,res){
    //read username from the request body
    var userName=req.body.username;
    //console.log("UserName : "+userName);
    //check if the user already exists..
    client.query("select * from   user1 where username=$1",[userName], (err,result) => {
     if(err){
      res.status(500).send("Error in getting records from DB"+err.toString());
  }else{
      if(result.rows.length !== 0){
          res.status(403).send("username already exists. Choose another username.");
      }
  }   
    });
    //read password from the request body
    var passwordValue=req.body.password;
    //console.log("Password: "+passwordValue);
    //Convert the password into a hashedPassword
    var salt=crypto.randomBytes(128).toString('hex');
    //console.log("Salt : "+salt);
    var hashPassword = hash(passwordValue,salt);
    console.log("hashPassword  :  "+hashPassword);
    //Now insert the user in the table with the passsword
    client.query("INSERT into  user1  (username,password) values ($1,$2)",[userName,hashPassword], (err,result) => {
     if(err){
      res.status(500).send("Error in getting records from DB"+err.toString());
  }else{
    res.send(' User Successfully Registered. You can now login to write comments.\n');
  }   
    });
});


app.post('/m/create-user',function(req,res){
    //read username from the request body
    var userName=req.body.username;
    //console.log("UserName : "+userName);
    //check if the user already exists..
    client.query("select * from   user1 where username=$1",[userName], (err,result) => {
     if(err){
          var json = JSON.stringify({ 
                error: "Error in getting records from DB"+err.toString()
                });
              res.status(500).send(json);
      
  }else{
      if(result.rows.length !== 0){
              var json = JSON.stringify({ 
                error: "username already exists. Choose another username."
                });
              res.status(403).send(json);
      }
  }   
    });
    //read password from the request body
    var passwordValue=req.body.password;
    //console.log("Password: "+passwordValue);
    //Convert the password into a hashedPassword
    var salt=crypto.randomBytes(128).toString('hex');
    //console.log("Salt : "+salt);
    var hashPassword = hash(passwordValue,salt);
    console.log("hashPassword  :  "+hashPassword);
    //Now insert the user in the table with the passsword
    client.query("INSERT into  user1  (username,password) values ($1,$2)",[userName,hashPassword], (err,result) => {
     if(err){
             var json = JSON.stringify({ 
                error: "Error in getting records from DB"+err.toString()
                });
              res.status(500).send(json);
      
  }else{
             var json = JSON.stringify({ 
                message: "User Successfully Registered. \n"
                });
              res.status(200).send(json);
    
  }   
    });
});

app.post('/addComment',function(req,res){
    //read comment from the request body
    var comment=req.body.comment;
    console.log("comment : "+comment);
    //read articleI d from the request body
    var articleId=req.body.articleId;
    console.log("articleId: "+articleId);
    //read user id from the request
    var userId=req.body.userId;
    console.log("userId : "+userId);
    //Now insert the comment in comment Table
    client.query("INSERT into  comment  (comment,article_id,user_id,time) values ($1,$2,$3,$4)",[comment,parseInt(articleId),parseInt(userId),new Date()], (err,result) => {
     if(err){
      res.status(404).send("Error in adding comments to DB"+err.toString());
  }else{
    res.send('true');
  }   
    });
});

app.post('/getCommentHistory',function(req,res){
    
    //read article Id from the request body
    var articleId=req.body.articleId;
    console.log("articleId: "+articleId);
    
    //Now get all the comments from the comments Table
    client.query("select * from   comment where article_id=$1",[parseInt(articleId)], (err,result) => {
     if(err){
      res.status(500).send("Error in getCommentHistory from DB"+err.toString());
  }else{
    if(result.rows.length === 0){
        res.status(404).send("No comments Found for this Article!!!");
    }else {
        var list='';
        for(var i=0; j=result.rows.length,i<j; i++){
          // var dateValue= result.rows[i].time.getMonth()+'/'+result.rows[i].time.getDate()+'/'+result.rows[i].time.getFullYear();
            list+= '<p>'+result.rows[i].time.toDateString()+'<br/>'+result.rows[i].comment+'</p>';
        }
        res.status(200).send(list);
        }
    }
    });
});



app.get('/checkLogin',function(req,res){
  if(req.session && req.session.auth && req.session.auth.userId){
  //res.send('You are logged in  :'+req.session.auth.userid.toString());
  res.send(req.session.auth.userId.toString());
  }else{
    //res.send('you are not logged in.');  
    res.send('false');
  }
});

app.get('/logout',function(req,res){
  delete req.session.auth;
  //res.send('Log out Successfully!!!');
  //res.send('true');
   res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

//POST method to login into the application
app.post('/login',function(req,res){
    //read username from the request body
    var userName=req.body.username;
    //console.log("UserName : "+userName);
   //read password from the request body
    var passwordValue=req.body.password;
    //Now get the hashedpassword from the database
    client.query("select * from   user1 where username=$1",[userName], (err,result) => {
     if(err){
      res.status(500).send("Error in getting records from DB"+err.toString());
  }else{
      if(result.rows.length === 0){
          res.status(403).send("user does not exists.\n");
      }else{
          var dbPassword=result.rows[0].password;
          //console.log(dbPassword);
          var salt=dbPassword.split('$')[2];
          //console.log("Salt :"+salt);
          var hashedPassword=hash(passwordValue,salt);
          //console.log(hashedPassword);
          if(hashedPassword===dbPassword){
              //set the session cookie here
              req.session.auth={userId: result.rows[0].id};
              //send the response
             // res.status(200).send("user successfully logged in!!!!: "+req.session.auth.userId);
              res.status(200).send("user successfully logged in!!! ");
             
               }else{
              res.status(403).send("username/password is invalid.\n");
          }
      }
  }   
    });
});


//POST method to login into the application
app.post('/m/login',function(req,res){
    //read username from the request body
    var userName=req.body.username;
    //console.log("UserName : "+userName);
   //read password from the request body
    var passwordValue=req.body.password;
    //Now get the hashedpassword from the database
    client.query("select * from   user1 where username=$1",[userName], (err,result) => {
     if(err){
      res.status(500).send("Error in getting records from DB"+err.toString());
  }else{
      if(result.rows.length === 0){
          var json = JSON.stringify({ 
                message: "user does not exists.\n"
                });
              res.status(403).send(json);
      }else{
          var dbPassword=result.rows[0].password;
          //console.log(dbPassword);
          var salt=dbPassword.split('$')[2];
          //console.log("Salt :"+salt);
          var hashedPassword=hash(passwordValue,salt);
          //console.log(hashedPassword);
          if(hashedPassword===dbPassword){
              //set the session cookie here
              req.session.auth={userId: result.rows[0].id};
              //send the response
               var json = JSON.stringify({ 
                message: "user successfully logged in!!! "
                });
              res.status(200).send(json);
             
               }else{
                   var json = JSON.stringify({ 
                error: "username/password is invalid.\n"
                });
              res.status(403).send(json);
          }
      }
  }   
    });
});

var names=[];
app.get('/submitName', function (req, res) {
//var reqName=req.params.name;
var reqName=req.query.name;
names.push(reqName);
res.send(JSON.stringify(names.sort()));
});

app.get('/testdb', function (req, res) {
    
client.query('SELECT * from user1', (err, result) => {
  if(err){
      res.send("Error in getting records from DB"+err.toString());
  }else{
    res.send(JSON.stringify(result));
  }
});
});


app.get('/counter', function (req, res) {
counter=counter+1;
  res.send(counter.toString());
});

app.get('/articles/:articleName', function (req, res) {
client.query("SELECT * from article where name=$1",[req.params.articleName], (err, result) => {
  if(err){
      res.send("Error in getting article from DB"+err.toString());
  }else{
    if(result.rows.lenth === 0){
        res.status(404).send("Article NOT Found!!!");
    }else {
        var articleData=result.rows[0];
        
     res.send(generateArticleFromDB(articleData));
     }
  }
  });
});


app.post('/listArticles', function (req, res) {
client.query("SELECT * from article" , (err, result) => {
  if(err){
      res.status(404).send("Error in getting list of articles from DB"+err.toString());
  }else{
    if(result.rows.lenth === 0){
        res.status(404).send("No Articles are  Found!!!");
    }else {
        var list='';
        for(var i=0; j=result.rows.length,i<j; i++){
        list+= '<li><p><a href="/articles/'+result.rows[i].name+'" onclick="showArticelDetail(/articles/'+result.rows[i].name+'">'+result.rows[i].title+'</a></p></li>';
        }
        res.status(200).send(list);
        }
    }
   
  });
});

app.get('/landingPage', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'landing.html'));
});
/** Old Code not optimzed
 app.get('/article-one', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'article-one.html'));
});
app.get('/article-two', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'article-two.html'));
});
app.get('/article-three', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'article-three.html'));
});
*/

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
