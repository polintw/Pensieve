import React from 'react';
import {connect} from "react-redux";
import classnames from 'classnames';
import {
  EditorState,
  convertToRaw,
  convertFromRaw
} from 'draft-js';
import styles from "../styles.module.css";
import stylesFont from '../../stylesFont.module.css';
import DraftEditor from '../../../Components/Draft/DraftEditor.jsx';
import ModalBox from '../../../Components/ModalBox.jsx';

class MarkEditingBlock extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      contentRaw: this.props.contentRaw,
      onEnterSave: false
    }
    this.contentEditor = React.createRef();
    this.comEditingBlock = React.createRef();
    this._set_EditorUpdate = this._set_EditorUpdate.bind(this);
    this._handleEnter_Save = this._handleEnter_Save.bind(this);
    this._handleLeave_Save = this._handleLeave_Save.bind(this);
    this._handleClick_blockPanel_cancel = this._handleClick_blockPanel_cancel.bind(this);
    this._handleClick_blockPanel_delete = this._handleClick_blockPanel_delete.bind(this);
    this._handleClick_blockPanel_complete = this._handleClick_blockPanel_complete.bind(this);
    this._handleClick_markComponentEditor = this._handleClick_markComponentEditor.bind(this);
    this.style={
      Com_MarkEditingBlock_: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: "space-between",
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
      },
    }
  };

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

  _handleClick_markComponentEditor(event){
    event.stopPropagation();
    event.preventDefault();
    this.contentEditor.current.focus();
  }

  _handleClick_blockPanel_cancel(event){
    event.stopPropagation();
    event.preventDefault();
    this.props._reset_expandState();
  }

  _handleClick_blockPanel_delete(event){
    event.stopPropagation();
    event.preventDefault();
    this.props._set_markDelete(this.props.markKey);
  }

  _handleClick_blockPanel_complete(event){
    event.stopPropagation();
    event.preventDefault();
    this.props._set_markUpdate_editor(this.state.contentRaw, this.props.markKey);
  }

  _set_EditorUpdate(editorState){
    this.setState({
      contentRaw: convertToRaw(editorState.getCurrentContent())
    });
  }

  componentDidMount(){

  }

  render(){
    return(
      <div
        ref={this.comEditingBlock}
        style={this.style.Com_MarkEditingBlock_}>
        <div
          className={classnames(styles.boxBlockDraft)}
          onClick={this._handleClick_markComponentEditor}>
          <div
            className={classnames(styles.boxDraftEditor)}>
            <DraftEditor
              ref={this.contentEditor}
              editorState={this.state.contentRaw}
              _on_EditorChange={this._set_EditorUpdate}/>
          </div>
        </div>
        <div
          className={classnames(styles.boxBlockInteract)}>
          <div>
            <div
              onClick={this._handleClick_blockPanel_delete}>
              <span
                className={classnames(stylesFont.fontSubmit, stylesFont.colorGrey)}>
                {'delete'}
              </span>
            </div>
            <div
              onClick={this._handleClick_blockPanel_complete}
              onMouseEnter={this._handleEnter_Save}
              onMouseLeave={this._handleLeave_Save}>
              <span
                className={classnames(stylesFont.fontSubmit, stylesFont.colorStandard)}>
                {'save'}
              </span>
            </div>
          </div>
        </div>
        <div className={styles.boxBlockBack}>
          <span
            onClick={this._handleClick_blockPanel_cancel}>
            {" ╳ "}
          </span>
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
