import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import cxBind from 'classnames/bind';
import FrontCognition from './Front_Cognition.jsx';
import FrontStatics from './Front_Statics.jsx';
import ExternalPanel from './../Component/ExternalPanel.jsx';

export default class Front extends React.Component {
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
          <Route path="/front" render={(props)=> <FrontCognition {...props} userBasic={this.props.userBasic}/>}/>
          <Route path="/collateral" render={(props)=> <FrontStatics {...props} userBasic={this.props.userBasic}/>}/>
          <div
            style={this.style.Self_pages_Front_External_}>
            <ExternalPanel/>
          </div>
        </div>
      </Router>
    )
  }
}
