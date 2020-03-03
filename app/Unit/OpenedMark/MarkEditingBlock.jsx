import React from 'react';
import {connect} from "react-redux";
import classnames from 'classnames';
import {
  EditorState,
  convertToRaw,
  convertFromRaw
} from 'draft-js';
import styles from "./styles.module.css";
import DraftEditor from '../../Components/Draft/DraftEditor.jsx';
import ModalBox from '../../Components/ModalBox.jsx';

const styleMiddle = {
  boxSubmitButton:{
    display: 'inline-block',
    width: '28%',
    height: '100%',
    position: 'relative',
    boxSizing: 'border-box',
    margin: '0 4%'
  },
  roundRecBox: {
    borderRadius: '2.4vh',
    backgroundColor: "rgb(184, 184, 184)",
    cursor: 'pointer'
  },
  fontInteractions: {
    fontSize: '1.42rem',
    fontWeight: '400',
    letterSpacing: '0.07rem',
    textAlign: 'center',
    color: 'rgb(16, 16, 16)'
  }
}

class MarkEditingBlock extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onEnterSave: false
    }
    this.contentEditor = React.createRef();
    this.comEditingBlock = React.createRef();
    this._set_EditorUpdate = this._set_EditorUpdate.bind(this);
    this._handleEnter_Save = this._handleEnter_Save.bind(this);
    this._handleLeave_Save = this._handleLeave_Save.bind(this);
    this._handleClick_blockPanel_delete = this._handleClick_blockPanel_delete.bind(this);
    this._handleClick_blockPanel_complete = this._handleClick_blockPanel_complete.bind(this);
    this._handleClick_markComponentEditor = this._handleClick_markComponentEditor.bind(this);
    this.style={
      Com_MarkEditingBlock_: {
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        overflowY: 'auto'
      },
      Com_MarkEditingBlock_Content_Main_div_edit_Panel_: {
        display: 'flex',
        justifyContent: 'flex-end',
        width: '100%',
        height: '2.4rem',
        boxSizing: 'border-box',
        margin: '2.2rem 0px 1rem',
        padding: '0 3%'
      }
    }
  };

  _handleClick_markComponentEditor(event){
    event.stopPropagation();
    event.preventDefault();
    this.contentEditor.current.focus();
  }

  _handleClick_blockPanel_delete(event){
    event.stopPropagation();
    event.preventDefault();
    this.props._set_markDelete(this.props.markKey);
  }

  _handleClick_blockPanel_complete(event){
    event.stopPropagation();
    event.preventDefault();
    this.props._reset_expandState();
  }

  _handleEnter_Save(e){
    //don't need to stop proppagation,
    //because both the 'onMouseEnter' & 'onMouseLeave'
    //would not 'bubble'
    this.setState({
      onEnterSave: true
    })
  }

  _handleLeave_Save(e){
    //don't need to stop proppagation,
    //because both the 'onMouseEnter' & 'onMouseLeave'
    //would not 'bubble'
    this.setState({
      onEnterSave: false
    })
  }

  _set_EditorUpdate(editorState){
    this.props._set_markUpdate_editor(convertToRaw(editorState.getCurrentContent()), this.props.markKey);
  }

  componentDidMount(){

  }

  render(){
    return(
      <div
        ref={this.comEditingBlock}
        style={this.style.Com_MarkEditingBlock_}>
        <div
          className={classnames(styles.boxContent)}>
          <div
            style={{
              width: '100%',
              height: '13vh'
            }}></div>
          <div
            className={classnames(styles.boxContentDraft, styles.fontContentDraft)}
            onClick={this._handleClick_markComponentEditor}>
            <DraftEditor
              ref={this.contentEditor}
              editorState={this.props.editorState}
              _on_EditorChange={this._set_EditorUpdate}/>
          </div>
          <div
            className={classnames(styles.boxDraftBottom)}>
          </div>
        </div>
        <div
          className={classnames(styles.boxInteraction)}
          style={Object.assign(
            {},
            {
              height: '18vh'
            }
          )}>
          <div className={styles.boxInteractBack}>
            <div className={styles.boxInteractBackGradiant}/>
            <div className={styles.boxInteractBackSolid}/>
          </div>
          <div
            style={Object.assign({},this.style.Com_MarkEditingBlock_Content_Main_div_edit_Panel_)}>
            <div
              style={Object.assign({}, styleMiddle.boxSubmitButton, styleMiddle.roundRecBox)}
              onClick={this._handleClick_blockPanel_delete}>
              <span
                className={'centerAlignChild'}
                style={styleMiddle.fontInteractions}>
                {'delete'}
              </span>
            </div>
            <div
              style={Object.assign({}, styleMiddle.boxSubmitButton, styleMiddle.roundRecBox, {backgroundColor: this.state.onEnterSave? "#ff7a5f": "#e6e6e6"})}
              onClick={this._handleClick_blockPanel_complete}
              onMouseEnter={this._handleEnter_Save}
              onMouseLeave={this._handleLeave_Save}>
              <span
                className={'centerAlignChild'}
                style={styleMiddle.fontInteractions}>
                {'save'}
              </span>
            </div>
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

const mapDispatchToProps = (dispatch)=>{
  return {

  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MarkEditingBlock);
