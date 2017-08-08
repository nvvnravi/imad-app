var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));


//Create JS array of HTML template pages
var contents={
'article-one':{
title:'JavaScript',
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
title:'HTML',
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
title:'CSS',
heading:'About CSS',
q1:'what is CSS?',
a1:'CSS is the language for describing the presentation of Web pages, including colors, layout, and fonts. It allows one to adapt the presentation to different types of devices, such as large screens, small screens, or printers. CSS is independent of HTML and can be used with any XML-based markup language.',
q2:" why use CSS?",
a2:`CSS is used to define styles for your web pages, including the design, layout and variations in display for different devices and screen sizes.`

}
};
function generateHTML( content){

var title=content.title;
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
       ${title}
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

var counter=0;
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/counter', function (req, res) {
counter=counter+1;
  res.send(counter.toString());
});

app.get('/:articleName', function (req, res) {
var articleNameParam=req.params.articleName;

  res.send(generateHTML(contents[articleNameParam]));
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
