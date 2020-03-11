import React from 'react';
import {connect} from "react-redux";
import DateConverter from '../../../Components/DateConverter.jsx';

const generalStyle = { //could included in a global style sheet
  absolute_FullVersion: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: '0',
    left:'0',
    boxSizing: 'border-box'
  }
}

const styleMiddle = {
  boxNavButton:{
    display: 'inline-block',
    height: '100%',
    position: 'relative',
    boxSizing: 'border-box',
  },
  boxInlineRelative: {
    display: 'inline-block',
    position: 'relative',
    boxSizing:'border-box',
  },
  roundRecBox: {
    width: '100%',
    height: '100%',
    position: 'relative',
    boxSizing: 'border-box',
    borderRadius: '2.4vh',
    overflow: 'hidden',
    cursor: 'pointer'
  },
  spanEditingDestiny: {
    width: '100%',
    fontSize: '1.3rem',
    fontWeight: '400',
    letterSpacing: '0.14rem',
    textAlign: 'center',
    color: 'black'
  }
}

class Submit extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onEnterSubmit: false
    };
    this._handleEnter_Submit = this._handleEnter_Submit.bind(this);
    this._handleLeave_Submit = this._handleLeave_Submit.bind(this);
    this._handleClick_Editing_Submit = this._handleClick_Editing_Submit.bind(this);
    this._handleClick_Editing_Cancell = this._handleClick_Editing_Cancell.bind(this);
    this.style={
      Com_EPanel_: {

      },
      Com_Modal_Editing_Panel_Destiny_: {
        width: '18%',
        height: '100%',
        position: 'absolute',
        top: '0%',
        right: '8%',
        boxSizing: 'border-box'
      },
      Com_Modal_Editing_Panel_Info_: {
        position: 'absolute',
        bottom: '0%',
        left: '10%',
        boxSizing: 'border-box',
      }
    }
  }

  _handleClick_Editing_Cancell(event){
    event.stopPropagation();
    event.preventDefault();
    if(this.props.unitSubmitting || this.props.editing || this.props.warningDialog || this.props.confirmDialog) return;
    this.props._set_Clear();
  }

  _handleClick_Editing_Submit(event){
    event.stopPropagation();
    event.preventDefault();
    if(this.props.unitSubmitting || this.props.editing || this.props.warningDialog || this.props.confirmDialog) return;
    this.props._submit_newShare();
  }

  _handleEnter_Submit(e){
    //don't need to stop proppagation,
    //because both the 'onMouseEnter' & 'onMouseLeave'
    //would not 'bubble'
    this.setState({
      onEnterSubmit: true
    })
  }

  _handleLeave_Submit(e){
    //don't need to stop proppagation,
    //because both the 'onMouseEnter' & 'onMouseLeave'
    //would not 'bubble'
    this.setState({
      onEnterSubmit: false
    })
  }

  render(){
    let editDate = new Date();
    return(
      <div
        style={generalStyle.absolute_FullVersion}>
        <div
          style={this.style.Com_Modal_Editing_Panel_Destiny_}>
          <div
            style={Object.assign({}, styleMiddle.boxNavButton, {width: '36%', marginRight: '16%',cursor: 'pointer'})}>
            <span
              className={'centerAlignChild'}
              style={Object.assign({}, styleMiddle.spanEditingDestiny, {color: '#ababab'})}
              onClick={this._handleClick_Editing_Cancell}>
              {'cancel'}
            </span>
          </div>
          <div
            style={Object.assign({}, styleMiddle.boxNavButton, {width: '45%'})}>
            <div
              style={Object.assign({}, styleMiddle.roundRecBox, {backgroundColor: this.state.onEnterSubmit? "#ff7a5f": "#e6e6e6"})}
              onClick={this._handleClick_Editing_Submit}
              onMouseEnter={this._handleEnter_Submit}
              onMouseLeave={this._handleLeave_Submit}>
              <span
                className={'centerAlignChild'}
                style={styleMiddle.spanEditingDestiny}>
                {"Submit"}
              </span>
              {
                this.props.editing &&
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: '0',
                    left:'0',
                    backgroundColor: 'rgba(230,230,230,0.5)',
                    cursor: 'default'
                  }}></div>
              }
            </div>
          </div>
        </div>
        <div
          style={this.style.Com_Modal_Editing_Panel_Info_}>
          <div
            style={Object.assign({}, styleMiddle.boxInlineRelative, {color: '#e6e6e6'})}>
            <DateConverter
              datetime={editDate}/>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
    unitSubmitting: state.unitSubmitting
  }
}

export default connect(
  mapStateToProps,
  null
)(Submit);
