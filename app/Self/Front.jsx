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
    this._handleClick_selfClose = this._handleClick_selfClose.bind(this);
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
        width: '8%',
        height: '24%',
        position: 'fixed',
        top: '63%',
        right: '2%',
        boxSizing: 'border-box',
        overflow: "visible"
      },
      Self_pages_Front_Scape: {
        width: '5%',
        height: '8%',
        position: 'fixed',
        bottom: '2%',
        left: '5%',
        boxSizing: 'border-box'
      },
      Self_pages_Front_Scape_circle: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '50%',
        right: '0',
        transform: 'translate(0, -50%)',
        boxSizing: 'border-box'
      }
    }
  }

  _handleClick_selfClose(event){
    event.preventDefault();
    event.stopPropagation();
    window.location.assign('/');
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
          <div
            style={this.style.Self_pages_Front_Scape}>
            <svg
              style={this.style.Self_pages_Front_Scape_circle}>
              <text x="50%" y="50%" textAnchor="middle" stroke="#999999" strokeWidth="1.2px" fontSize='3vh'>{" x "}</text>
              <circle r="2vh" cx="50%" cy="50%" stroke='#999999' fill="transparent" style={{cursor: 'pointer'}} onClick={this._handleClick_selfClose}/>
            </svg>
          </div>
        </div>
      </Router>
    )
  }
}

export default connect()(Front);
