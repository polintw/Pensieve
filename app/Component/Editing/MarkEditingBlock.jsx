import React from 'React';
import {
  EditorState,
  convertToRaw,
  convertFromRaw
} from 'draft-js';
import DraftEditor from '../Draft/DraftEditor.jsx';

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

    }
    this.contentEditor = React.createRef();
    this._set_EditorUpdate = this._set_EditorUpdate.bind(this);
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
        maxHeight: '152%', //the target MaxHeight is 64%, limit by parent
        position: 'relative',
        boxSizing: 'border-box',
        margin: '0',
        paddingBottom: '8%',
        paddingLeft: '6%',
        fontSize: '1.36rem',
        letterSpacing: '0.18rem',
        lineHeight: '1.9rem',
        fontWeight: '300',
        color: '#FAFAFA',
        overflow: 'auto',
        cursor: 'text'
      },
      Com_MarkEditingBlock_Content_Main_div_edit_Panel_: {
        width: '100%',
        height: '15%',
        position: 'relative',
        boxSizing: 'border-box',
        marginTop: '6%',
        float: 'right'
      },
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
    this.contentEditor.current.focus();
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
          <div
            style={{
              width: '48%',
              height: ' 42%',
              position:'absolute',
              left: '0',
              bottom:'0%',
              borderLeft: 'solid 1px #ababab',
              borderBottom: 'solid 1px #ababab'}}></div>
          <DraftEditor
            ref={this.contentEditor}
            editorState={this.props.editorState}
            _on_EditorChange={this._set_EditorUpdate}/>
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
        </div>
      </div>
    )
  }
}
