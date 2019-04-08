import React from 'react';
import {
  EditorState,
  convertToRaw,
  convertFromRaw
} from 'draft-js';
import RefEditing from './RefEditing.jsx';
import DraftEditor from '../Draft/DraftEditor.jsx';
import ModalBox from '../ModalBox.jsx';

const styleMiddle = {
  spanInteractions: {
    fontSize: '1.4rem',
    letterSpacing: '0.12rem',
    lineHeight: '1.9rem',
    fontWeight: '400',
    color: '#f7f4bc'
  }
}

export default class MarkEditingBlock extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      refQuote: false
    }
    this.contentEditor = React.createRef();
    this._set_EditorUpdate = this._set_EditorUpdate.bind(this);
    this._set_refArr_new = this._set_refArr_new.bind(this);
    this._handleClick_blockPanel_complete = this._handleClick_blockPanel_complete.bind(this);
    this._handleClick_blockPanel_delete = this._handleClick_blockPanel_delete.bind(this);
    this._handleClick_markContent_Ref = this._handleClick_markContent_Ref.bind(this);
    this._handleClick_markComponentEditor = this._handleClick_markComponentEditor.bind(this);
    this.style={
      Com_AuthorBlock_: {
        display: 'inline-block',
        maxWidth: '100%',
        minWidth: '39%',
        height: '100%',
        position: 'relative',
        overflowY: 'visible'
      },
      Com_MarkEditingBlock_Content_Main_div_edit_Editor: {
        display: 'inline-block',
        maxWidth: '100%',
        minHeight: '68%',
        maxHeight: '156%', //the target MaxHeight is 64%, limit by parent
        position: 'relative',
        boxSizing: 'border-box',
        margin: '0',
        paddingBottom: '5%',
        fontSize: '1.36rem',
        letterSpacing: '0.18rem',
        lineHeight: '1.9rem',
        fontWeight: '300',
        color: '#FAFAFA',
        overflow: 'auto',
        cursor: 'text'
      },
      Com_MarkEditingBlock_Body_: {
        width: '42%',
        minHeight: '44vh',
        maxHeight: '88%',
        position: 'absolute',
        transform: 'translate(0,-50%)',
        boxSizing: 'border-box',
        backgroundColor: 'rgba(25,25,25,0.6)',
        boxShadow: '0 0 4vw rgba(25,25,25,0.6)'
      },
      Com_MarkEditingBlock_Body_credits: {
        width: '100%',
        height: '16%',
        position: 'relative',
        boxSizing: 'border-box',
        marginTop: '2%'
      },
      Com_MarkEditingBlock_Content_Main_div: {
        width: '39%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '30%'
      },
      Com_MarkEditingBlock_Content_Main_div_edit_: {
        width: '90%',
        height: '83%',
        position: 'absolute',
        top: '5%',
        left: '50%',
        transform: 'translate(-50%, 0)',
        boxSizing: 'border-box',
        borderLeft: "1px solid white"
      },
      Com_MarkEditingBlock_Content_Main_div_edit_Panel_: {
        width: '100%',
        height: '14%',
        position: 'relative',
        boxSizing: 'border-box',
        color: '#FAFAFA'
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
          top: this.props.coordinate.top-23+"%",
          left: this.props.coordinate.left+28+'%',
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
    this.contentEditor.current.focus();
  }

  render(){
    return(
      <div
        style={Object.assign({}, this.style.Com_AuthorBlock_, {float: this.props.toCircleLeft? 'right':'left'})}>
        <div
          style={this.style.Com_MarkEditingBlock_Content_Main_div_edit_Editor}
          onClick={this._handleClick_markComponentEditor}>
          <DraftEditor
            ref={this.contentEditor}
            editorState={this.props.editorState}
            _on_EditorChange={this._set_EditorUpdate}/>
        </div>
        <div
          style={this.style.Com_MarkEditingBlock_Content_Main_div_edit_Panel_}>
          <div
            style={this.style.Com_MarkEditingBlock_Content_Main_div_edit_Panel_ref}
            onClick={this._handleClick_markContent_Ref}>
            {"[ ]"}
          </div>
          <span
            style={styleMiddle.spanInteractions}
            onClick={this._handleClick_blockPanel_complete}>
            {'Complete'}
          </span>
          <span
            style={styleMiddle.spanInteractions}
            onClick={this._handleClick_blockPanel_delete}>
            {'Delete'}
          </span>
        </div>
        <div
          style={this.style.Com_AuthorBlock_credits_}>
          <span  style={{display:'inline-block', width: "24%", height: '99%', position: 'relative'}}><SvgPropic/></span>
          <span  style={{display:'inline-block', width: "24%", height: '99%', position: 'relative'}}><SvgPropic/></span>
        </div>
        <div
          style={{display: 'inline-block'}}>
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
