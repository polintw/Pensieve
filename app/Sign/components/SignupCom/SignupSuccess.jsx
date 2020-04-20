import React from 'react';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import {LinkSignIn} from './SignupFormComps.jsx';
import SvgLogo from '../../../Components/Svg/SvgLogo.jsx';

class SignupSuccess extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onSignIn: false
    };
    this._handleMouseOn_signIn = ()=> this.setState((prevState,props)=>{return {onSignIn: prevState.onSignIn?false:true}});
    this.style={
      SignupSuccess_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box'
      }
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    return(
      <div
        style={this.style.SignupSuccess_}>
        <div
          className={styles.boxLogo}>
          <SvgLogo/>
        </div>
        <div
          className={classnames(styles.fontInput)}>
          <p>{this.props.i18nUIString.catalog["guidingSign_Signup_Success"][0]}</p>
          <p>{this.props.i18nUIString.catalog["guidingSign_Signup_Success"][1]}</p>
          <p>{this.props.i18nUIString.catalog["guidingSign_Signup_Success"][2]}</p>
        </div>
        <LinkSignIn {...this.props}/>
      </div>
    )
  }
}


const mapStateToProps = (state)=>{
  return {
    i18nUIString: state.i18nUIString,
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {

  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignupSuccess);
