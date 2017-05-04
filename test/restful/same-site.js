var express = require('express');
var cookieParser = require('cookie-parser');
var crypto = require('crypto');
var app = express();
var app_CSRF = express();
app.use(cookieParser());
var sameSite = process.argv[2] || true;
console.log(sameSite)
app.locals.sessionID = crypto.randomBytes(32).toString('base64');
app.get('/', function (req, res) {
    res
    .status(200)
    .cookie('sessionID', app.locals.sessionID, { sameSite: sameSite })
    .send('<html><body>Session Cookie Set!<form method="POST" action="http://localhost:3000/"><input type="submit"\></form></body></html>')
    .end();
});
app.post('/', function(req, res) {
 // Yes, this should be a secure time comparison! But it's a demo. Don't do this in your app.
 if(req.cookies.sessionID === app.locals.sessionID){
  res
        .status(200)
        .send('Success! You have sent your POST request from a valid origin, and it passes CSRF checking.<a href="http://127.0.0.1:3001">Test from Cross-Site.</a>')
        .end();
 } else {
  res
        .status(403)
        .send('Fail! Either you do not have a session cookie set, or this POST request came from a different origin and the session cookie was not sent with the request. Access is denied.')
        .end();
 }
});
app_CSRF.get('/', function (req, res) {
    res
    .status(200)
    .send('<html><body>Attempt to send request from a separate origin:<form method="POST" action="http://localhost:3000/"><input type="submit"\></form></body></html>')
    .end();
});
app_CSRF.listen(3001, function () {
})
app.listen(3000, function () {
  console.log('Same-Site CSRF mitigation demo app running on localhost:3000!');
});