import React from 'react';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import stylesFont from '../../stylesFont.module.css';
import DateConverter from '../../../../Components/DateConverter.jsx';

const styleMiddle = {
  boxNavButton:{
    display: 'inline-block',
    width: '96px',
    height: '32px',
    position: 'relative',
    boxSizing: 'border-box',
    borderRadius: '4px',
    cursor: 'pointer'
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
        className={classnames(styles.comSubmit)}>
        <div
          className={classnames(styles.boxDate)}>
          <DateConverter
            datetime={editDate}/>
        </div>
        <div
          className={classnames(styles.boxButtons)}>
          <div
            style={Object.assign({}, styleMiddle.boxNavButton)}>
            <span
              className={classnames('centerAlignChild', stylesFont.colorEditBlack, stylesFont.fontSubmit)}
              onClick={this._handleClick_Editing_Cancell}>
              {'cancel'}
            </span>
          </div>
          <div
            style={Object.assign({}, styleMiddle.boxNavButton, {backgroundColor: 'rgba(255, 129, 104, 0.1)'})}
            onClick={this._handleClick_Editing_Submit}
            onMouseEnter={this._handleEnter_Submit}
            onMouseLeave={this._handleLeave_Submit}>
            <span
              className={classnames('centerAlignChild', stylesFont.fontSubmit, stylesFont.colorStandard)}>
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
                }}/>
              }
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
