import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import NavWalls from './NavWalls/NavWalls.jsx';

const commonStyle = {
  boxonDark: {
    width: '100%',
    position: 'absolute',
    bottom: '0',
    left: '0',
    boxSizing: 'border-box'
  },
  boxButtonCollateral:{
    width: '20%',
    height: '100%',
    position: 'absolute',
    bottom: '0',
    right: '0',
    boxSizing: 'border-box',
    color: "#757575"
  },
  boxNavWalls: {
    width: '72%',
    height: '100%',
    position: 'absolute',
    bottom: '0%',
    left: '7%',
    boxSizing: 'border-box',
    boxShadow: '0px 0.18vh 0.01vh -0.03vh',
    borderRadius: '0px 0px 0.6vh 0.6vh',
    backgroundColor: 'white'
  }
}

export default class NavsCognition extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      selfCom_NavsCognition_: {

      },
      selfCom_NavsCognition_inCognition_: {
        minWidth: '448px',
        height: '60.5px',
        position: 'fixed',
        bottom: '0',
        right: '49%',
        boxSizing: 'border-box'
      },
      selfCom_NavsCognition_inCollaterals_: {
        width: '36%',
        height: '5%',
        position: 'absolute',
        top: '0',
        left: '50%',
        boxSizing: 'border-box'
      },
      selfCom_NavsCognition_inCognition_series_: {
        position: 'absolute',
        right: '3%',
        top: '5%',
        boxSizing: 'border-box'
      },
      selfCom_NavsCognition_inCollaterals_title: {
        width: '10%',
        height: '88%',
        position: 'absolute',
        left: '12%',
        bottom: '0',
        boxSizing: 'border-box'
      },
      selfCom_NavsCognition_inCognition_spanSeries: {
        fontSize: '1.4rem',
        fontWeight: '400',
        letterSpacing: '0.16rem',
        cursor: 'pointer'
      },
      selfCom_NavsCognition_inCognition_spanCollaterals: {
        fontSize: '1.2rem',
        fontWeight: '400',
        letterSpacing: '0.14rem',
        cursor: 'pointer'
      },
      selfCom_NavsCognition_inCollaterals_spanBack: {

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
                    style={this.style.selfCom_NavsCognition_inCollaterals_spanBack}>
                    {'back'}</span>
                </Link>
              </div>
            </div>
          ):(
            <div
              style={this.style.selfCom_NavsCognition_inCognition_}>
                <div
                  style={this.style.selfCom_NavsCognition_inCognition_series_}>
                  <span
                    style={this.style.selfCom_NavsCognition_inCognition_spanSeries}>
                    {'Series'}</span>
                </div>
                <div
                  className={"selfFront-fixedBottomBox-height"}
                  style={commonStyle.boxonDark}>
                  <div
                    style={commonStyle.boxButtonCollateral}>
                    <Link
                      key={"key_Link_nav_Collaterals"}
                      to={{
                        pathname: this.props.match.url + "/collaterals/tracks",
                        state: { from: this.props.location }
                      }}
                      className={'plainLinkButton verticalAlignChild'}
                      style={{right: '0'}}>
                      <span
                        style={this.style.selfCom_NavsCognition_inCognition_spanCollaterals}>
                        {'collaterals'}</span>
                    </Link>
                  </div>
                  <div
                    style={commonStyle.boxNavWalls}>
                    <NavWalls {...this.props} />
                  </div>
                </div>
            </div>
          )
        }
      </div>
    )
  }
}
