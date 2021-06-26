import React from 'react';
import jwtDecode from 'jwt-decode';
import moment from 'moment';
import {
  withRouter,
  Redirect
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import NavOptionsUnsign from '../Components/NavOptions/NavOptionsUnsign.jsx';
import NavWithin from '../Components/NavWithin/NavWithin.jsx';
import ModalBox from '../Components/ModalBox.jsx';
import ModalBackground from '../Components/ModalBackground.jsx';
import SingleDialog from '../Components/Dialog/SingleDialog/SingleDialog.jsx';
import SingleCloseDialog from '../Components/Dialog/SingleCloseDialog/SingleCloseDialog.jsx';
import BooleanDialog from '../Components/Dialog/BooleanDialog/BooleanDialog.jsx';
import ScrollToTop from '../Components/RouterScrollTop.jsx';
import {
  _localVerifiedErr
} from "../utils/errHandlers.js";

class ActionInspired extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      moved: false,
      finished: false,
      redirectPath: ''
    };
    this.style={
      Within_Cosmic_backplane:{
        width: '100%',
        height: '100%',
        position: 'fixed',
        backgroundColor: '#FCFCFC'
      },
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {
    let urlParams = new URLSearchParams(this.props.location.search); //we need value in URL query
    let reqUnit = urlParams.get('unitId');
    if(!reqUnit) return; // not a valid url, return.

    // similar to the part root.js in other dir
    let loggedin = !!window.localStorage['token'];
    if (loggedin) {
      const statusVerified = () => { //could be a independent utils like the /refreshToken
        axios.get('/router/status', {
          headers: {
            'token': window.localStorage['token']
          }
        }).then(function (res) {

        }).catch((err) => {

          
        })
      };

      let decoded = {}, deadline = new Date(), expired = true;
      try {
        decoded = jwtDecode(window.localStorage['token']);
        deadline = moment.unix(decoded.exp).subtract(12, 'h');//refresh token earlier in case the user log out during the surfing
        expired = moment().isAfter(deadline);
      } catch (e) {
        // e.g 'token' was invalid format, or any problem from the 'token' and 'decode'
        _localVerifiedErr(e);
        expired = true;
      };
      if (expired) {
        //send 'refresh' token, which get when last renew
        //return to status check after new token back

        tokenRefreshed().then(() => {
          statusVerified();
        }).catch((error) => {

        })
      }
      else {
        //still check status, get basic data
        //and then render view
        statusVerified();
      }

    } else {

    };

  }

  componentWillUnmount() {

  }

  render(){
    if(this.state.finished){
      return <Redirect
        to={this.state.redirectPath} />;
    }
    else if(!this.state.moved) return null; // render nothing if not yet req

    return (
      <div>
        <div style={this.style.Within_Cosmic_backplane}></div>
        <div
          className={classnames(styles.boxCosmi)}>
          <div
            className={classnames(styles.boxNavOptionsFrame)}>
            <div
              className={classnames(styles.boxNavOptions)}>
              <NavOptionsUnsign {...this.props} _refer_to={()=>{}} />
            </div>
          </div>
          <div
            className={classnames(styles.boxAroundContent)}>
            <div
              className={classnames(
                styles.boxContentFilledLeft)} />
            <div
              className={classnames(styles.boxAroundContentCenter)}>
              <ScrollToTop/>
            </div>
            <div
              className={classnames(
                styles.boxContentFilledRight)} />
          </div>
          <div
            className={classnames(styles.boxNavAround, styles.boxNavWithinCosmic, 'smallDisplayNone') }>
            <NavWithin
              {...this.props} _refer_to={()=>{}}/>
          </div>
        </div>

        {
          //here and beneath, are dialog system for global used,
          //the series 'message' in redux state is prepared for this kind of global message dialog
          this.props.messageSingleClose['render'] &&
          <ModalBox containerId="root">
            <ModalBackground onClose={()=>{}} style={{position: "fixed", backgroundColor: 'rgba(51, 51, 51, 0.3)'}}>
              <div
                className={"boxDialog"}>
                <SingleCloseDialog
                  message={this.props.messageSingleClose['message']}
                  _positiveHandler={this.props.messageSingleClose['handlerPositive']}/>
              </div>
            </ModalBackground>
          </ModalBox>
        }
        {
          this.props.messageSingle['render'] &&
          <ModalBox containerId="root">
            <ModalBackground onClose={()=>{}} style={{position: "fixed", backgroundColor: 'rgba(51, 51, 51, 0.3)'}}>
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
        {
          this.props.messageBoolean['render'] &&
          <ModalBox containerId="root">
            <ModalBackground onClose={()=>{}} style={{position: "fixed", backgroundColor: 'rgba(51, 51, 51, 0.3)'}}>
              <div
                className={"boxDialog"}>
                <BooleanDialog
                  customButton={this.props.messageBoolean['customButton']}
                  message={this.props.messageBoolean['message']}
                  _positiveHandler={this.props.messageBoolean['handlerPositive']}
                  _negativeHandler={this.props.messageBoolean['handlerNegative']}/>
              </div>
            </ModalBackground>
          </ModalBox>
        }

      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    messageSingle: state.messageSingle,
    messageSingleClose: state.messageSingleClose,
    messageBoolean: state.messageBoolean
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(ActionInspired));
