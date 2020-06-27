import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import {connect} from "react-redux";
import Signup from './Signup/Signup.jsx';
import Signin from './Signin/Signin.jsx';
import Resend from './Resend/Resend.jsx';
import Unsubscribe from './Unsubscribe/Unsubscribe.jsx';
import Confirmation from './components/Confirmation/Confirmation.jsx';

class Sign extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
  }



  render(){
    return(
      <Router
        basename={"/s"}>
        <Switch>
          <Route path="/signup" render={(props)=> <Signup {...props}/>}/>
          <Route path="/signin" render={(props)=> <Signin {...props}/>}/>
          <Route path="/confirm" render={(props)=> <Confirmation {...props}/>}/>
          <Route path="/resend" render={(props)=> <Resend {...props}/>}/>
          <Route path="/unsubscribe" render={(props)=> <Unsubscribe {...props}/>}/>
        </Switch>
      </Router>
    )
  }
}

export default connect()(Sign);
