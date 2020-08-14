import React from 'react';
import {
  withRouter,
  Redirect
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";

const styleMiddle = {
  boxNavButton:{
    display: 'inline-block',
    width: '96px',
    height: '32px',
    position: 'relative',
    boxSizing: 'border-box',
    borderRadius: '4px',
    cursor: 'default'
  },
}

class BooleanDialog extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onButton: false,
    };
    this._render_Message = this._render_Message.bind(this);
    this._render_button_byType = this._render_button_byType.bind(this);
    this._handleClick_dialog_BooleanPosit = this._handleClick_dialog_BooleanPosit.bind(this);
    this._handleClick_dialog_BooleanNegat = this._handleClick_dialog_BooleanNegat.bind(this);
    this._handleEnter_button = this._handleEnter_button.bind(this);
    this._handleLeave_button = this._handleLeave_button.bind(this);
    this.style={

    };
  }

  _handleEnter_button(e){
    this.setState({
      onButton: e.currentTarget.getAttribute('value')
    })
  }

  _handleLeave_button(e){
    this.setState({
      onButton: false
    })
  }

  _handleClick_dialog_BooleanPosit(event){
    event.stopPropagation();
    event.preventDefault();
    this.props._positiveHandler();
  }

  _handleClick_dialog_BooleanNegat(event){
    event.stopPropagation();
    event.preventDefault();
    this.props._negativeHandler();
  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  _render_Message(){
    let messageSpan = this.props.message.map((obj, index)=>{
      return (
        <span
          key={"key_BooleanDialog_message_"+index}
          className={classnames('fontSubtitle_h5', 'colorOptionsBlack', styles.spanMessage)}
          style={obj.style}>
          {obj.text}</span>
      )
    })

    return messageSpan;
  }

  _render_button_byType(){
    let [optionPositive, optionNegative]=[false,false];
    switch (this.props.customButton) {
      case 'sign':
        optionPositive = "Sign up!"
        optionNegative= "return";
        break;
      case 'submitting':
        optionPositive = "yes";
        optionNegative = "cancel";
        break;
      case 'warning':
        optionPositive = "understand"
        optionNegative= "return";
        break;
      default:
        optionPositive= "yes";
        optionNegative= "no";
    };

    return (
      <div
        style={{textAlign: 'center'}}>
        <div
          value={"negative"}
          style={Object.assign({},
            styleMiddle.boxNavButton,
            {marginRight: '11px'},
            (this.state.onButton=="negative")? {backgroundColor: "#757575", cursor: 'pointer'}:{}
          )}
          onClick={this._handleClick_dialog_BooleanNegat}
          onMouseEnter={this._handleEnter_button}
          onMouseLeave={this._handleLeave_button}>
          <span
            className={classnames(
              'centerAlignChild',
              'fontSubtitle_h5',
              {["colorEditBlack"]: !(this.state.onButton=="negative")},
              {["colorWhite"]: (this.state.onButton=="negative")}
            )}>
            {optionNegative}
          </span>
        </div>
        <div
          value={"positive"}
          style={Object.assign({},
            styleMiddle.boxNavButton,
            (this.state.onButton=="positive")? {backgroundColor: "#ff8168", cursor: 'pointer'}:
            {backgroundColor: '#4587A0'}
          )}
          onClick={this._handleClick_dialog_BooleanPosit}
          onMouseEnter={this._handleEnter_button}
          onMouseLeave={this._handleLeave_button}>
          <span
            className={classnames(
              'centerAlignChild',
              'fontSubtitle_h5',
              'colorWhite'
            )}
            style={{whiteSpace: 'nowrap'}}>
            {optionPositive}
          </span>
        </div>
      </div>
    )
  }


  render(){
    return(
      <div
        className={classnames(styles.comBooleanDialog)}>
        <div
          className={classnames(styles.boxMessage)}>
          {this._render_Message()}
        </div>
        <div
          className={classnames(styles.boxfoot)}>
          {this._render_button_byType()}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
  }
}

export default withRouter(connect(
  mapStateToProps,
  null
)(BooleanDialog));
