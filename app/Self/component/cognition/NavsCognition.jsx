import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import NavWalls from './NavWalls/NavWalls.jsx';

const commonStyle = {
  boxButtonCollateral: {
    display: 'inline-block',
    position: 'relative',
    boxSizing: 'border-box',
    float: 'left'
  },
  boxOnDark: {
    display: 'inline-block',
    width: '382px',
    position: 'relative',
    boxSizing: 'border-box',
    top: '-21%',
    float: 'right',
    boxShadow: '0px 0.14rem 0.1rem -0.07rem',
    borderRadius: '0px 0px 0.6vh 0.6vh',
    backgroundColor: 'white'
  },
  boxNavWalls: {
    display: 'inline-block',
    height: '86%',
    position: 'relative',
    left: '2%',
    transform: 'translate(0, -16%)',
    boxSizing: 'border-box'
  },
  boxBell: {
    display: 'inline-block',
    width: '9%',
    height: '86%',
    position: "relative",
    transform: 'translate(0px, -16%)',
    boxSizing: 'border-box',
    margin: '0 3%',
    float: 'right'
  },
  boxButtonSeries: {
    position: 'absolute',
    bottom: '124%',
    boxSizing: 'border-box'
  },
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
        position: 'fixed',
        bottom: '0',
        right: '11%',
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
                  {'track'}</span>
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
              className={"selfFront-fixedBottomBox-height"}
              style={this.style.selfCom_NavsCognition_inCognition_}>
              <div
                style={commonStyle.boxButtonSeries}>
                <span
                  style={this.style.selfCom_NavsCognition_inCognition_spanSeries}>
                  {'Series'}</span>
              </div>
              <div
                className={"selfFront-fixedBottomBox-height"}
                style={commonStyle.boxOnDark}>
                <div
                  style={commonStyle.boxNavWalls}>
                  <NavWalls {...this.props} />
                </div>
                <div
                  style={commonStyle.boxBell}>

                </div>
              </div>
              <div
                className={"selfFront-fixedBottomBox-height"}
                style={commonStyle.boxButtonCollateral}>
                <Link
                  key={"key_Link_nav_Collaterals"}
                  to={{
                    pathname: this.props.match.url + "/collaterals/tracks",
                    state: { from: this.props.location }
                  }}
                  className={'plainLinkButton verticalAlignChild'}
                  style={{position: 'relative', left: '0'}}>
                  <span
                    style={this.style.selfCom_NavsCognition_inCognition_spanCollaterals}>
                    {'track'}</span>
                </Link>
              </div>
            </div>
          )
        }
      </div>
    )
  }
}
