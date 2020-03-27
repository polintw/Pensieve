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
import Confirmation from './Confirmation/Confirmation.jsx';

class Sign extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      pages: 'signin'
    };
    this.style={
      div_Base: {
        width: "100%",
        minWidth: '720px',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0'
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
