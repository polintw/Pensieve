import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import NavWalls from './NavWalls.jsx';

const commonStyle = {
  spanCollateral: {
    fontSize: '1.1rem',
    fontWeight: '300',
    letterSpacing: '0.2rem',
    cursor: 'pointer'
  },
  spanBack: {

  }
}

export default class NavsCognition extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      selfCom_NavsCognition_: {
        position: 'fixed',
        left: '0',
        bottom: '0',
        boxSizing: 'border-box'
      },
      selfCom_NavsCognition_inCognition_: {

      },
      selfCom_NavsCognition_inCollaterals_: {
        width: '36%',
        height: '5%',
        position: 'absolute',
        top: '0',
        left: '50%',
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
      selfCom_NavsCognition_inCognition_collaterals: {

      },
      selfCom_NavsCognition_inCollaterals_title: {
        width: '10%',
        height: '88%',
        position: 'absolute',
        left: '12%',
        bottom: '0',
        boxSizing: 'border-box'
      }
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.selfCom_NavsCognition_}>
        {
          (this.props.location.pathname=="/cognition/collaterals/tracks") ? (
            <div
              style={this.style.selfCom_NavsCognition_inCollaterals_}>
              <div
                style={this.style.selfCom_NavsCognition_inCollaterals_title}>
                <span
                  style={commonStyle.spanCollateral}>
                  {'collaterals'}</span>
              </div>
              <div>
                <Link
                  key={"key_Link_nav_Collaterals_back"}
                  to={this.props.location.state.from}>
                  <span
                    style={commonStyle.spanBack}>
                    {'back'}</span>
                </Link>
              </div>
            </div>
          ):(
            <div
                style={this.style.selfCom_NavsCognition_inCognition_}>
                <div
                  style={this.style.selfCom_NavsCognition_series_}>
                  <span
                    style={this.style.selfCom_NavsCognition_button_}>
                    {'Series'}</span>
                </div>
                <div
                  style={this.style.selfCom_NavsCognition_inCognition_collaterals}>
                  <Link
                    key={"key_Link_nav_Collaterals"}
                    to={{
                      pathname: this.props.match.url + "/collaterals/tracks",
                      state: { from: this.props.location }
                    }}>
                    <span
                      style={commonStyle.spanCollateral}>
                      {'collaterals'}</span>
                  </Link>
                </div>
                <div
                  style={this.style.selfCom_NavsCognition_Walls_}>
                  <NavWalls {...this.props} />
                </div>
            </div>
          )
        }
      </div>
    )
  }
}
