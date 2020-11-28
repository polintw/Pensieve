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
      onEnterSave: false,
      onEnterDelete: false,
      message: null
    }
    this.contentEditor = React.createRef();
    this.comEditingBlock = React.createRef();
    this._set_EditorUpdate = this._set_EditorUpdate.bind(this);
    this._handleEnter_Save = this._handleEnter_Save.bind(this);
    this._handleLeave_Save = this._handleLeave_Save.bind(this);
    this._handleEnter_Delete = this._handleEnter_Delete.bind(this);
    this._handleLeave_Delete = this._handleLeave_Delete.bind(this);
    this._handleClick_blockPanel_cancel = this._handleClick_blockPanel_cancel.bind(this);
    this._handleClick_blockPanel_delete = this._handleClick_blockPanel_delete.bind(this);
    this._handleClick_blockPanel_complete = this._handleClick_blockPanel_complete.bind(this);
    this._handleClick_markComponentEditor = this._handleClick_markComponentEditor.bind(this);
    this._set_Message = (message)=>{this.setState({message: message})};
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

  _handleEnter_Delete(e){
    this.setState({
      onEnterDelete: true
    })
  }

  _handleLeave_Delete(e){
    this.setState({
      onEnterDelete: false
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
    this.props._set_Markvisible(this.props.markKey);
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
          style={{height: '100%', padding: '0 5%', overflowY: 'hidden'}}
          onClick={this._handleClick_markComponentEditor}>
          <div
            className={classnames(styles.boxDraftEditor, stylesFont.fontContent, stylesFont.colorEditBlack)}>
            <DraftEditor
              ref={this.contentEditor}
              editorState={this.state.contentRaw}
              placeholder={this.props.i18nUIString.catalog['guiding_placeholder_UnitEdit_MarkBlock']}
              _on_EditorChange={this._set_EditorUpdate}
              _handleMessage={this._set_Message}/>
          </div>
        </div>
        <div
          className={classnames(styles.boxBlockInteract)}>
          <div>
            <span className={classnames(stylesFont.fontContent, stylesFont.colorEditBlack)}>
              {this.state.message}
            </span>
          </div>
          <div style={{display: 'flex'}}>
            {
              (this.props.unitCurrent.coverMarksList.indexOf(this.props.markKey) < 0 ) && //not allowed delete existed marks
              <div
                className={classnames(styles.boxBlockSubmit)}
                style={{backgroundColor: this.state.onEnterDelete ? "#757575":'transparent', marginRight: '10px'}}
                onClick={this._handleClick_blockPanel_delete}
                onMouseEnter={this._handleEnter_Delete}
                onMouseLeave={this._handleLeave_Delete}>
                <span
                  className={classnames(
                    'centerAlignChild',
                    stylesFont.fontSubmit,
                    {[stylesFont.colorGrey]: !this.state.onEnterDelete},
                    {[stylesFont.colorWhite]: this.state.onEnterDelete}
                  )}>
                  {'Delete'}
                </span>
              </div>
            }
            <div
              className={classnames(styles.boxBlockSubmit)}
              style={{backgroundColor: this.state.onEnterSave? "#ff8168": 'rgba(255, 129, 104, 0.1)'}}
              onClick={this._handleClick_blockPanel_complete}
              onMouseEnter={this._handleEnter_Save}
              onMouseLeave={this._handleLeave_Save}>
              <span
                className={classnames(
                  'centerAlignChild',
                  stylesFont.fontSubmit,
                  {[stylesFont.colorStandard]: (!this.state.onEnterSave)},
                  {[stylesFont.colorWhite]: (this.state.onEnterSave)}
                )}>
                {this.props.i18nUIString.catalog['submit_save']}
              </span>
            </div>
          </div>
        </div>
        <div
          style={{position: "absolute", top: "3.2%", right: '5%', cursor: "pointer"}}>
          <span
            className={classnames(stylesFont.colorDarkGrey)}
            style={{fontSize: '0.8rem'}}
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
    i18nUIString: state.i18nUIString,
    unitView: state.unitView,
    unitSubmitting: state.unitSubmitting,
    unitCurrent: state.unitCurrent,
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
