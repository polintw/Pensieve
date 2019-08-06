import React from 'react';
import {connect} from "react-redux";
import classnames from 'classnames';
import {
  EditorState,
  convertToRaw,
  convertFromRaw
} from 'draft-js';
import styles from "./styles.module.css";
import DraftEditor from '../../Draft/DraftEditor.jsx';
import ModalBox from '../../ModalBox.jsx';

const styleMiddle = {
  boxInteraction: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: 'rgba(5,5,5,0.72)'
  },
  boxSubmitButton:{
    display: 'inline-block',
    width: '27%',
    height: '100%',
    position: 'relative',
    boxSizing: 'border-box',
    float: 'right',
    margin: '0 3%'
  },
  roundRecBox: {
    borderRadius: '2.4vh',
    backgroundColor: "rgb(184, 184, 184)",
    cursor: 'pointer'
  },
  fontInteractions: {
    fontSize: '1.32rem',
    fontWeight: '400',
    letterSpacing: '0.1rem',
    textAlign: 'center',
    color: 'rgb(16, 16, 16)'
  }
}

class MarkEditingBlock extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    }
    this.contentEditor = React.createRef();
    this._set_EditorUpdate = this._set_EditorUpdate.bind(this);
    this._handleClick_blockPanel_delete = this._handleClick_blockPanel_delete.bind(this);
    this._handleClick_blockPanel_complete = this._handleClick_blockPanel_complete.bind(this);
    this._handleClick_markComponentEditor = this._handleClick_markComponentEditor.bind(this);
    this.style={
      Com_MarkEditingBlock_: {
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        width: '100%',
        position: 'static',
        boxSizing: 'border-box',
      },
      Com_MarkEditingBlock_Content_Main_div_edit_Panel_: {
        width: '100%',
        height: '2.5rem',
        boxSizing: 'border-box',
        margin: '3.2vh 0px 4.8vh',
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

  _set_EditorUpdate(editorState){
    this.props._set_markUpdate_editor(convertToRaw(editorState.getCurrentContent()), this.props.markKey);
  }

  componentDidMount(){

  }

  render(){
    const downToMdidline = this.props.downToMdidline;
    const toCircleLeft = this.props.toCircleLeft;

    return(
      <div
        style={
          Object.assign({},
            this.style.Com_MarkEditingBlock_,
            {bottom: downToMdidline ? '44%':'', right: toCircleLeft? '0':'', left: toCircleLeft? '':'0'})}>
        <div
          className={classnames(styles.boxContent)}>
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
          style={styleMiddle.boxInteraction}>
          <div
            style={Object.assign({},this.style.Com_MarkEditingBlock_Content_Main_div_edit_Panel_)}>
            <div
              style={Object.assign({}, styleMiddle.boxSubmitButton, styleMiddle.roundRecBox, {backgroundColor:'rgba(233, 181, 90, 1)'})}
              onClick={this._handleClick_blockPanel_complete}>
              <span
                className={'centerAlignChild'}
                style={styleMiddle.fontInteractions}>
                {'save'}
              </span>
            </div>
            <div
              style={Object.assign({}, styleMiddle.boxSubmitButton, styleMiddle.roundRecBox)}
              onClick={this._handleClick_blockPanel_delete}>
              <span
                className={'centerAlignChild'}
                style={styleMiddle.fontInteractions}>
                {'delete'}
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
