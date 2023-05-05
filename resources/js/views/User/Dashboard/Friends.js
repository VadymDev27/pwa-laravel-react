import React, {Component} from 'react';
import {Link, Redirect, withRouter} from 'react-router-dom';
import FlashMessage from 'react-flash-message';
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";
import { css } from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";


// Can be a string as well. Need to ensure each key-value pair ends with ;
const override = css`
display: block;
margin: 0 auto;
border-color: red;
`;


export default class Friends extends Component {

  constructor(props){
    super(props);
    this.state = {
      friends : [],
      next_page : '/api/auth/allusers',
      loading : false,
      error: '',
      isLoggedIn: false,
      user: {},
      isListEmpty: true,
    }
  }

  // check if user is authenticated and storing authentication data as states if true
  componentWillMount() {
    let state = localStorage["appState"];
    if (state) {
      let AppState = JSON.parse(state);
      this.setState({ isLoggedIn: AppState.isLoggedIn, user: AppState.user });
    }
  }

  componentDidMount(){
    this.getTimeline();
  }

  getTimeline(){
    if(!this.state.loading){

        // Set loading state to true to
        // avoid multiple requests on scroll
        this.setState({
          loading : true,
        });

        // register scroll event
        this.registerScrollEvent();
        var userData = this.state.user;
        const headers = {
          'Authorization': 'Bearer '+userData.access_token,
        }
        // make XHR request
        axios.get(this.state.next_page,  {
          headers: headers
        }).then((response) => {
          const paginator = response.data,
          friends = paginator.data;

          if(friends.length){
                    // add new 
                    this.setState({
                      friends : [...this.state.friends , ...friends],
                      next_page : paginator.next_page_url,
                      loading: false,
                      isListEmpty : false,
                    });
                  }

                // remove scroll event if next_page_url is null
                if(!paginator.next_page_url){
                  this.removeScrollEvent();
                }
              });
      }
    }

    registerScrollEvent(){
      $(window).on('scroll', function() {
        if($(window).scrollTop() + $(window).height() === $(document).height()) {
          this.getTimeline();
        }
      }.bind(this));

    }

    removeScrollEvent(){
      $(window).off('scroll');
    }

    render() {

      return (
        <div className="photos mr-auto ml-auto col-xs-12 col-sm-12 col-md-8 col-lg-8">
        <h3>Friends</h3><hr/>
        {
          this.state.friends.map((friend) =>{
            return (

              <div className="col-lg-12 col-md-6 mb-4">
              <div class="card profile-card" >
                  <div class="row no-gutters">
                      <div class="col-sm-5">
                          <img class="card-img" src={friend.file} alt={friend.name} />
                      </div>
                      <div class="col-sm-7">
                          <div class="card-body">
                              <h3>{friend.username}</h3>
                              <h5 class="card-title">{friend.name}</h5>
                              <p class="card-text">{friend.bio}</p>
                          </div>
                      </div>
                  </div>
              </div>
              </div>
              )
            })
          }
          {this.state.isListEmpty ? 
            <h3 className="card-title"> No users yet.</h3> : ''}
            <ClipLoader
            css={override}
            size={50}
            color={"#123abc"}
            loading={this.state.loading}
            />
            </div>
            );
          }
        }