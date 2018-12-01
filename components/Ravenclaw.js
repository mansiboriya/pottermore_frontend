import React, {Component} from 'react';
import axios from 'axios';

class Ravenclaw extends Component {

  constructor(props) {
    super(props)
    this.state = {
      username: '',
    }
  }


  componentDidMount() {
    this.checkUser();
  }

  checkUser() {
    let loggedIn = false;
    try {
      let user = JSON.parse(localStorage['user']);
      // axios.defaults.headers.common['Authorization'] = user['api_token'];
      console.log(user)
      if (user && user['name']) {
        loggedIn = true;
        this.setState({user: user})
      }
    }
    catch(e) {
      console.log(e);
    }
    this.setState({loggedIn: loggedIn})
  }


  logout() {
    localStorage['user'] = null
    console.log("checking here")
    window.location.replace('/')
   }

   logoutButton() {
     this.logout()
   }

  render() {
    return(
      <div>
        <div>
          {this.renderLogout()}
        </div>

        <div className="row text-white text-center">
          <div className="col-md-12 ml-2">
            <p> Welcome to your house, little one! </p>
            <p> You’re going to live here in Hogwarts for the next 7 years...</p>
            <p> First, You need to get access to the common room. To gain the access,</p>
            <p> You’re going to have to go on a small quest yourself to attain the Password. </p>
          </div>
        </div>

        <div className="row text-white text-center">
          <div className="col-md-12">
            <h3>Are You Ready?</h3>
          </div>
        </div>

        <div className="row text-white text-center">
          <div className="col-md-6 text-right">
          <button type="button" className="btn btn-outline-warning">YES</button>
          </div>
          <div className="col-md-6 text-left">
          <button type="button" className="btn btn-outline-warning">NO</button>
          </div>
        </div>



      </div>
    )
  }

  renderLogout() {
    return(
      <div>
      <div className="row text-right mt-3 text-white">
        <div className="col-md-12">
          <button className="btn btn-primary" onClick={() => this.logoutButton()}>Logout</button>
        </div>
      </div>
    </div>
    )
  }


}
export default Ravenclaw ;