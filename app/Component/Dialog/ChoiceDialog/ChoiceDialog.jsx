import React from 'react';
import {
  withRouter,
  Redirect
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import commonStyles from "../commonStyles.module.css";

class ChoiceDialog extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onButton: false,
      onLeaving: false
    };
    this._render_options = this._render_options.bind(this);
    this._render_Message = this._render_Message.bind(this);
    this._handleClick_ChoiceDialog_option = this._handleClick_ChoiceDialog_option.bind(this);
    this._handleClick_ChoiceDialog_leaving = this._handleClick_ChoiceDialog_leaving.bind(this);
    this._handleEnter_button = this._handleEnter_button.bind(this);
    this._handleLeave_button = this._handleLeave_button.bind(this);
    this._handleMouseOn_leaving = ()=> this.setState((prevState,props)=>{return {onLeaving: prevState.onLeaving?false:true}});
    this.style={
      Com_ChoiceDialog_: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        width: '100%',
        minHeight: '10rem',
        boxSizing: 'border-box',
        padding: '2.4rem 3.7rem 3rem 3rem',
      },
      Com_ChoiceDialog_panel_: {
        display: 'flex',
        flexWrap: 'nowrap',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        width: '100%',
        boxSizing: 'border-box',
        margin:'0 0 3rem'
      },
      Com_ChoiceDialog_message_: {
        width: '100%',
        boxSizing: 'border-box',
        margin: '1px 1% 3.4rem'
      }
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

  _handleClick_ChoiceDialog_option(event){
    event.stopPropagation();
    event.preventDefault();

    //pass the value click(e.currentTarget) to parent
    this.props._submitHandler(event.currentTarget.getAttribute('value'));
  }

  _handleClick_ChoiceDialog_leaving(event){
    event.stopPropagation();
    event.preventDefault();
    this.props._leavingHandler();
  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  _render_Message(){
    let messageSpan = this.props.message.map((obj, index)=>{
      return (
        <span
          key={"key_ChoiceDialog_message_"+index}
          className={classnames(commonStyles.fontMessage, styles.spanMessage)}
          style={Object.assign({}, (obj.style=='italic') ? {fontStyle: 'italic'}:{})}>
          {obj.text}</span>
      )
    })

    return messageSpan;
  }

  _render_options(){
    let DOMarr = this.props.optionsList.map((item, index)=>{
      return (
        <div
          key={"key_ChoiceDialog_option_"+index}
          value={item.name}
          className={classnames(commonStyles.boxRoundButton)}
          style={(this.state.onButton==item.name)? {backgroundColor: '#ff7a5f'}:{}}
          onClick={this._handleClick_ChoiceDialog_option}
          onMouseEnter={this._handleEnter_button}
          onMouseLeave={this._handleLeave_button}>
          <span
            className={classnames(commonStyles.spanButton, commonStyles.fontButton)}>
            {item.name}
          </span>
        </div>
      )
    });

    return DOMarr;
  }

  render(){
    return(
      <div
        style={this.style.Com_ChoiceDialog_}>
        <div
          style={this.style.Com_ChoiceDialog_message_}>
          {this._render_Message()}
        </div>
        <div
          style={this.style.Com_ChoiceDialog_panel_}>
          {this._render_options()}
        </div>
        <div
          className={classnames(styles.boxfoot)}>
          <div
            className={classnames(styles.boxLeaving)}
            onClick={this._handleClick_ChoiceDialog_leaving}
            onMouseEnter={this._handleMouseOn_leaving}
            onMouseLeave={this._handleMouseOn_leaving}>
            <span
              className={classnames(styles.fontLeaving)}
              style={this.state.onLeaving? {color: 'rgb(16,16,16)'}:{}}>
              {this.props.leavingChoice}
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
    unitCurrent: state.unitCurrent
  }
}

export default withRouter(connect(
  mapStateToProps,
  null
)(ChoiceDialog));
