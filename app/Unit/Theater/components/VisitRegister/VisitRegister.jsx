import React from 'react';
import {
  Link,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import ModalList from './ModalList.jsx';

class VisitRegister extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      modalListify: false,
      onbtnNext: false
    };
    this._set_modalListSwitch = this._set_modalListSwitch.bind(this);
    this._handleClick_Register = this._handleClick_Register.bind(this);
    this._handleEnter_btnNext = this._handleEnter_btnNext.bind(this);
    this._handleLeave_btnNext = this._handleLeave_btnNext.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  render(){
    return(
      <div
        className={classnames(styles.comVisitRegister)}>
        <div
          className={classnames(styles.boxGuidingText)}
          onClick={this._handleClick_Register}
          onTouchStart={this._handleEnter_btnNext}
          onTouchEnd={this._handleLeave_btnNext}
          onMouseEnter={this._handleEnter_btnNext}
          onMouseLeave={this._handleLeave_btnNext}
          style={this.state.onbtnNext ? {boxShadow: "0 0 5px -1px inset #fff8f7"} : {}}>
          <span
            className={classnames(
              "fontContent", styles.spanGuidingText,
              {
                [styles.spanGuidingTextActiv]: this.state.onbtnNext,
                ['colorWhite']: this.state.onbtnNext,
                ['colorWhiteGrey']: (!this.state.onbtnNext),
              }
            )}>
            {"Know the scene?"}
          </span>
        </div>
        {
          this.state.modalListify &&
          <ModalList
            {...this.props}
            _set_modalListSwitch={this._set_modalListSwitch}/>
        }
      </div>
    )
  }

  _set_modalListSwitch(bool){
    this.setState({
      modalListify: bool
    });
  }

  _handleClick_Register(event){
    event.preventDefault();
    event.stopPropagation();
    this._set_modalListSwitch(true);
  }

  _handleEnter_btnNext(e){
    this.setState({onbtnNext: true})
  }

  _handleLeave_btnNext(e){
    this.setState({onbtnNext: false})
  }

}


const mapStateToProps = (state)=>{
  return {
    tokenStatus: state.token,
    i18nUIString: state.i18nUIString,
    unitCurrent: state.unitCurrent,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(VisitRegister));
