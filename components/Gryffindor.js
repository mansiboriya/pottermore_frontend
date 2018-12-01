import React, {Component} from 'react';
import axios from 'axios';

class Gryffindor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      directions: [],
      answers: {},
      currentquestion: null,
      showDirections: false,
    }
  }


  componentDidMount() {
    this.checkUser();
    this.getDirections();
    this.getAnswers();
  }

  checkUser() {
    let loggedIn = false;
    try {
      let user = JSON.parse(localStorage['user']);
      // axios.defaults.headers.common['Authorization'] = user['api_token'];
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

  getDirections() {
    axios.get(`http://localhost:5000/directions`)
    .then(res => {
      let data = res.data;
      this.setState({directions: data['directions']}, () => {
        this.setQuestion();
      });
    })
  }

  getDirectionsByID(id) {
    let directions = this.state.directions;
    let get_index = directions.findIndex(d => d.id == id)
    if (get_index > -1) {
      this.setState({currentquestion: directions[get_index]})
    }
  }

  checkAnswer() {
    let currentAnswer = this.state.currentAnswer;
    let currentquestion = this.state.currentquestion;
    let index_id = currentquestion['index_id'];
    let commands = currentquestion['command']
    if (commands.includes(currentAnswer)) {
      this.setQuestion()
    }
    else {
      let fallback = currentquestion['ignore'];
      if (fallback && fallback['index']) {
        currentquestion = this.getDirectionsByID(fallback['index'])
        currentquestion['index_id'] = currentquestion['index_id'] + index_id
      }
      else {
        this.setQuestion()
      }
    }
    this.setState({currentquestion: currentquestion})

  }

  getAnswers() {
    axios.get(`http://localhost:5000/answers`)
    .then(res => {
      let data = res.data;
      this.setState({answers: data});
    })
  }

  showDirections(status) {
    let showDirections = this.state.showDirections;
    this.setState({showDirections: status});
  }

  setQuestion() {
    let directions = this.state.directions || [];
    let currentquestion = this.state.currentquestion;
    if (currentquestion && currentquestion['index_id'] < directions.length - 1) {
      let index = currentquestion['index_id'] + 1
      let nextQuestion = directions[index]
      currentquestion = nextQuestion
      currentquestion['index_id'] = index
    }
    else if (!currentquestion && directions.length > 0) {
      currentquestion = directions[0]
      currentquestion['index_id'] = 0
    }
    else {
      this.showDirections(false)
    }
    this.setState({currentquestion: currentquestion}, () => {
      console.log(this.state.currentquestion)
    })
  }

  onChangeCurrentAnswer(event) {
    let value = event.target.value;
    this.setState({currentAnswer: value});
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
        {this.state.showDirections ? this.renderDirections() : this.renderDefault()}
      </div>
    )
  }

  renderDefault() {
    return(
      <div>
        <div className="row text-white text-center">
          <div className="col-md-12">
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
          <button type="button" className="btn btn-outline-warning" onClick={() => this.showDirections(true)}>YES</button>
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

  renderDirections() {
    let currentquestion = this.state.currentquestion;
    let showDirections = this.state.showDirections;

    if (!showDirections || !currentquestion) {
      return ''
    }

    return (
      <div>
        <div>
          {currentquestion['question']}
        </div>
        <input type="text" value={this.state.currentAnswer} onChange={(event) => this.onChangeCurrentAnswer(event)} />
        <button className="btn btn-primary" onClick={() => this.checkAnswer()} disabled={!this.state.currentAnswer}>Next</button>
      </div>
    )
  }



}
export default Gryffindor;