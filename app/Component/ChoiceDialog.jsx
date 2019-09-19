import React from 'react';
import {
  withRouter,
  Redirect
} from 'react-router-dom';
import {connect} from "react-redux";

const styleMiddle = {
  roundRecBox: {
    width: '100%',
    height: '100%',
    position: 'relative',
    boxSizing: 'border-box',
    borderRadius: '2.4vh',
    backgroundColor: "#e6e6e6",
    cursor: 'pointer'
  },
  contentInter: {
    fontSize: '1.2rem',
    letterSpacing: '0.1rem',
    lineHeight: '1.7rem',
    color: 'black'
  },
  spanDestiny: {
    width: '100%',
    fontSize: '1.3rem',
    fontWeight: '400',
    letterSpacing: '0.1rem',
    textAlign: 'center',
    color: 'rgb(16, 16, 16)'
  }
}

class ChoiceDialog extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._render_options = this._render_options.bind(this);
    this._handleClick_ChoiceDialog_option = this._handleClick_ChoiceDialog_option.bind(this);
    this.style={
      Com_ChoiceDialog_: {
        width: '100%',
        boxSizing: 'border-box',
        padding: '1rem 1.8rem',
      },
      Com_ChoiceDialog_panel_: {
        width: '100%',
        height: '17%',
        position: 'relative',
        boxSizing: 'border-box'
      },
      Com_ChoiceDialog_message_: {
        width: '100%',
        height: '76%',
        position: 'relative',
        boxSizing: 'border-box'
      }
    };
  }

  _handleClick_ChoiceDialog_option(event){
    event.stopPropagation();
    event.preventDefault();

    //pass the value click(e.currentTarget) to parent
  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  _render_options(){
    let DOMarr = this.props.optionsList.map((item, index)=>{
      return (
        <div
          value={item.name}
          style={styleMiddle.roundRecBox}
          onClick={this._handleClick_ChoiceDialog_option}>
          <span
            className={'centerAlignChild'}
            style={styleMiddle.spanDestiny}>
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
          <span
            style={styleMiddle.contentInter}>
            {this.props.message}</span>
        </div>
        <div
          style={this.style.Com_ChoiceDialog_panel_}>
          {this._render_options()}
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
