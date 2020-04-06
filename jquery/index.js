var fields = [];
var template = "";

function processTemplate() {
   template = $("#template").val();
   $("#templateFields").html('');

   //
   // Extract variable names from the template.
   //
   let regex = /%%.*?%%/g;
   let matches = template.match(regex);
   fields = [];
   matches.forEach(function(val, idx) {
     // Remove delimiters.
     let v = val.substring(2, val.length - 2);
     fields.push(v);

     //
     // Construct an input element for this variable
     //
     let inputElement =
       v
       + ": <input id='"
       + v
       + "' size='20' />"
       + "<br>";
     $("#templateFields").append(inputElement);
   });
}

function renderTemplate() {
   //
   // Replace variables in the template with their
   // values from the HTML input elements.
   //
   let message = template;
   fields.forEach(function(fieldName, idx) {
      let val = $("#" + fieldName).val();
      message = message.replace("%%" + fieldName + "%%", val);
   });
   $("#message").html(message);
}

function sendMail() {
  //
  // Get the current values of the html input elements.
  //
  let data = {
    to: $("#to").val(),
    from: $("#from").val(),
    message: $("#message").html()
  };

  //
  // Use post to send email using sendgrid.
  //

  let good = "<div style='color:darkgreen'>Send mail succeeded!</div>";
  let bad = "<div style='color:red'>Send mail failed.</div>";
  $.post({
    url: "sendmail.php",
    data: data,
    success: function(data) {
      if (data.indexOf("202 Accepted") == -1)  {
        $("#sendgrid_response").html(bad);
      }
      else
        $("#sendgrid_response").html(good);

      $("#sendgrid_data").html(data);
    },
    error: function(e) {
      $("#sendgrid_response").html(bad);
      $("#sendgrid_data").html(e.status + ": " + e.statusText);
    }

   });
}
