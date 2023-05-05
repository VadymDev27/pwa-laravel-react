import React, {Component} from 'react';
import {Link, Redirect, withRouter} from 'react-router-dom';
import FlashMessage from 'react-flash-message';
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";

class LoginContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      error: '',
      formSubmitting: false,
      user: {
        email: '',
        password: '',
      },
      redirect: props.redirect,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEmail = this.handleEmail.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
  }
  componentWillMount() {
    let state = localStorage["appState"];
    if (state) {
      let AppState = JSON.parse(state);
      this.setState({isLoggedIn: AppState.isLoggedIn, user: AppState});
    }
  }
  componentDidMount() {
    const { prevLocation } = this.state.redirect.state || { prevLocation: { pathname: '/dashboard' } };
    if (prevLocation && this.state.isLoggedIn) {
      return this.props.history.push(prevLocation);
    }
  }
  handleSubmit(e) {
    e.preventDefault();
    this.setState({formSubmitting: true});
    let userData = this.state.user;
    axios.post("/api/auth/login", userData).then(response => {
      return response;
    }).then(json => {
         if (json.data.success) {
           let userData = {
             id: json.data.id,
             name: json.data.name,
             email: json.data.email,
             access_token: json.data.access_token,
           };
           let appState = {
             isLoggedIn: true,
             user: userData
           };
           localStorage["appState"] = JSON.stringify(appState);
           this.setState({
              isLoggedIn: appState.isLoggedIn,
              user: appState.user,
              error: ''
           });
           location.reload()
         }
         else {
            alert(`Our System Failed To Register Your Account!`);
         }
    }).catch(error => {if (error.response) {
        // The request was made and the server responded with a status code that falls out of the range of 2xx
        let err = error.response.data;
        this.setState({
          error: err.message,
          errorMessage: err.errors,
          formSubmitting: false
        })
      }
      else if (error.request) {
        // The request was made but no response was received `error.request` is an instance of XMLHttpRequest in the browser and an instance of http.ClientRequest in node.js
        let err = error.request;
        this.setState({
          error: err,
          formSubmitting: false
        })
     } else {
       // Something happened in setting up the request that triggered an Error
       let err = error.message;
       this.setState({
         error: err,
         formSubmitting: false
       })
   }
 }).finally(this.setState({error: ''}));
}
handleEmail(e) {
  let value = e.target.value;
  this.setState(prevState => ({
    user: {
      ...prevState.user, email: value
    }
  }));
}
handlePassword(e) {
  let value = e.target.value;
  this.setState(prevState => ({
    user: {
      ...prevState.user, password: value
    }
  }));
}
render() {
  const { state = {} } = this.state.redirect;
  const { error } = state;
  return (
    <div className="main">
        <section className="sign-in">
            <div className="container">
                <div className="signin-content">
                    <div className="signin-image">
                        <figure><img src=
                        "assets/img/signin-image.png" alt="sing up image"></img></figure>
                        <p>Don't have an account ? </p><a href="/register" className="signup-image-link">Create an account</a>
                    </div>

                    <div className="signin-form">
                        <h2 className="form-title">Sign in</h2>
                        {this.state.isLoggedIn ? <FlashMessage duration={60000} persistOnHover={true}>
                        <h5 className={"alert alert-success"}>Login successful, redirecting...</h5></FlashMessage> : ''}
                        {this.state.error ? <FlashMessage duration={100000} persistOnHover={true}>
                        <h5 className={"alert alert-danger"}> {this.state.error}</h5></FlashMessage> : ''}
                        {error && !this.state.isLoggedIn ? <FlashMessage duration={100000} persistOnHover={true}>
                        <h5 className={"alert alert-danger"}> {error}</h5></FlashMessage> : ''}
                        <form onSubmit={this.handleSubmit} className="register-form" id="login-form">
                            <div className="form-group">
                                <label for="email"><i className="zmdi zmdi-account material-icons-name"></i></label>
                                <input type="email" name="email" id="email" placeholder="Email" autocomplete="off" onChange={this.handleEmail} />
                            </div>
                            <div class="form-group">
                                <label for="your_pass"><i class="zmdi zmdi-lock"></i></label>
                                <input type="password" name="your_pass" id="your_pass" placeholder="Password" autocomplete="off" onChange={this.handlePassword} />
                            </div>
                            <div class="form-group form-button">
                                <input type="submit"  disabled={this.state.formSubmitting} name="signin" id="signin" class="form-submit btn btn-primary btn-lg btn-block" value={this.state.formSubmitting ? "Logging You In..." : "Log In"} />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    </div>
    )
  }
}
export default withRouter(LoginContainer);