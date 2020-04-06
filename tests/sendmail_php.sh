cat sendmail_php.sh

echo "sendmail using php"
export QUERY_STRING="to=john.r.dimm@gmail.com&from=john.r.dimm@gmail.com&message=test+of+sendmail.php"; \
php -e -r 'parse_str($_SERVER["QUERY_STRING"], $_POST); include "../jquery/sendmail.php";'
