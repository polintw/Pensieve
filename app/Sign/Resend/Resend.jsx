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
import SvgLogo from '../../Components/Svg/SvgLogo.jsx';
import ServiceLinks from '../../Components/ServiceLinks.jsx';
import ModalBox from '../../Components/ModalBox.jsx';
import ModalBackground from '../../Components/ModalBackground.jsx';
import SingleDialog from '../../Components/Dialog/SingleDialog/SingleDialog.jsx';
import {
  setSignInit,
} from "../../redux/actions/sign.js";

class Resend extends React.Component {
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

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {

  }

  componentWillUnmount() {
    this.props._set_StateInit()
  }

  render(){
    return(
      <div>
        <div style={this.style.Sign_backplane}></div>
        <div
          className={classnames(styles.comSignResend)}>
          <div
            className={classnames(styles.boxContent)}>
            <div
              className={classnames(styles.boxColumn)}>
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
          </div>

          <div
            className={classnames(styles.boxFooter)}>
            <div
              className={classnames(styles.boxLogo)}
              onClick={(e)=>{e.preventDefault(); e.stopPropagation(); window.location.assign('/');}}>
              <SvgLogo/>
            </div>
            <div
              className={classnames(styles.boxServiceLink)}>
              <ServiceLinks />
              <div
                className={classnames(
                  styles.boxRightsClaim,
                  'fontTitleSmall',
                  'colorDescripBlack'
                )}>
                <span>{this.props.i18nUIString.catalog["Cornerth_inc"]}</span>
                <span>{this.props.i18nUIString.catalog["AllRights"]}</span>
              </div>
            </div>
          </div>

        </div>

        {
          //here and beneath, are dialog system,
          //the series 'message' in redux state is prepared for this kind of global message dialog
          this.props.messageSingle['render'] &&
          <ModalBox containerId="root">
            <ModalBackground onClose={()=>{this._set_Dialog();}} style={{position: "fixed", backgroundColor: 'rgba(52, 52, 52, 0.36)'}}>
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
