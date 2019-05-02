import React from 'react';
import {
  Link,
  withRouter,
  Redirect
} from 'react-router-dom';
import {connect} from "react-redux";
import SvgEditingSerial from '../Svg/SvgEditingSerial.jsx';
import DraftDisplay from './Draft/DraftDisplay.jsx';

class MarksArticleEdit extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      markEditing: false,
      editingEditorContent: null
    };
    this.contentEditor = React.createRef();
    this._set_EditorUpdate = this._set_EditorUpdate.bind(this);
    this._handleClick_Article_editing = this._handleClick_Article_editing.bind(this);
    this._handleClick_Article_openMark = this._handleClick_Article_openMark.bind(this);
    this._handleClick_markComponentEditor = this._handleClick_markComponentEditor.bind(this);
    this._handleClick_ArticleEdit_complete = this._handleClick_ArticleEdit_complete.bind(this);
    this.style={
      Com_MarksArticle_: {
        width: '100%',
        minHeight: '48%',
        position: 'relative',
        boxSizing: 'border-box',
        padding: '1rem 4%'
      },
      Com_MarksArticle_paragraph: {
        display: 'inline-block',
        width: '100%',
        position: 'relative',
        boxSizing: 'border-box',
        padding: '0.5rem 0',
        borderBottom: 'solid 1px #000000',
        fontSize: '1.36rem',
        fontWeight: '300',
        letterSpacing: '0.16rem',
        lineHeight: '1.9rem',
        wordWrap: 'break-word',
        color: '#FAFAFA'
      }
    };
  }

  _handleClick_Article_openMark(event){
    event.preventDefault();
    event.stopPropagation();
    let markKey = event.currentTarget.getAttribute('markkey');
    this.props._set_MarkInspect(this.props.layer, markKey);
  }

  _handleClick_Article_editing(event){
    event.preventDefault();
    event.stopPropagation();
    let markKey = event.currentTarget.getAttribute('markkey');
    this.setState({
      markEditing: markKey,
      editingEditorContent: this.props.marksObj.data[key].editorContent
    });
    this.props._set_ArticleEdit(markKey);
  }

  _handleClick_markComponentEditor(event){
    event.stopPropagation();
    event.preventDefault();
    this.contentEditor.current.focus();
  }

  _handleClick_ArticleEdit_complete(event){
    event.stopPropagation();
    event.preventDefault();
    let markKey = this.state.markEditing; //we do this to assure the key still there not influenced by the setState below
    this.props.marksObj.data[markKey].editorContent = Object.assign({}, this.state.editingEditorContent);
    //above would modify the state in perent directly, but do not trigger the setState
    //so, we still trigger it manually
    this.props._close_Mark_Complete(this.props.marksObj, this.props.layer=="cover"? 0:1);
    this.props._set_ArticleEdit(false);
    this.setState({
      markEditing: false,
      editingEditorContent: null
    });
  }

  _set_EditorUpdate(editorState){
    this.setState({editingEditorContent: convertToRaw(editorState.getCurrentContent())});
  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  render(){
    //let cx = cxBind.bind(styles);
    const self = this;
    let articleArr = this.props.marksObj.list.map((key, index)=>{
      return (
        <div
          key={"key_MarksArticle_"+key}
          style={this.style.Com_MarksArticle_paragraph}>
          {
            (this.state.markEditing==key) ?(
              <div>
                <div
                  onClick={this._handleClick_markComponentEditor}>
                  <DraftEditor
                    ref={this.contentEditor}
                    editorState={this.state.editingEditorContent}
                    _on_EditorChange={this._set_EditorUpdate}/>
                </div>
                <div
                  style={Object.assign({},this.style.Com_MarkEditingBlock_Content_Main_div_edit_Panel_, styleByMidline.panel)}>
                  <div
                    style={Object.assign({}, styleMiddle.boxSubmitButton, styleMiddle.roundRecBox, {backgroundColor:'#ff7a5f'})}
                    onClick={this._handleClick_ArticleEdit_complete}>
                    <span
                      className={'centerAlignChild'}
                      style={styleMiddle.spanInteractions}>
                      {'save'}
                    </span>
                  </div>
                  <div
                    style={this.style.Com_MarkEditingBlock_Content_Main_div_edit_Panel_ref}>
                    {"[ ]"}
                  </div>
                </div>
              </div>
            ):(
              <div>
                <div
                  markkey={key}
                  onClick={this._handleClick_Article_editing}>
                  <DraftDisplay
                    editorState={this.props.marksObj.data[key].editorContent}/>
                </div>
                <div
                  style={}
                  markkey={key}
                  onClick={this._handleClick_Article_openMark}>
                  <SvgEditingSerial
                    serial={index}/>
                </div>
              </div>
            )
          }
        </div>
      )
    })

    return(
      <div
        style={this.style.Com_MarksArticle_}>
        {articleArr}
      </div>
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
)(MarksArticle));
