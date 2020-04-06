cat render_jinja2.sh

echo "template rendering in python using jinja2"
QUERY_STRING="template=hello+%%name%%+from+renderTemplate.py&name=Mr.+Anderson"
curl -d $QUERY_STRING -X POST "http://localhost/cgi-bin/renderTemplate.py"
