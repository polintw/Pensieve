import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import Signup from './Signup/Signup.jsx';
import Signin from './Signin/Signin.jsx';
import Resend from './Resend/Resend.jsx';
import Unsubscribe from './Unsubscribe/Unsubscribe.jsx';
import Confirmation from './components/Confirmation/Confirmation.jsx';
import ModalBox from '../Components/ModalBox.jsx';
import ModalBackground from '../Components/ModalBackground.jsx';
import SingleDialog from '../Components/Dialog/SingleDialog/SingleDialog.jsx';
import NavOptionsUnsign from '../Components/NavOptions/NavOptionsUnsign.jsx';
import NavWithin from '../Components/NavWithin/NavWithin.jsx';

class Sign extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      Sign_backplane:{
        width: '100%',
        height: '100%',
        position: 'fixed',
        backgroundColor: '#FCFCFC'
      },
    }
  }



  render(){
    return(
      <Router
        basename={"/s"}>
        <div>
          <div style={this.style.Sign_backplane}></div>
          <div
            className={classnames(styles.comSign)}>
            <div
              className={classnames("smallDisplayBox")}>
              <div
                className={classnames(styles.boxNavOptions)}>
                <Route path="/" render={(props)=> <NavOptionsUnsign {...props} _refer_to={()=>{ }}/> }/>
              </div>
            </div>
            <div
              className={classnames(styles.boxAroundContent)}>
              <div
                className={classnames(
                  styles.boxContentFilledLeft)}/>
              <div
                className={classnames(styles.boxAroundContentCenter)}>
                <Switch>
                  <Route path="/signup" render={(props)=> <Signup {...props}/>}/>
                  <Route path="/signin" render={(props)=> <Signin {...props}/>}/>
                  <Route path="/confirm" render={(props)=> <Confirmation {...props}/>}/>
                  <Route path="/resend" render={(props)=> <Resend {...props}/>}/>
                  <Route path="/unsubscribe" render={(props)=> <Unsubscribe {...props}/>}/>
                </Switch>
              </div>
              <div
                className={classnames(
                  styles.boxContentFilledRight)}/>
            </div>
            <div
              className={classnames(styles.boxNavAround)}>
              <Route path="/" render={(props)=> <NavWithin {...props} _refer_to={()=>{window.location.assign('/')}}/> }/>
            </div>
          </div>

          {
            //here and beneath, are dialog system,
            //the series 'message' in redux state is prepared for this kind of global message dialog
            this.props.messageSingle['render'] &&
            <ModalBox containerId="root">
              <ModalBackground onClose={()=>{ /*this._set_Dialog();*/}} style={{position: "fixed", backgroundColor: 'rgba(51, 51, 51, 0.3)'}}>
                <div
                  className={"boxDialog"}>
                  <SingleDialog
                    message={this.props.messageSingle['message']}
                    buttonValue={this.props.messageSingle['buttonValue']}
                    _positiveHandler={this.props.messageSingle['handlerPositive']}/>
                </div>
              </ModalBackground>
            </ModalBox>
          }
        </div>
      </Router>
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

  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sign);
