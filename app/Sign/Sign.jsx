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
import Confirmation from './components/Confirmation/Confirmation.jsx';

class Sign extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      pages: 'signin'
    };
    this.style={
      div_Base: {
        width: "100%",
        minHeight: "100vh",
        position: 'relative'
      }
    }
  }



  render(){
    //let cx = cxBind.bind(styles);
    return(
      <Router
        basename={"/s"}>
        <div
          style={this.style.div_Base}>
          <Switch>
            <Route path="/signup" render={(props)=> <Signup {...props}/>}/>
            <Route path="/signin" render={(props)=> <Signin {...props}/>}/>
            <Route path="/confirm" render={(props)=> <Confirmation {...props}/>}/>
            <Route path="/resend" render={(props)=> <Resend {...props}/>}/>
          </Switch>
        </div>
      </Router>
    )
  }
}

export default connect()(Sign);
