## Simon Data Interview Homework

### Dec 14, 2019

##### Problem statement:

We want to make a feature that provides the user the ability to define a template in our product and then use that template to send emails to their customers.

For this assignment, create a small application to simulate this feature. It will have two parts,

A front end web page that lets the user configure the template and specify values for the template.
A backend server that accepts a web request with the raw template, the key-values for the fields, and then sends an email whose body is the produced from rendering the template. Emails will be sent using SendGrid (you can get a free account here: https://app.sendgrid.com/signup)
The front-end must be written using React and let the user:

Define a template, see example below.
Define the list of fields and values to be substituted into the template
Define the sender and the recipient
Display a preview
Display if the email was successfully sent, otherwise display an error message
The back-end can be implemented in the language of your choosing.

Render the template and return the value to the front end
Template engines allowed are: Jinja2 & Handlebars.
Send the email to the recipient through the SendGrid API
Example template & fields

```
Hi %%contact_first_name%%,

Get %%discount_rate%% off your next purchase using this discount code:
%%discount_code%%.

The field names (and some sample values) for this would be,

contact_first_name => Simon
discount_rate => 15%
discount_code => THANKYOU
```

### Solutions

This is a nice mini-project that can be implemented in many different ways.

#### Solution One

  http://104.196.23.166/SimonDataExercise/jquery/
  
This is the lightweight solution, using mimimal technology.   It is short, simple, and old school.  But don't worry, the other two are React.

jQuery is not a platform, it's more of a cross-platform library, so there
is no boilerplate.  Only four small files were needed:

  - index.html: HTML (67 lines)
  - index.js: javascript (75 lines)
  - index.css: styling (48 lines)
  - index.php: php script to send mail (32 lines)
  
 This exercise is all about dynamic template parsing.  In order to generate the form to 
 capture user input, we need to find all the variables referenced in the template.  A single 
 global regex does it.  This technique is used for all three solutions.  If we wanted to support 
 more complex templates, it would be necessary to use a templating engine to pull the variables.
 
 ```
    //
    // Extract variable names from the template.
    //
    let regex = /%%.*?%%/g;
    let matches = template.match(regex);
    let fields = [];
    matches.forEach(function(val, idx) {
      let v = val.substring(2, val.length - 2);
      fields.push(v);
    });

``` 
  
Since we are accepting the restriction to simple templates up front, in the way we extract variable names, we 
might as well adopt a similar approach for template rendering.  This version ignores the requirement that template rendering
should be done on the server.  It does it in the client, with another regex.  


```
   //
   // Replace variables in the template with their
   // values from the HTML input elements.
   //
   let message = template;
   fields.forEach(function(fieldName, idx) {
      let val = $("#" + fieldName).val();
      message = message.replace("%%" + fieldName + "%%", val);
   });
```  


PHP has the advantage of being widely available on every hosting service. The php script here is from sendgrid, modified to handle url query params.

The rendered email message is sent to the php script, along with the to and from 
addresses.  Only three params.  Doing template rendering on the 
server requires that we transfer the complete list of variable values, as 
in the next two solutions.


#### Solution Two

http://104.196.23.166/SimonDataExercise/react/

The second solution uses React for the web page, python to do template rendering in jinja2, and python
to send email via sendgrid.

With React it makes sense to split the page up into three components.  

- __Mailmerge__ is the parent.  It contains the textarea and
extracts the fields from the template.

- __PreviewMessage__ is the first child.  It receives the field list from Mailmege and 
constructs the form.

- __SendMail__ is the second child.  It manages the call to sendgrid.

The template is rendered by Jinja2 in python.  Templating on the server 
results in an extra round-trip to the server.


```
#
# Change jinja2 delimiter.
#
env = Environment(
  variable_start_string='%%',
  variable_end_string='%%'
)

#
# Render template.
#
templateSrc=context['template']
template=env.from_string(templateSrc)
print (template.render(context))
```

#### Solution Three

https://shrouded-harbor-29005.herokuapp.com/

The source code for this is on a different repo: https://github.com/johndimm/SimonExpress

A tricky issue with testing POST requests using jasmine is discussed here:  https://github.com/johndimm/JasminePOST

The last version uses node, react, and handlebars.  

Node removes the need for either PHP or Python.  This code from index.js does the work:

```
//
// Render a dynamic template created by the user of Mail Merge
//
app.post('/renderTemplate', function (req, res) {
  // When the request comes from the app, the body has the expected hash.
  var params = req.body;

  // When the request comes from jasmine, the params are the
  // first and only key of body, as a JSON string.  Strange.
  // Must be something about how we tell jasmine to send the request.
  var keys = Object.keys(req.body);
  if (keys && keys.length == 1) {
    params = JSON.parse(keys[0]);
  }

  // Compile the template using handlebars.
  let template = params['template'];
  let compiled = hbr.compile(template);

  // params has the variables mentioned in the template.
  let response = compiled(params);

  console.log("response=" + response);
  res.send({"response":response});
});


//
// Send email using sendgrid.
//
app.post('/sendMail', function (req, res) {
    const msg = {
      to: req.body.to, // 'test@example.com',
      from: req.body.from, // 'test@example.com',
      subject: 'From node, a very interesting email just for you!!!', // 'Sending with Twilio SendGrid is Fun',
      text: req.body.message //'and easy to do anywhere, even with Node.js',
      // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };

    console.log('in sendMail, req.query:' + JSON.stringify(req.body));

    sgMail
      .send(msg)
      .then(() =>res.send({"response":"202 Accepted, Mail sent successfully"}))
      .catch(error => res.send({"response":error.toString()}));

});

```

This is a huge advantage over the previous solutions.  There is no need to configure the web server
to handle php (not always enabled) and python (easy on the mac, awkward on linux).  The use of external
resources is confined to a few lines of javascript.

#### Testing

To run the jasmine tests:

```
npm test
```

These shell script tests exercise the external tools for sending mail and rendering templates.

```
cat run_all_tests.sh
# php
./sendmail_php.sh

# python
./sendmail_python.sh
./render_jinja2.sh

# node
./sendmail_node.sh
./render_handlebars.sh

cat sendmail_php.sh


johndimm@instance-1:~/projects/SimonDataExercise/tests$ ./run_all_tests.sh > run_all_tests.out
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   416    0   416    0     0    168      0 --:--:--  0:00:02 --:--:--   167
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100    12  100    12    0     0     17      0 --:--:-- --:--:-- --:--:--    17
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100    36  100    36    0     0     35      0  0:00:01  0:00:01 --:--:--    35
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100    10  100    10    0     0    909      0 --:--:-- --:--:-- --:--:--   909
johndimm@instance-1:~/projects/SimonDataExercise/tests$ cat run_all_tests.out


echo "sendmail using php"
export QUERY_STRING="to=jdimm@yahoo.com&from=john.r.dimm@gmail.com&message=hi"; \
php -e -r 'parse_str($_SERVER["QUERY_STRING"], $_GET); include "../jquery/sendmail.php";'
sendmail using php

202
Array
(
    [0] => HTTP/1.1 202 Accepted
    [1] => Server: nginx
    [2] => Date: Mon, 16 Dec 2019 05:15:23 GMT
    [3] => Content-Length: 0
    [4] => Connection: keep-alive
    [5] => X-Message-Id: lCeOxsFNS8SBkgrI7kVOnQ
    [6] => Access-Control-Allow-Origin: https://sendgrid.api-docs.io
    [7] => Access-Control-Allow-Methods: POST
    [8] => Access-Control-Allow-Headers: Authorization, Content-Type, On-behalf-of, x-sg-elas-acl
    [9] => Access-Control-Max-Age: 600
    [10] => X-No-CORS-Reason: https://sendgrid.com/docs/Classroom/Basics/API/cors.html
    [11] => 
    [12] => 
)

cat sendmail_python.sh

echo "sendmail using python"
curl "http://35.231.58.42/cgi-bin/sendEmail.py?message=hi&from=john.r.dimm@gmail.com&to:jdimm@yahoo.com"
sendmail using python
202
b''
Server: nginx
Date: Mon, 16 Dec 2019 05:15:27 GMT
Content-Length: 0
Connection: close
X-Message-Id: 3HDBCy6BSVi6O549Rv8IWw
Access-Control-Allow-Origin: https://sendgrid.api-docs.io
Access-Control-Allow-Methods: POST
Access-Control-Allow-Headers: Authorization, Content-Type, On-behalf-of, x-sg-elas-acl
Access-Control-Max-Age: 600
X-No-CORS-Reason: https://sendgrid.com/docs/Classroom/Basics/API/cors.html


cat render_jinja2.sh

echo "template rendering in python using jinja2"
curl "http://35.231.58.42/cgi-bin/renderTemplate.py?template=hello%%name%%&name=Joshua"
template rendering in python using jinja2
helloJoshua
cat sendmail_node.sh

echo "sendmail in node"
curl "http://localhost:3000/sendMail?message=hi&from=john.r.dimm@gmail.com&to=jdimm@yahoo.com"
sendmail in node
202 Accepted, Mail sent successfully
echo ""
cat render_handlebars.sh

echo "render in node using handlebars"
curl "http://localhost:3000/renderTemplate?template=hello\{\{name\}\}&name=Kitty"
render in node using handlebars
helloKitty
```

  
#### Sendgrid Key Installation

Obtain a key from sendgrid and use it in three files.

Create the file sendgrid.env:

```
export SENDGRID_API_KEY='your key'
```

In jquery/sendmail.php:

```
$SENDGRID_API_KEY='your key';
```

In cgi-bin/sendEmail.py:

```
SENDGRID_API_KEY='your key'
```
