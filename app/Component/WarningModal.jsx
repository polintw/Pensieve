import React from 'react';
import {
  withRouter,
  Redirect
} from 'react-router-dom';
import {connect} from "react-redux";
import ModalBox from './ModalBox.jsx';
import ModalBackground from './ModalBackground.jsx';

const styleMiddle = {
  boxNavButton:{
    display: 'inline-block',
    height: '100%',
    position: 'relative',
    boxSizing: 'border-box',
  },
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

class WarningModal extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._handleClick_warningModal_positive = this._handleClick_warningModal_positive.bind(this);
    this.style={
      Com_WarningModal_: {
        width: '36%',
        height: '35%',
        position: 'absolute',
        top: '24%',
        left: '50%',
        transform: 'translate(-50%,0)',
        boxSizing: 'border-box',
        padding: '1rem 1.8rem',
        boxShadow: '1px 1px 0.8rem 0',
        borderRadius: '1rem',
        backgroundColor: 'white'
      },
      Com_WarningModal_panel_: {
        width: '100%',
        height: '17%',
        position: 'relative',
        boxSizing: 'border-box'
      },
      Com_WarningModal_message_: {
        width: '100%',
        height: '76%',
        position: 'relative',
        boxSizing: 'border-box'
      }
    };
  }

  _handleClick_warningModal_positive(event){
    event.stopPropagation();
    event.preventDefault();
    this.props._set_WarningModal(true);
  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  render(){
    return(
      <ModalBox containerId="root">
        <ModalBackground onClose={()=>{}} style={{backgroundColor: "transparent", position: "fixed"}}>
          <div
            style={this.style.Com_WarningModal_}>
            <div
              style={this.style.Com_WarningModal_message_}>
              <span
                style={styleMiddle.contentInter}>
                {this.props.message}</span>
            </div>
            <div
              style={this.style.Com_WarningModal_panel_}>
              <div
                style={Object.assign({}, styleMiddle.boxNavButton, {width: '32%'})}>
                <div
                  style={styleMiddle.roundRecBox}
                  onClick={this._handleClick_warningModal_positive}>
                  <span
                    className={'centerAlignChild'}
                    style={styleMiddle.spanDestiny}>
                    {"understand"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </ModalBackground>
      </ModalBox>
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
)(WarningModal));
