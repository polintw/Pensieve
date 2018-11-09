import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import {connect} from "react-redux";
import cxBind from 'classnames/bind';
import FrontCognition from './Front_Cognition.jsx';
import FrontProfile from './Front_Profile.jsx';
import ExternalPanel from './component/ExternalPanel.jsx';

class Front extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      Self_pages_Front_: {
        width: "100%",
        minWidth: '720px',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0'
      },
      Self_pages_Front_External_: {
        width: '6%',
        height: '24%',
        position: 'fixed',
        top: '63%',
        right: '2%'
      }
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <Router
        basename={"/user"}>
        <div
          style={this.style.Self_pages_Front_}>
          <Route path="/cognition" render={(props)=> <FrontCognition {...props}/>}/>
          <Route path="/profile" render={(props)=> <FrontProfile {...props}/>}/>
          <div
            style={this.style.Self_pages_Front_External_}>
            <ExternalPanel/>
          </div>
        </div>
      </Router>
    )
  }
}

export default connect()(Front);
