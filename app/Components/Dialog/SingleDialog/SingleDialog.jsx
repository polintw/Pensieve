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
    width: '104px',
    height: '32px',
    position: 'relative',
    boxSizing: 'border-box',
    borderRadius: '4px',
    cursor: 'default'
  },
}

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
          className={classnames('fontSubtitle_h5', 'colorOptionsBlack', styles.spanMessage)}
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
          className={classnames(styles.boxfoot)}
          style={{textAlign: 'center'}}>
          <div
            style={Object.assign({},
              styleMiddle.boxNavButton,
              (this.state.onButton)? {backgroundColor: "#ff8168", cursor: 'pointer'}:
              {backgroundColor: '#4587A0'}
            )}
            onClick={this._handleClick_dialog_Posit}
            onMouseEnter={this._handleEnter_button}
            onMouseLeave={this._handleLeave_button}>
            <span
              className={classnames(
                'centerAlignChild',
                'fontSubtitle_h5',
                'colorWhite'
              )}>
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
