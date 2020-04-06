//
// Uses sendgrid to send an email.
//
class SendMail extends React.Component {
  constructor(props, context) {
    super(props, context);

    //
    // The to and from email addresses are managed here in state,
    // but the message comes from the parent in props.
    //
    this.state = {
      sendgrid_data: '',
      to: '',
      from: ''
    }
  }

  sendMail() {
    let data = {
      to: this.state.to,
      from: this.state.from,
      message: this.props.message
    };

    //
    // Send email using sendgrid.
    //

    let url = "/sendMail";

    fetch("php/mysql.php",{
          method: "POST",
          body: data
        })
          .then(function (response) {
              return response.json();
        }).then(function (result) {
            fnSuccess(result[0]);
        }.bind(this));

    $.ajax({
      url: "/sendMail",
      data: data,
      success: function(data) {
        //
        // Save the sendgrid response.
        //
        this.setState({sendgrid_data: data});
      }.bind(this),
      error: function(e) {
        alert(e.message);
      }
    });
  }

  onChangeValueHandler(val) {
    this.setState({ [val.target.id]: val.target.value })
  }

  render() {
    var response = '';
    var fontColor = '';

    let onChange = this.onChangeValueHandler.bind(this);

    //
    // Was the email sent?  (not checking if it was received though)
    //
    if (this.state.sendgrid_data.indexOf('202') == 0) {
      response = 'Send mail succeeded!';
      fontColor = 'darkgreen';
    }  else if (this.state.sendgrid_data != '') {
      response = 'Send mail failed.';
      fontColor = 'red';
    }

    return (
      <div className="step">
        <div className="title">
          3. Send it
        </div>

        <div>
            From: <input id="from" size="20" onChange={onChange}/>
            <br />
            To: <input id="to" size="20" onChange={onChange} />
        </div>

        <pre><div id="message">{this.props.message}</div></pre>

        <button onClick={this.sendMail.bind(this)}>send mail</button>

        <div id="sendgrid_response" style={{color:fontColor}}>{response}</div>
        <div id="sendgrid_data">{this.state.sendgrid_data}</div>
      </div>
    );
  }
}

//
//  Displays the fields extracted from the template as HTML input elements.
//  Generates the email message from the template and supplied values for variables.
//
class RenderedTemplate extends React.Component {

  //
  // The template variables will become fields in state.
  //
  constructor(props, context) {
    super(props, context);
  }

  renderTemplate() {
    //
    // Add the template to state, just for this ajax call.
    //
    this.state.template = this.props.template;

    $.ajax({
      url: "/renderTemplate",
      data: this.state, // data,
      success: function(data) {
        //
        // Update parent with new value for message, which goes into its state,
        // causing a render of this component.
        //
        this.props.onChangeValue({ target : { value: data, id:'message'}});
      }.bind(this),
      error: function(e) {
        alert(e.message);
      }
    });
  }

  onChangeValueHandler(val) {
    this.setState({ [val.target.id]: val.target.value })
  }

  render() {
    let onChange = this.onChangeValueHandler.bind(this);
    let renderTemplate = this.renderTemplate.bind(this);

    let templateFields = this.props.fields.map(function(val, idx) {
      //
      // Construct an input element for each template variable.
      //
      return (
        <div key={idx}>
          {val} : <input id={val} size='20' onChange={onChange}/>
        </div>
      )
    }.bind(this));

    return (
      <div className="step">
          <div className="title">
            2. Supply values for the variables
          </div>
          <div id="templateFields">{templateFields}</div>
          <button onClick={renderTemplate}>preview email message</button>
      </div>
    );
  }
}

//
//  Root class, holds the template editor.
//
class Mailmerge extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      fields: [],
      template: '',
      message: ''
    }
  }

  processTemplate() {
    //
    // Get the user-defined template from the HTML textarea.
    //
    let template = this.state.template;

    //
    // Extract variable names from the template.
    //
    let regex = /{{.*?}}/g;
    let matches = template.match(regex);
    let fields = [];
    matches.forEach(function(val, idx) {
      let v = val.substring(2, val.length - 2);
      fields.push(v);
    });

    this.setState({fields: fields});
  }

  onChangeValueHandler(val) {
    this.setState({ [val.target.id]: val.target.value })
  }

  render() {
    let example =
`Example:

Hi {{contact_first_name}}

Get {{discount_rate}} off your next purchase using this discount code:
    {{discount_code}}
`;

    let onChange = this.onChangeValueHandler.bind(this);

    return (
      <div>

        <div id="titleBar">
            <div id="pageTitle">
              Mail Merge
            </div>
            <i>using react, python, and jinja2</i>
        </div>

        <div className="step">
            <div className="title">
              1.  Create an email template
            </div>

            <textarea id="template" rows="8" cols="80"
              onChange={onChange}></textarea>
            <pre>{example}</pre>
            <button onClick={this.processTemplate.bind(this)}>process template</button>
        </div>

        <RenderedTemplate
          fields={this.state.fields}
          template={this.state.template}
          onChangeValue={onChange} />

        <SendMail message={this.state.message} />

      </div>
    );
  }

}

function renderRoot() {
  var domContainerNode = window.document.getElementById('root');
  ReactDOM.render(<Mailmerge />, domContainerNode);
}

// $(document).ready (function() {
  renderRoot();
// });
