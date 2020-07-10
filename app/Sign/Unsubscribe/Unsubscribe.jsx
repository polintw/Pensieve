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
import ConnectMail from './ConnectMail.jsx';

class Unsubscribe extends React.Component {
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
        className={classnames(styles.comUnsubscribe)}>
        <Switch>
          <Route path={this.props.match.path+"/"} render={(props)=> <ConnectMail {...props}/>}/>

        </Switch>
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
)(Unsubscribe));
