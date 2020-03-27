import React from 'react';
import {
  withRouter,
  Redirect
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import commonStyles from "../commonStyles.module.css";

class SingleDialog extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onButton: false,
    };
    this._render_Message = this._render_Message.bind(this);
    this._handleClick_dialog_Posit = this._handleClick_dialog_Posit.bind(this);
    this._handleEnter_button = this._handleEnter_button.bind(this);
    this._handleLeave_button = this._handleLeave_button.bind(this);

  }

  _handleEnter_button(e){
    this.setState({
      onButton: true
    })
  }

  _handleLeave_button(e){
    this.setState({
      onButton: false
    })
  }

  _handleClick_dialog_Posit(event){
    event.stopPropagation();
    event.preventDefault();
    this.props._positiveHandler();
  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  _render_Message(){
    let messageSpan = this.props.message.map((obj, index)=>{
      return (
        <span
          key={"key_SinDialog_message_"+index}
          className={classnames(commonStyles.fontMessage, styles.spanMessage)}
          style={obj.style}>
          {obj.text}</span>
      )
    })

    return messageSpan;
  }

  render(){
    return(
      <div
        className={classnames(styles.comSinDialog)}>
        <div
          className={classnames(styles.boxMessage)}>
          {this._render_Message()}
        </div>
        <div
          className={classnames(styles.boxfoot)}>
          <div
            className={classnames(commonStyles.boxRoundButton, styles.boxButton)}
            style={this.state.onButton? {backgroundColor: '#ff7a5f'}:{}}
            onClick={this._handleClick_dialog_Posit}
            onMouseEnter={this._handleEnter_button}
            onMouseLeave={this._handleLeave_button}>
            <span
              className={classnames(commonStyles.spanButton, commonStyles.fontButton)}>
              {this.props.buttonValue}
            </span>
          </div>

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
)(SingleDialog));
