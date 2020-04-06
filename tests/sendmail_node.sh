cat sendmail_node.sh

echo "sendmail in node"
QUERY_STRING="message=hi+from+node&from=john.r.dimm@gmail.com&to=john.r.dimm@gmail.com"
URL="https://shrouded-harbor-29005.herokuapp.com/sendMail"

curl -d $QUERY_STRING -X POST $URL
