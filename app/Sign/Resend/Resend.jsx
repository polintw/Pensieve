import React from 'react';
import {
  Link,
  Switch,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import EmailResend from './EmailResend.jsx';
import PasswordReset from './PasswordReset.jsx';
import NavSign from '../components/NavSign/NavSign.jsx';
import {
  setSignInit,
} from "../../redux/actions/sign.js";

class Resend extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {

  }

  componentWillUnmount() {
    this.props._set_StateInit()
  }

  render(){
    return(
      <div
        className={classnames(styles.comSignResend)}>
        <Switch>
          <Route path={this.props.match.path+"/pwreset"} render={(props)=> <PasswordReset {...props}/>}/>
          <Route path={this.props.match.path+"/"} render={(props)=> <EmailResend {...props}/>}/>
        </Switch>

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
    i18nUIString: state.i18nUIString,
    messageSingle: state.messageSingle
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
)(Resend));
