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

class SingleCloseDialog extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onButton: false,
    };
    this._render_Message = this._render_Message.bind(this);
    this._handleClick_dialog_SinClosePosit = this._handleClick_dialog_SinClosePosit.bind(this);
    this._handleEnter_button = this._handleEnter_button.bind(this);
    this._handleLeave_button = this._handleLeave_button.bind(this);
    this.style={

    };
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

  _handleClick_dialog_SinClosePosit(event){
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
          key={"key_SinCloseDialog_message_"+index}
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
        className={classnames(styles.comSinCloseDialog)}>
        <div
          className={classnames(styles.boxTop)}>
          <div
            className={classnames(commonStyles.boxCornerButton, styles.boxButton)}
            style={ this.state.onButton? {backgroundColor: '#ff7a5f'}:{backgroundColor: '#4587A0'} }
            onClick={this._handleClick_dialog_SinClosePosit}
            onMouseEnter={this._handleEnter_button}
            onMouseLeave={this._handleLeave_button}>
            <span
              className={classnames(
                'fontTitleSmall',
                'colorWhite'
              )}>
              {" ╳ "}
            </span>
          </div>
        </div>
        <div
          className={classnames(styles.boxMessage)}>
          {this._render_Message()}
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
)(SingleCloseDialog));
