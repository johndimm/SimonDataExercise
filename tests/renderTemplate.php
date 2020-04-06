<?php
$template = $_GET['template'];

//
// Find the variables.
//
preg_match_all('/%%(.*?)%%/', $template, $matches);

//
// Render the template on the server.
//
$message = $template;
foreach ($matches[1] as $name) {
  $val = $_GET[$name];
  $message = str_replace("%%" . $name . "%%", $val, $message);
}

print($message);
?>
