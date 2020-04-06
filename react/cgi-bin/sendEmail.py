#!/usr/bin/python
# using SendGrid's Python Library
# https://github.com/sendgrid/sendgrid-python

import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

import cgi
import json

form = cgi.FieldStorage()

if form.has_key("from") and form.has_key("to") and form.has_key("message"):
  #
  # Create an email using the values supplied in the url.
  #
  message = Mail(
    from_email=form['from'].value, 
    to_emails=form['to'].value, 
    html_content=form['message'].value) 
else:
  #
  # For testing, create an email with some example values.
  #
  message = Mail(
    from_email='from_email@example.com',
    to_emails='to@example.com',
    html_content='<strong>and easy to do anywhere, even with Python</strong>')

message.subject='From express and handlebars, a very interesting email just for you!!!'

SENDGRID_API_KEY='<your key>'

output = ''
try:
    sg = SendGridAPIClient(SENDGRID_API_KEY)
    response = sg.send(message)
    output += str(response.status_code)
    output += str(response.body)
    output += str(response.headers)
except Exception as e:
    output += '500'
    output += 'Caught exception: \nmessage: ' +  str(e.message)

#
# Wrap the output as json.
#
jsonObj = {"response":output}
j = json.JSONEncoder().encode(jsonObj)

print ("Content-type: text/json\n")
print(j)
