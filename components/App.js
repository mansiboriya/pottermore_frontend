import React, {Component} from 'react';
import axios from 'axios';

class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      username: '',
      password: '',
      userhouse: '',
      questions: [],
      currentquestion: null,
      register: false,
      loggedIn: false,
      user: {},
      completedAnswering: false,
    }
  }

  componentDidMount() {
    this.checkUser();
  }

  checkUser() {
    let loggedIn = false;
    try {
      let user = JSON.parse(localStorage['user'])
      console.log(user)
      if (user && user['name']) {
        let username = user['name']
        let password = user['password']
        let u = {username: username, password: password}
        axios.defaults.headers.common['Authorization'] = JSON.stringify(u);
        loggedIn = true;
        this.setState({user: user})
        this.sortingQuestions()
      }
    }
    catch(e) {
      console.log(e);
    }
    this.setState({loggedIn: loggedIn})
  }

  onChangeUsername(event) {
    let value = event.target.value;
    this.setState({username: value});
  }

  onChangePassword(event) {
    let value = event.target.value;
    this.setState({password: value});
  }

  register() {
    let username = this.state.username;
    let password = this.state.password;
    axios.post(`http://localhost:5000/register`, {username: username, password: password})
      .then(res => {
        const user = res.data;
        if (user && user['name']) {
          localStorage['user'] = JSON.stringify(user)
          this.checkUser();
        }
      })
  }

  login() {
    let username = this.state.username;
    let password = this.state.password;
    axios.post(`http://localhost:5000/login`, {username: username, password: password})
      .then(res => {
        const user = res.data;
        console.log(user);
        if (user && user['name']) {
          console.log(user);
          localStorage['user'] = JSON.stringify(user);
          this.checkUser();
        }
      })
  }

  logout() {
   localStorage['user'] = null
   this.checkUser()
  }

  submitButton() {
    this.login()
  }

  edituser(rolse){
    let role = rolse
    axios.post(`http://localhost:5000/edituser`, {role: role})
    .then(res => {
    })
  }

  sortuser(){
    axios.get(`http://localhost:5000/sortedhouse`)
    .then(res =>{
      console.log(res.data)
      let houseObj = res.data['house']
      let house = houseObj['Name']
      this.setState({userhouse: house})
      // console.log(this.state.userhouse)
      this.edituser(this.state.userhouse)
    })
  }

  sortingQuestions() {
    axios.get(`http://localhost:5000/questions`)
    .then( res =>{
      let questions = res.data['questions']
      this.setState({questions: questions})
      this.setQuestion();
    })
  }

  setQuestion() {
    let questions = this.state.questions;
    let currentquestion = this.state.currentquestion;
    if (currentquestion && currentquestion['index'] < questions.length - 1) {
      let index = currentquestion['index'] + 1
      let nextQuestion = questions[index]
      currentquestion = nextQuestion
      currentquestion['index'] = index
    }
    else if (!currentquestion && questions.length > 0) {
      currentquestion = questions[0]
      currentquestion['index'] = 0
    }
    else {
      this.completedAnswering()
    }
    this.setState({currentquestion: currentquestion})
  }

  completedAnswering() {
    this.setState({completedAnswering: true}, () => {
      this.sortuser()
    })
  }

  changeRegisterStatus(status) {
    this.setState({register:status})
  }

  logoutButton() {
    this.logout()
  }

  changeName(event) {
    let value = event.target.value;
    this.setState({username: value})
  }

  changePassword(event) {
    let value = event.target.value;
    this.setState({password: value})
  }

  render() {
    return (
      <div>
        {!this.state.loggedIn ? this.renderLoginStuff() : this.renderRegisterStuff()}
      </div>

    )
  }

  renderLoginStuff() {
    return (
      <div>
        {this.renderLogin()}
        {this.renderSubmit()}

        <div className="text-center text-white mt-3">
        { this.state.register ? (
            <div> Already have an account?
              <a href="#" onClick={() => this.changeRegisterStatus(false)}> Login here!</a>
            </div>
          ) : (
            <div> Don't have an account?
              <a href="#" onClick={() => this.changeRegisterStatus(true)}> Register here!</a>
            </div>
          )
        }
        </div>
      </div>
    )
  }

  renderRegisterStuff() {
    return (
      <div className="text-white">
        {/* {window.location.replace('/slytherin')} */}
        {this.renderLogout()}
        {this.renderAfterSort()}
        {this.renderSortingQuestion()}

      </div>
    )
  }

  renderLogin() {
    return (
      <div className="text-white">
        {/* Login */}
      <div className="text-center">
        <h1>{this.state.register ? "Register" : "Login" }</h1>
      </div>
      <div className="row mt-3 text-center">
        <div className="col-md-12">
          <div> Username:
            <span className= "p-1">
              <input type="text" name="uname" value={this.state.username} onChange={(event) => this.changeName(event)} placeholder="Username" />
            </span>
          </div>
        </div>
      </div>

      <div className="row mt-3 text-center">
        <div className="col-md-12">
          <div >Password:
            <span className= "p-1">
              <input type="password" name="password" value={this.state.password} onChange={(event) => this.changePassword(event)} placeholder="Password" />
            </span>
          </div>
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
          {/* <button className="btn btn-danger" onClick={() => this.logoutButton()}>Logout</button> */}
        </div>
      </div>
    </div>
    )
  }

  renderSubmit() {
    return(
        <div>
          <div className="row text-center mt-3 text-white">
            <div className="col-md-12">
              {this.state.register ? (
                <div>
                  <button onClick={() => this.register()}>Register</button>
                </div>
              ) : (
                <div>
                  <button onClick={() => this.submitButton()}>Login</button>
                </div>
              ) }
            </div>
          </div>
        </div>
        )
  }

  renderAfterSort() {
    if (!this.state.userhouse) {
      return ''
    }

    return (
      <div className="text-white text-center">
        {window.location.replace(`/${this.state.userhouse}`)}
      </div>
    )
  }


  renderSortingQuestion() {
    let currentquestion = this.state.currentquestion;

    if (!currentquestion || this.state.completedAnswering) {
      return ''
    }

    let choices = []
    choices = currentquestion['choice'].map((c, index) => {
      return (
        <div key={index} className="col-md-12">
          <div className="p-2 px-3 bg-secondary text-dark rounded my-2">
            <input type="radio" name={`choice${currentquestion['index']}`} />
            <span className="ml-2">{c}</span>
          </div>
        </div>
      )
    })

    return(
      <div className="row">
        <div className="col-md-4 offset-md-4">
          <div className="text-white">
            <h3 className="p-2 bg-light text-dark text-center rounded">{currentquestion['question']}</h3>
            <div className="row">
              {choices}
            </div>
            <div className="mt-2 text-center">
              <button className="text-center" onClick={() => this.setQuestion()}>Next</button>
            </div>
          </div>
        </div>
      </div>

    )
  }

}


export default App;