import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import SigninForm from './SigninForm/SigninForm.jsx';
import ServiceLinks from '../../../Components/ServiceLinks.jsx';


class Signin extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      Signin_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box'
      },
      Signin_member_: {
        width: '20vw',
        height: '70%',
        position: 'absolute',
        top: '15%',
        right: '0',
        boxSizing:'border-box'
      },
    }
  }

  componentDidMount() {

  }

  componentWillUnmount(){

  }

  render(){
    return(
      <div
        style={this.style.Signin_}>
        <div
          className={classnames(styles.boxColumn)}>
          <div
            style={this.style.Signin_member_}>
            <SigninForm/>
          </div>
        </div>
        <div
          className={classnames(styles.boxServiceLink)}>
          <ServiceLinks/>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    axios: state.axios,
    i18nUIString: state.i18nUIString,
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Signin));
