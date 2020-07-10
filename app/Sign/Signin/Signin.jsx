import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import SigninForm from '../components/SigninForm/SigninForm.jsx';
import NavSign from '../components/NavSign/NavSign.jsx';
import ServiceLinks from '../../Components/ServiceLinks.jsx';
import {
  setSignInit,
} from "../../redux/actions/sign.js";


class Signin extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._signin_success = this._signin_success.bind(this);
  }

  _signin_success(){
    window.location.assign('/');
  }

  componentDidMount() {

  }

  componentWillUnmount(){
    this.props._set_StateInit()
  }

  render(){
    return(
      <div
        className={classnames(styles.boxColumn)}>
        <SigninForm
          _signin_success={this._signin_success}/>

        <div
          className={classnames(styles.boxNav)}>
          <NavSign
            {...this.props}/>
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
    _set_StateInit: ()=>{dispatch(setSignInit());},
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Signin));
