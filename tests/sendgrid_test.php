
<?php
// require 'vendor/autoload.php'; // If you're using Composer (recommended)
// Comment out the above line if not using Composer
require("sendgrid-php/sendgrid-php.php");
// If not using Composer, uncomment the above line and
// download sendgrid-php.zip from the latest release here,
// replacing <PATH TO> with the path to the sendgrid-php.php file,
// which is included in the download:
// https://github.com/sendgrid/sendgrid-php/releases

$from = 'john.r.dimm@gmail.com'; #$_GET['from'];
$to = 'jdimm@gmail.com'; #$_GET['to'];
$message = 'hi'; # $_GET['message'];
$SENDGRID_API_KEY='<your key>';

$email = new \SendGrid\Mail\Mail(); 
$email->setFrom($from, "Sender");
$email->setSubject("mail from mailmerge");
$email->addTo($to, "Recipient");
$email->addContent("text/plain",  $message);

$sendgrid = new \SendGrid($SENDGRID_API_KEY);
try {
    $response = $sendgrid->send($email);
    print $response->statusCode() . "\n";
    print_r($response->headers());
    print "response body:" . $response->body() . "\n";
} catch (Exception $e) {
    echo 'Caught exception: '. $e->getMessage() ."\n";
}
