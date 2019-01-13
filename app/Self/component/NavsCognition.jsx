import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import cxBind from 'classnames/bind';
import NavWalls from './NavWalls.jsx';

export default class NavsCognition extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._handleClick_selfClose = this._handleClick_selfClose.bind(this);
    this.style={
      selfCom_NavsCognition_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        left: '0',
        top: '0',
        boxSizing: 'border-box'
      },
      selfCom_NavsCognition_Walls_: {
        width: '36%',
        height: '100%',
        position: 'absolute',
        bottom: '0%',
        right: '4%',
        boxSizing: 'border-box'
      },
      selfCom_NavsCognition_series_: {
        width: '10%',
        height: '88%',
        position: 'absolute',
        left: '22%',
        bottom: '0',
        boxSizing: 'border-box'
      },
      selfCom_NavsCognition_collaterals_: {
        width: '10%',
        height: '88%',
        position: 'absolute',
        left: '12%',
        bottom: '0',
        boxSizing: 'border-box'
      },
      selfCom_NavsCognition_button_: {
        fontSize: '1.1rem',
        fontWeight: '300',
        letterSpacing: '0.2rem',
        cursor: 'pointer'
      },
      Self_pages_Front_Scape: {
        width: '5%',
        height: '88%',
        position: 'absolute',
        bottom: '2%',
        left: '3%',
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
      <div
        style={this.style.selfCom_NavsCognition_}>
          <div
            style={this.style.Self_pages_Front_Scape}>
            <svg
              style={this.style.Self_pages_Front_Scape_circle}>
              <text x="50%" y="50%" textAnchor="middle" stroke="#999999" strokeWidth="1.2px" fontSize='3vh'>{" x "}</text>
              <circle r="2vh" cx="50%" cy="50%" stroke='#999999' fill="transparent" style={{cursor: 'pointer'}} onClick={this._handleClick_selfClose}/>
            </svg>
          </div>
        <div
          style={this.style.selfCom_NavsCognition_series_}>
          <span
            style={this.style.selfCom_NavsCognition_button_}>
            {'系列'}</span>
        </div>
        {
          this.props.location.pathname !== "/cognition/collaterals/tracks" &&
          <div
            style={this.style.selfCom_NavsCognition_collaterals_}>
            <Link
              key={"key_Link_nav_Collaterals"}
              to={{
                pathname: this.props.match.url+"/collaterals/tracks",
                state: {from: this.props.location}
              }}>
              <span
                style={this.style.selfCom_NavsCognition_button_}>
                {'collaterals'}</span>
            </Link>
          </div>
        }
        <div
          style={this.style.selfCom_NavsCognition_Walls_}>
          <NavWalls {...this.props}/>
        </div>
      </div>
    )
  }
}
