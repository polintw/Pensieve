import React from 'react';
import {
  EditorState,
  convertToRaw,
  convertFromRaw
} from 'draft-js';
import RefEditing from './RefEditing.jsx';
import DraftEditor from '../Draft/DraftEditor.jsx';
import SvgPropic from '../Svg/SvgPropic.jsx';
import ModalBox from '../ModalBox.jsx';

const styleMiddle = {
  boxSubmitButton:{
    display: 'inline-block',
    width: '24%',
    height: '100%',
    position: 'relative',
    boxSizing: 'border-box',
    float: 'right',
    margin: '0 2%'
  },
  roundRecBox: {
    borderRadius: '2.4vh',
    backgroundColor: "#e6e6e6",
    cursor: 'pointer'
  },
  spanInteractions: {
    fontSize: '1.32rem',
    fontWeight: '400',
    letterSpacing: '0.12rem',
    textAlign: 'center',
    color: 'rgb(16, 16, 16)'
  }
}

export default class MarkEditingBlock extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      refQuote: false
    }
    this.contentEditor = React.createRef();
    this._set_refArr_new = this._set_refArr_new.bind(this);
    this._set_EditorUpdate = this._set_EditorUpdate.bind(this);
    this._handleClick_markContent_Ref = this._handleClick_markContent_Ref.bind(this);
    this._handleClick_blockPanel_delete = this._handleClick_blockPanel_delete.bind(this);
    this._handleClick_blockPanel_complete = this._handleClick_blockPanel_complete.bind(this);
    this._handleClick_markComponentEditor = this._handleClick_markComponentEditor.bind(this);
    this.style={
      Com_MarkEditingBlock_: {
        display: 'inline-block',
        width: '100%',
        height: '100%',
        position: 'relative',
        boxSizing: 'border-box',
        overflowY: 'visible'
      },
      Com_MarkEditingBlock_Content_Main_div_edit_Editor: {
        display: 'inline-block',
        maxWidth: '100%',
        minWidth: '49%',
        minHeight: '54%',
        maxHeight: '145%', //the target MaxHeight is 64%, limit by parent
        position: 'relative',
        boxSizing: 'border-box',
        marginBottom: '7%',
        paddingLeft: '6%',
        fontSize: '1.36rem',
        letterSpacing: '0.18rem',
        lineHeight: '1.9rem',
        fontWeight: '300',
        color: '#FAFAFA',
        overflow: 'auto',
        cursor: 'text'
      },
      Com_MarkEditingBlock_credits_: {
        width: '100%',
        height: '16%',
        position: 'relative',
        boxSizing: 'border-box',
        marginTop: '2%',
        float: 'right'
      },
      Com_MarkEditingBlock_Content_Main_div_edit_Panel_: {
        width: '100%',
        height: '15%',
        position: 'relative',
        boxSizing: 'border-box',
        marginTop: '6%',
        float: 'right'
      },
      Com_MarkEditingBlock_Content_Main_div_edit_Panel_ref: {
        float: 'right',
        fontSize: '2.8vh',
        cursor: 'pointer'
      },
      component_refEditing: {
        outline: {
          width: "22%",
          height: '45%',
          position: 'absolute',
          boxSizing: 'border-box',
          backgroundColor: 'rgba(25,25,25,0.6)',
          borderRadius: '2.5vw'
        },
        web_inputEditor: {
          width: '85%',
          height: '20%',
          position: 'absolute',
          top: '15%',
          left: '50%',
          transform: 'translate(-50%, 0)',
          boxSizing: 'border-box',
          padding: '3% 1%',
          borderBottom: "1px solid white",
          color: '#FAFAFA',
          cursor: 'text'
        },
        web_preview_outline: {
          width: '100%',
          height: '50%',
          position: 'absolute',
          top: '35%',
          left: '0',
          boxSizing: 'border-box'
        },
        web_preview_body: {
          width: '90%',
          height: '70%',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          boxSizing: 'border-box',
          border: '1px solid black',
          boxShadow: '0 1px 3px 1px'
        },
        web_panel: {
          width: '100%',
          height: '16%',
          position: 'absolute',
          top: '88%',
          left: '50%',
          transform: 'translate(-50%, 0)',
          boxSizing: 'border-box'
        }
      }
    }
  };

  _handleClick_markContent_Ref(event){
    event.stopPropagation();
    event.preventDefault();
    this.setState({refQuote: true});
  }

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

  _set_refArr_new(refObj){
    this.setState({refQuote: false});
    this.props._set_refsArr(refObj);
  }

  _set_EditorUpdate(editorState){
    this.props._set_markUpdate_editor(convertToRaw(editorState.getCurrentContent()), this.props.markKey);
  }

  componentDidMount(){

  }

  render(){
    const downToMdidline = this.props.downToMdidline;
    const toCircleLeft = this.props.toCircleLeft;
    let styleByMidline = {
      editor: downToMdidline ? {bottom: '39%', position: 'absolute', right:toCircleLeft?'0':'',left:toCircleLeft?'':'0' }:{},
      panel: downToMdidline ? {bottom: '18%', position: 'absolute'}:{},
      credits: downToMdidline ? {bottom: '0', position: 'absolute'}:{},
    }
    return(
      <div
        style={this.style.Com_MarkEditingBlock_}>
        <div
          style={
            Object.assign({},
              this.style.Com_MarkEditingBlock_Content_Main_div_edit_Editor,
              {float: toCircleLeft? 'right':'left'},
              styleByMidline.editor
            )}
          onClick={this._handleClick_markComponentEditor}>
          <DraftEditor
            ref={this.contentEditor}
            editorState={this.props.editorState}
            _on_EditorChange={this._set_EditorUpdate}/>
        </div>
        <div
          style={{width: '100%', position: 'relative', float: 'left'}}>
          <div
            style={{
              width: '48%',
              borderBottom: 'solid 1px #ababab'}}></div>
        </div>
        <div
          style={Object.assign({},this.style.Com_MarkEditingBlock_Content_Main_div_edit_Panel_, styleByMidline.panel)}>
          <div
            style={Object.assign({}, styleMiddle.boxSubmitButton, styleMiddle.roundRecBox, {backgroundColor:'#ff7a5f'})}
            onClick={this._handleClick_blockPanel_complete}>
            <span
              className={'centerAlignChild'}
              style={styleMiddle.spanInteractions}>
              {'save'}
            </span>
          </div>
          <div
            style={Object.assign({}, styleMiddle.boxSubmitButton, styleMiddle.roundRecBox)}
            onClick={this._handleClick_blockPanel_delete}>
            <span
              className={'centerAlignChild'}
              style={styleMiddle.spanInteractions}>
              {'delete'}
            </span>
          </div>
          <div
            style={this.style.Com_MarkEditingBlock_Content_Main_div_edit_Panel_ref}
            onClick={this._handleClick_markContent_Ref}>
            {"[ ]"}
          </div>
        </div>
        <div
          style={Object.assign({}, this.style.Com_MarkEditingBlock_credits_, styleByMidline.credits)}>
          <span  style={{display:'inline-block', width: "24%", height: '99%', position: 'relative'}}><SvgPropic/></span>
          <span  style={{display:'inline-block', width: "24%", height: '99%', position: 'relative'}}><SvgPropic/></span>
        </div>
        <div
          style={{display: 'inline-block', float: 'right'}}>
          {"(多行參考資料連結)"}
        </div>
        {
          this.state.refQuote &&
          <ModalBox containerId={"mark_"+this.props.markKey}>
            <RefEditing
              componentStyleGroup={this.style.component_refEditing}
              _set_refArr_new={this._set_refArr_new}/>
          </ModalBox>
        }
      </div>
    )
  }
}
