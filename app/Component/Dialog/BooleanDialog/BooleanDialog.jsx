import React from 'react';
import {
  withRouter,
  Redirect
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import commonStyles from "../commonStyles.module.css";

const styleMiddle = {
  contentInter: {
    fontSize: '2.2rem',
    lineHeight: '2.7rem',
    color: 'black'
  }
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
          className={classnames(commonStyles.fontMessage, styles.spanMessage)}
          style={obj.style}>
          {obj.text}</span>
      )
    })

    return messageSpan;
  }

  _render_button_byType(){
    let [optionPositive, optionNegative]=[false,false];
    switch (this.props.customButton) {
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
      <div>
        <div
          value={"positive"}
          className={classnames(commonStyles.boxRoundButton, styles.boxButton)}
          style={(this.state.onButton=="positive")? {backgroundColor: '#ff7a5f'}:{}}
          onClick={this._handleClick_dialog_BooleanPosit}
          onMouseEnter={this._handleEnter_button}
          onMouseLeave={this._handleLeave_button}>
          <span
            className={classnames(commonStyles.spanButton, commonStyles.fontButton)}>
            {optionPositive}
          </span>
        </div>
        <div
          value={"negative"}
          className={classnames(commonStyles.boxRoundButton, styles.boxButton)}
          style= {{backgroundColor: (this.state.onButton== "negative")?'#ff7a5f': '#e6e6e6'}}
          onClick={this._handleClick_dialog_BooleanNegat}
          onMouseEnter={this._handleEnter_button}
          onMouseLeave={this._handleLeave_button}>
          <span
            className={classnames(commonStyles.spanButton, commonStyles.fontButton)}>
            {optionNegative}
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
