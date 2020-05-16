import React from 'react';
import {
  Route,
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import Sheet from './Profile/Sheet.jsx';
import MaskProcessing from '../Components/MaskProcessing.jsx';
import NavOptions from '../Components/NavOptions/NavOptions.jsx';
import NavWithin from '../Components/NavWithin/NavWithin.jsx';

const styleMiddle ={
  boxReturn: {
    display: 'inline-block',
    boxSizing: 'border-box',
    cursor: 'pointer',
    zIndex: '2' //a temp method, to avoid cover by NavSelf
  },
  spanReturn: {
    top: '44%',
    whiteSpace: 'nowrap',
    fontSize: '1.6rem',
    fontWeight: '700',
    letterSpacing: '0.12rem',
    color: '#ff7a5f',
    cursor: 'pointer'
  }
}

class FrontProfile extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      switchTo: null
    };
    this.style={
      Front_Profile_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0%',
        left: '0%',
        backgroundColor: '#d1d1d1'
      },
      Front_Profile_scroll_: {
        width: '61%',
        position: 'absolute',
        top: '2%',
        left: '18%',
        boxSizing: 'border-box'
      },
      Front_Profile_nav_: {
        width: '9%',
        height: '30%',
        position: 'absolute',
        top: '32%',
        left: '5%',
        boxSizing: 'border-box',
        padding: '0 0.5vw',
        borderRight: 'solid 1px #909090',
        textAlign: 'right',
        fontSize: '1.4rem',
        letterSpacing: '0.15rem'
      },
      Front_Profile_backPlane_top: {
        width: '100%',
        height: '1%',
        position: 'fixed',
        top: '0',
        left: '0',
        backgroundColor: '#d1d1d1'
      },
      Within_NavOptions: {
        width: '1.4%',
        height: '3.2%',
        position: 'fixed',
        bottom: '6.9%',
        right: '1%',
        boxSizing: 'border-box'
      }
    }
  }

  _refer_leaveSelf(identifier, route){
    switch (route) {
      case 'user':
        if(identifier == this.props.userInfo.id){
          window.location.assign('/user/screen');
        }else{
          window.location.assign('/cosmic/users/'+identifier+'/accumulated');
        }
        break;
      case 'noun':
        window.location.assign('/cosmic/nodes/'+identifier);
        break;
      default:
        window.location.assign(route)
    }
  }

  render(){
    if(this.state.switchTo){return <Redirect to={this.state.switchTo.params+this.state.switchTo.query}/>}

    return(
      <div
        style={this.style.Front_Profile_}>
        <div
          style={this.style.Front_Profile_scroll_}>
          <Route path={this.props.match.path+"/sheet"} render={(props)=> <Sheet {...props}/>}/>
        </div>
        <div style={this.style.Front_Profile_backPlane_top}></div>

        <div
          className={classnames(styles.boxNavAround)}>
          <NavWithin {...this.props} _refer_to={this._refer_leaveSelf}/>
        </div>
        <div style={this.style.Within_NavOptions}>
          <NavOptions {...this.props}/>
        </div>

        {
          (this.props.axios) &&
          <MaskProcessing/>
        }
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    axios: state.axios
  }
}
export default withRouter(connect(
  mapStateToProps,
  null
)(FrontProfile));
