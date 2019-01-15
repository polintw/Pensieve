import React from 'react';
import cxBind from 'classnames/bind';

export default class Signup extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      password_confirm: '',
      errors: {}
    };
    this._handle_Signup = this._handle_Signup.bind(this);
    this._handleChange_Input = this._handleChange_Input.bind(htis);
    this.style={
      Signup_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box'
      },
      Signup_form_: {
        width: '40%',
        height: '70%',
        position: 'absolute',
        top: '18%',
        left: '50%',
        transform: 'translate(-50%, 0)',
        boxSizing:'border-box'
      }
    }
  }

  _handle_Signup(event){
    event.preventDefault();
    const self = this;
    let reqBody = {
      'email': this.state.email,
      'firstName': this.state.firstName,
      'lastName': this.state.lastName,
      'password': this.state.password,
      'password_confirm': this.state.password_confirm,
    };
    this.setState({axios: true});
    axios.post('/router/register', reqBody, {
      headers: {'charset': 'utf-8'}
    }).then(function (res) {
      self.setState({axios: false});

    }).catch(function (thrown) {
      if (axios.isCancel(thrown)) {
        console.log('Request canceled: ', thrown.message);
      } else {
        self.setState({axios: false});

      }
    });
  }

  _handleChange_Input(event) {
    this.setState({
        [event.target.name]: event.target.value
    })
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.Signup_}>
        <div
          style={this.style.Signup_form_}>
          <h2 style={{marginBottom: '40px'}}>Registration</h2>
          <Link to="/signin">
            <span>{"Sign in"}</span>
          </Link>
          <form onSubmit={this._handle_Signup}>
              <div>
                  <input
                  type="text"
                  placeholder="First Name"
                  name="firstName"
                  onChange={ this.handleInputChange }
                  value={ this.state.firstName }
                  />
              </div>
              <div>
                  <input
                  type="text"
                  placeholder="First Name"
                  name="lastName"
                  onChange={ this.handleInputChange }
                  value={ this.state.lastName}
                  />
              </div>
              <div>
                  <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  onChange={ this.handleInputChange }
                  value={ this.state.email }
                  />
              </div>
              <div>
                  <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  onChange={ this.handleInputChange }
                  value={ this.state.password }
                  />
              </div>
              <div>
                  <input
                  type="password"
                  placeholder="Confirm Password"
                  name="password_confirm"
                  onChange={ this.handleInputChange }
                  value={ this.state.password_confirm }
                  />
              </div>
              <div>
                <input
                  type='submit'
                  value="Register User"/>
              </div>
          </form>
        </div>
      </div>
    )
  }
}
