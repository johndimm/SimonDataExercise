echo ""
cat render_handlebars.sh

echo "render in node using handlebars"

QUERY_STRING="template=hello+from+handlebars+and+how+are+you+{{name}}&name=Mr.+Wilson"
# URL="https://shrouded-harbor-29005.herokuapp.com/renderTemplate"
URL="http://localhost:3000/renderTemplate"
# URL="http://localhost:3000/receiveForm"

curl -d $QUERY_STRING -X POST $URL
