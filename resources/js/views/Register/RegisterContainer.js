import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import ReactDOM from 'react-dom';
import FlashMessage from 'react-flash-message';

class RegisterContainer extends Component {
  // 2.1
  constructor(props) {
    super(props);
    this.state = {
      isRegistered: false,
      error: '',
      errorMessage: '',
      formSubmitting: false,
      user: {
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        bio: '',
        password: '',
        password_confirmation: '',
    },
    redirect: props.redirect,
};
this.handleSubmit = this.handleSubmit.bind(this);
this.handleFName = this.handleFName.bind(this);
this.handleLName = this.handleLName.bind(this);
this.handleEmail = this.handleEmail.bind(this);
this.handleBio = this.handleBio.bind(this);
this.handleUsername = this.handleUsername.bind(this);
this.handlePassword = this.handlePassword.bind(this);
this.handlePasswordConfirm = this.handlePasswordConfirm.bind(this);
}
// 2.2
// componentWillMount, componentDidMount etc etc that have //componentStuffStuff are known as React Lifecycles which of course //you already know 
componentWillMount() {
  let state = localStorage["appState"];
  if (state) {
    let AppState = JSON.parse(state);
    this.setState({isLoggedIn: AppState.isLoggedIn, user: AppState});
  }
  if (this.state.isRegistered) {
    return this.props.history.push("/dashboard");
  }
}
// 2.3
componentDidMount() {
  const { prevLocation } = this.state.redirect.state || {prevLocation: { pathname: '/dashboard' } };
  if (prevLocation && this.state.isLoggedIn) {
    return this.props.history.push(prevLocation);
  }
}
// 2.4
handleSubmit(e) {
  e.preventDefault();
  this.setState({formSubmitting: true});
  ReactDOM.findDOMNode(this).scrollIntoView();
  let userData = this.state.user;
  axios.post("/api/auth/signup", userData)
    .then(response => {
      return response;
  }).then(json => {
      if (json.data.success) {
        let userData = {
          id: json.data.id,
          first_name: json.data.first_name,
          last_name: json.data.last_name,
          username: json.data.username,
          bio: json.data.bio,
          email: json.data.email,
          activation_token: json.data.activation_token,
        };
        let appState = {
          isRegistered: true,
          user: userData
        };
        localStorage["appState"] = JSON.stringify(appState);
        this.setState({
          isRegistered: appState.isRegistered,
          user: appState.user
        });
      } else {
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
handleFName(e) {
  let value = e.target.value;
  this.setState(prevState => ({
    user: {
      ...prevState.user, first_name: value
    }
  }));
}
handleLName(e) {
  let value = e.target.value;
  this.setState(prevState => ({
    user: {
      ...prevState.user, last_name: value
    }
  }));
}

handleUsername(e) {
  let value = e.target.value;
  this.setState(prevState => ({
    user: {
      ...prevState.user, username: value
    }
  }));
}
// 2.5
handleEmail(e) {
  let value = e.target.value;
  this.setState(prevState => ({
    user: {
      ...prevState.user, email: value
    }
  }));
}
handleBio(e) {
  let value = e.target.value;
  this.setState(prevState => ({
    user: {
      ...prevState.user, bio: value
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
handlePasswordConfirm(e) {
  let value = e.target.value;
  this.setState(prevState => ({
    user: {
      ...prevState.user, password_confirmation: value
    }
  }));
}
render() {
  // 2.6
  let errorMessage = this.state.errorMessage;
  let arr = [];
  Object.values(errorMessage).forEach((value) => (
    arr.push(value)
  ));
  return (
      <div class="main">
        <section class="signup">
            <div class="container">
                <div class="signup-content">
                    <div class="signup-form">
                        <h2 class="form-title">Create your account</h2>
                        {this.state.isRegistered ? <FlashMessage duration={60000} persistOnHover={true}>
                        <h5 className={"alert alert-success"}>Registration successful. </h5>
                        <p>Please check your registered email for account verification.</p>
                        </FlashMessage> : ''}
                      {this.state.error ? <FlashMessage duration={900000} persistOnHover={true}>
                        <h5 className={"alert alert-danger"}>{this.state.error}</h5>
                        </FlashMessage> : ''}
                        <form onSubmit={this.handleSubmit} class="register-form" id="register-form">
                            <div class="form-group">
                                <label for="first_name"><i class="zmdi zmdi-account material-icons-name"></i></label>
                                <input type="text" name="first_name" id="name" placeholder="Your First Name" autocomplete="off" onChange={this.handleFName}/>
                            <p className="errorMsg">{ this.state.errorMessage.first_name }</p>
                            </div>
                            <div class="form-group">
                                <label for="last_name"><i class="zmdi zmdi-account material-icons-name"></i></label>
                                <input type="text" name="last_name" id="last_name" placeholder="Your Last Name" autocomplete="off" onChange={this.handleLName}/>
                            <p className="errorMsg">{ this.state.errorMessage.last_name }</p>
                            </div>
                            <div class="form-group">
                                <label for="email"><i class="zmdi zmdi-email"></i></label>
                                <input type="email" name="email" id="email" placeholder="Your Email" autocomplete="off" onChange={this.handleEmail} />
                            <p className="errorMsg">{ this.state.errorMessage.email }</p>
                            </div>
                            <div class="form-group">
                                <label for="username"><i class="zmdi zmdi-email"></i></label>
                                <input type="text" name="username" id="username" placeholder="Your Username" autocomplete="off" onChange={this.handleUsername} />
                            <p className="errorMsg">{ this.state.errorMessage.username }</p>
                            </div>
                            <div class="form-group">
                                <label for="bio"><i class="zmdi zmdi-email"></i></label>
                                <input type="text" name="bio" id="bio" placeholder="About yourself" autocomplete="off" onChange={this.handleBio} />
                            <p className="errorMsg">{ this.state.errorMessage.bio }</p>
                            </div>
                            <div class="form-group">
                                <label for="pass"><i class="zmdi zmdi-lock"></i></label>
                                <input type="password" name="pass" id="pass" placeholder="Password" autocomplete="off" onChange={this.handlePassword} />
                            <p className="errorMsg">{ this.state.errorMessage.password }</p>
                            </div>
                            <div class="form-group">
                                <label for="re-pass"><i class="zmdi zmdi-lock-outline"></i></label>
                                <input type="password" name="re_pass" id="re_pass" placeholder="Confirm your password" autocomplete="off" onChange={this.handlePasswordConfirm} />
                            </div>
                            <div class="form-group form-button">
                                <input type="submit" name="signup" disabled={this.state.formSubmitting ? "disabled" : ""}  id="signup" class="form-submit btn btn-primary btn-lg btn-block" value="Register"/>
                            </div>
                        </form>
                    </div>
                    <div class="signup-image">
                        <figure><img src="assets/img/signup.gif" alt="sing up image"></img></figure>
                        <p><a href="/login">I am already a member</a></p>
                    </div>
                </div>
            </div>
        </section>
    </div>
    )
  }
}
// 2.8
export default withRouter(RegisterContainer);