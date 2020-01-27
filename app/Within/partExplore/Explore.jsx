import React from 'react';
import {
  Route,
  Switch,
  Link,
  withRouter,
  Redirect
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import ExpSubtitle from './ExpSubtitle/ExpSubtitle.jsx';
import UnitIndepen from '../../Unit/UnitIndepen/UnitIndepen.jsx';
import SvgLogo from '../../Component/Svg/SvgLogo.jsx';

const styleMiddle = {
  comExplore: {
    width: '100%',
    position: 'absolute',
    top: '0',
    left: '0',
    boxSizing: 'border-box'
  },
  boxSubtitle: {
    position: 'fixed',
    bottom: '109px',
    left: '7%'
  },
  boxLogo: {
    display: 'inline-block',
    height: '12px',
    position: 'fixed',
    bottom: '2.8%',
    right: '30%',
    boxSizing: 'border-box',
    cursor: 'pointer'
  }
}

class Explore extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={

    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    let unitify = this.props.location.pathname.includes('/unit');

    return(
      <div
        style={styleMiddle.comExplore}>
        <div
          className={styles.boxMain}
          style={unitify? {top: '7.2vh'}: {}}>
          <Switch>
            <Route path={this.props.match.path+"/unit"} render={(props)=> <UnitIndepen {...props} _refer_von_unit={this.props._refer_von_cosmic}/>}/>

          </Switch>
        </div>
        <div
          className={classnames(styles.boxOverlay, styles.boxTop)}
          style={unitify ? {height: '5vh'}: {}}/>
        <div
          className={classnames(styles.boxOverlay, styles.boxBottom)}
          style={unitify ? {height: '66px'}: {}}/>
        <div
          style={styleMiddle.boxSubtitle}>
          <ExpSubtitle {...this.props}/>
        </div>
        <Route path={this.props.match.path+"/"} render={(props)=> (
            <div
              style={Object.assign({}, styleMiddle.boxLogo)}
              onClick={(e)=>{e.preventDefault(); e.stopPropagation(); this.props._refer_von_cosmic('', '/cosmic')}}>
              <SvgLogo/>
            </div>
          )}/>
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
)(Explore));
