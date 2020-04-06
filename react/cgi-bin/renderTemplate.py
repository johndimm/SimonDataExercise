#!/usr/bin/python
import sys
import cgi
import json
from jinja2 import Environment, BaseLoader, Template

print ("Content-type: text/json\n")

# 
# Get cgi params.
#
formData = cgi.FieldStorage()
#
# Gather into a context hash.
#
context = {} 
for i in formData.keys():
 context[i] = formData[i].value

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
templateSrc = context['template']
template=env.from_string(templateSrc)
renderedTemplate = template.render(context)

#
# Convert output to json. 
#
jsonObj = {"response":renderedTemplate}
j = json.JSONEncoder().encode(jsonObj)

print(j)


