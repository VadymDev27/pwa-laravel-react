import React, {Component} from 'react';
import {Link, Redirect, withRouter} from 'react-router-dom';
import FlashMessage from 'react-flash-message';
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";

class LoginContainer extends Component {
render() {
  return (
 <div className="main">
        <section className="sign-in">
            <div className="container">
                <div className="signin-content">
                    <div className="signin-image">
                        <figure><img className="verified-img" src=
                        "assets/img/verified.gif" alt="sing up image"></img></figure>
                    </div>

                    <div className="signin-form">
                        <h2 className="form-title">Your account has been verified.</h2>
                    <h3 className="text-white">
                    <Link to="/login" className="text-yellow"> You can now Login</Link></h3>
                    </div>
                </div>
            </div>
        </section>
    </div>
    )
  }
}
export default withRouter(LoginContainer);