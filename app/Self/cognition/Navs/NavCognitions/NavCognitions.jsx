import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import NavWalls from '../NavWalls/NavWalls.jsx';
import NotifyBell from '../../component/Notify/NotifyBell.jsx';

const commonStyle = {
  temp: {
    display: 'none'
  },
  boxButtonCollateral: {
    display: 'inline-block',
    position: 'relative',
    boxSizing: 'border-box',
    float: 'left'
  },
  boxButtonSeries: {
    position: 'absolute',
    bottom: '124%',
    boxSizing: 'border-box'
  },
}

class NavCognitions extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      selfCom_NavsCognition_inCognition_: {
        width: '50vw',
        position: 'fixed',
        bottom: '0',
        right: '0',
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
    return(
      <div>
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
                style={Object.assign({}, commonStyle.boxButtonSeries, commonStyle.temp)}>
                <span
                  style={this.style.selfCom_NavsCognition_inCognition_spanSeries}>
                  {'Series'}</span>
              </div>
              <div
                className={"selfFront-fixedBottomBox-height"}
                style={Object.assign({}, commonStyle.boxButtonCollateral, commonStyle.temp)}>
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
              <div className={classnames(styles.boxTongue)}/>
              <div
                className={classnames(styles.boxOptions)}>
                <NavWalls {...this.props} />
                <div style={{height: '90%', borderRight: 'solid 1.5px #a0a0a0'}}/>
                <NotifyBell/>
              </div>
            </div>
          )
        }
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo
  }
}

export default withRouter(connect(
  mapStateToProps,
  null
)(NavCognitions));
