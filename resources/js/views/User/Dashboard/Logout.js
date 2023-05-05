import React, { Component } from 'react';
import axios, { post } from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import {DropzoneArea} from 'material-ui-dropzone'
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {Link, Redirect, withRouter} from 'react-router-dom';
import ReactDOM from 'react-dom';
import FlashMessage from 'react-flash-message';
const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));
export default class UploadNew extends Component
{

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
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentWillMount() {
    let state = localStorage["appState"];
    if (state) {
      let AppState = JSON.parse(state);
      this.setState({isLoggedIn: AppState.isLoggedIn, user: AppState});
    }
  }
  

handleLogout(e){
  e.preventDefault();
  this.setState({formSubmitting: true});
  var userData = this.state.user;
  const headers = {
    'Authorization': 'Bearer '+userData.user.access_token,
  }
  axios.get("/api/auth/logout",  {
    headers: headers
  }).then(response => {
    return response;
  }).then(json => {
      if (json.data.message == "Successfully logged out") {
          let appState = {
             isLoggedIn: false,
           };
          localStorage["appState"] = JSON.stringify(appState);
           this.setState({
              isLoggedIn: appState.isLoggedIn,
              error: ''
           });
           location.reload()
      } else {
          alert(`Our System Failed to log you out.`);
      }
 }).catch(error => {if (error.response) {
      // The request was made and the server responded with a status code that falls out of the range of 2xx
      let err = error.response.data;
      this.setState({
        error: err.message,
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


render()
{
  return(
    <button type="button" onClick={this.handleLogout} class="btn btn-danger">Logout</button>
    )
}
}