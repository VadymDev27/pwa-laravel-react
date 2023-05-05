import React, { Component } from 'react';
import axios, { post } from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import {DropzoneArea} from 'material-ui-dropzone'
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {Link, withRouter} from 'react-router-dom';
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
  this.state ={
    error: '',
    caption: '',
    hashtags: '',
    selectedFile: null,
    isLoggedIn: false,
    user: {},
    isPosted: false,
  }
  this.onFormSubmit = this.onFormSubmit.bind(this)
  this.onChange = this.onChange.bind(this)
  this.fileUpload = this.fileUpload.bind(this)
  this.handleCaption = this.handleCaption.bind(this);
  this.handleHashtags = this.handleHashtags.bind(this);
}

// check if user is authenticated and storing authentication data as states if true
componentWillMount() {
  let state = localStorage["appState"];
  if (state) {
    let AppState = JSON.parse(state);
    this.setState({ isLoggedIn: AppState.isLoggedIn, user: AppState.user });
  }
}

onFormSubmit(e){
  e.preventDefault();
  this.setState({formSubmitting: true});
  var userData = this.state.user;
  const postData = { caption: this.state.caption, hashtags: this.state.hashtags, file : this.state.selectedFile }
  const headers = {
    'Authorization': 'Bearer '+userData.access_token,
  }
  axios.post("/api/auth/postnew", postData,  {
    headers: headers
  }).then(response => {
    return response;
  }).then(json => {
      if (json.data.success) {
        
        let appState = {
          isPosted: true,
        };
        this.setState({
          isPosted: appState.isPosted,
          formSubmitting : false,
        });
      } else {
          alert(`Our System Failed To Share your post.`);
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

onChange(e) {
  let files = e.target.files || e.dataTransfer.files;
  if (!files.length)
    return;
  this.createImage(files[0]);
}
createImage(file) {
  let reader = new FileReader();
  reader.onload = (e) => {
    this.setState({
      selectedFile: e.target.result
    })
  };
  reader.readAsDataURL(file);
}
handleChange(e) {
    this.setState({
      selectedFile: e.target.files[0],
    })
  }

handleCaption(e) {
  let value = e.target.value;
  this.setState({
    caption : value
  });
}
handleHashtags(e) {
  let value = e.target.value;
  this.setState({
    hashtags : value
  });
}
fileUpload(image){
  const url = '/api/auth/postnew';
  let state = localStorage["appState"];
  if (state) {
    let AppState = JSON.parse(state);
  }

  const formData = {file: this.state.files, caption: this.state.caption, hashtags: this.state.hashtags }
  return  post(url, formData)
  .then(response => console.log('backend :'+response))
}

render()
{
  return(
    <div className="photos mr-auto ml-auto col-xs-12 col-sm-12 col-md-8 col-lg-8">
    <form enctype="multipart/form-data" onSubmit={this.onFormSubmit}>
      {this.state.isPosted ? <FlashMessage duration={60000} persistOnHover={true}>
      <h5 className={"alert alert-success"}>Post has been shared successfully. </h5>
      </FlashMessage> : ''}
    {this.state.error ? <FlashMessage duration={900000} persistOnHover={true}>
      <h5 className={"alert alert-danger"}>{this.state.error}</h5>
      </FlashMessage> : ''}
    <h3>New Post</h3><hr/>
    <TextField className="col-lg-12" id="standard-basic" label="Caption ie. My new post" onChange={this.handleCaption} /><br/><br/>
    <TextField className="col-lg-12" id="standard-basic" label="Hastags ie. fun, enjoy" onChange={this.handleHashtags} /><br/><br/>
    <div class="d-flex justify-content-center col-lg-12">
      <div class="btn btn-mdb-color btn-rounded float-left">
        <span>Choose file</span>
        <input type="file" onChange={this.onChange} />
      </div>
    </div>
    <div className="form-group form-button">
    <input type="submit"  disabled={this.state.formSubmitting} name="signin" id="signin" className="form-submit btn btn-primary btn-lg btn-block" value={this.state.formSubmitting ? "Posting..." : "Share my post"} />
    </div>
    </form>
    </div>
    )
}
}