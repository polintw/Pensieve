import React from 'react';
import {
  Route,
  Switch,
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import Sheet from './Profile/Sheet.jsx';
import NavWithin from '../Components/NavWithin/NavWithin.jsx';
import NavOptions from '../Components/NavOptions/NavOptions.jsx';
import SingleDialog from '../Components/Dialog/SingleDialog/SingleDialog.jsx';
import SingleCloseDialog from '../Components/Dialog/SingleCloseDialog/SingleCloseDialog.jsx';
import BooleanDialog from '../Components/Dialog/BooleanDialog/BooleanDialog.jsx';
import ModalBox from '../Components/ModalBox.jsx';
import ModalBackground from '../Components/ModalBackground.jsx';

class FrontProfile extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      switchTo: null
    };
    this.style={
      Front_Profile_backplane:{
        width: '100%',
        height: '100%',
        position: 'fixed',
        backgroundColor: '#FCFCFC'
      },
    }
  }

  _refer_leaveSelf(identifier, route){
    switch (route) {
      case 'noun':
        window.location.assign('/cosmic/nodes/'+identifier);
        break;
      default:
        window.location.assign(route)
    }
  }

  componentDidMount() {

  }

  render(){
    if(this.state.switchTo){return <Redirect to={this.state.switchTo.params+this.state.switchTo.query}/>}

    return(
      <div>
        <div style={this.style.Front_Profile_backplane}></div>
        <div
          className={classnames(styles.boxProfile)}>
          <div
            className={classnames(styles.boxNavOptionsFrame)}>
            <div
              className={classnames(styles.boxNavOptions)}>
              <NavOptions {...this.props} _refer_to={this._refer_leaveSelf}/>
            </div>
          </div>
          <div
            className={classnames(styles.boxContent)}>
            <div
              className={classnames(
                styles.boxContentFilledLeft, styles.boxContentFilledLeftSelf)}/>
            <div
              className={classnames(styles.boxContentCenter)}>
              <Switch>
                <Route path={this.props.match.path+"/sheet"} render={(props)=> <Sheet {...props}/>}/>
              </Switch>
            </div>
            <div
              className={classnames(
                styles.boxContentFilledRight, styles.boxContentFilledRightSelf)}/>
          </div>
          <div
            className={classnames(styles.boxNavAround)}>
            <NavWithin {...this.props} _refer_to={this._refer_leaveSelf}/>
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
    userInfo: state.userInfo,
    axios: state.axios,
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
)(FrontProfile));
