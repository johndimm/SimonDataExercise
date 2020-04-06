cat sendmail_python.sh

echo "sendmail using python"
QUERY_STRING="message=test+of+sendEmail.py&from=john.r.dimm@gmail.com&to:john.r.dimm@gmail.com"
curl -d $QUERY_STRING -X POST "http://localhost/cgi-bin/sendEmail.py"
