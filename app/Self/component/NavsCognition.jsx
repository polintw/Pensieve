import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import cxBind from 'classnames/bind';
import NavFront from './NavFront.jsx';
import NavWalls from './NavWalls.jsx';

export default class NavsCognition extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
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
        width: '40%',
        height: '100%',
        position: 'absolute',
        bottom: '0%',
        right: '2%',
        boxSizing: 'border-box'
      },
      selfCom_NavsCognition_Front_: {
        width: '12%',
        height: '48%',
        position: 'absolute',
        top: '0%',
        left: '24%',
        boxSizing: 'border-box'
      },
      selfCom_NavsCognition_series_: {
        width: '10%',
        height: '88%',
        position: 'absolute',
        left: '0',
        bottom: '0',
        boxSizing: 'border-box'
      },
      selfCom_NavsCognition_collaterals_: {
        width: '10%',
        height: '88%',
        position: 'absolute',
        left: '11%',
        bottom: '0',
        boxSizing: 'border-box'
      },
      selfCom_NavsCognition_button_: {
        fontSize: '1.1rem',
        fontWeight: '300',
        letterSpacing: '0.2rem',
        cursor: 'pointer'
      }
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.selfCom_NavsCognition_}>
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
        <div
          style={this.style.selfCom_NavsCognition_Front_}>
          <NavFront {...this.props}/>
        </div>
      </div>
    )
  }
}
