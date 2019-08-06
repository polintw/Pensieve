import React from 'react';
import {
  Link,
  withRouter,
  Redirect
} from 'react-router-dom';
import {
  convertToRaw
} from 'draft-js';
import {connect} from "react-redux";
import SvgEditingSerial from '../Svg/SvgEditingSerial.jsx';
import DraftDisplay from '../Draft/DraftDisplay.jsx';
import DraftEditor from '../Draft/DraftEditor.jsx';

const styleMiddle = {
  boxSubmitButton: {
    display: 'inline-block',
    width: '24%',
    height: '97%',
    position: 'relative',
    boxSizing: 'border-box',
    float: 'right',
    margin: '0 2%',
    cursor: 'pointer'
  },
  boxEditor: {
    width: '100%',
    position: 'relative',
    boxSizing: 'border-box',
    padding: '0.5rem 0 1.3rem',
  },
  boxEditingPanel: {
    width: '100%',
    height: '2.1rem',
    position: 'relative',
    boxSizing: 'border-box',
    padding: '0 1rem'
  },
  boxEditingPanelSvg: {
    width: '14%',
    height: '100%',
    position: 'relative',
    float: 'right',
    boxSizing: 'border-box',
    oveflow: 'visible',
    cursor: 'pointer'
  },
  spanInteractions: {
    fontSize: '1.3rem',
    fontWeight: '400',
    letterSpacing: '0.12rem',
    textAlign: 'center',
    color: 'rgb(16, 16, 16)'
  },
  textEditor: {
    fontSize: '1.36rem',
    fontWeight: '300',
    letterSpacing: '0.16rem',
    lineHeight: '1.9rem',
    wordWrap: 'break-word',
    color: '#FAFAFA'
  }
}

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
    this._handleClick_ArticleEdit_cancel = this._handleClick_ArticleEdit_cancel.bind(this);
    this._handleClick_markComponentEditor = this._handleClick_markComponentEditor.bind(this);
    this._handleClick_ArticleEdit_complete = this._handleClick_ArticleEdit_complete.bind(this);
    this.style={
      Com_MarksArticle_Edit_: {
        width: '100%',
        minHeight: '48%',
        position: 'relative',
        boxSizing: 'border-box',
        padding: '1rem 4%'
      },
      Com_MarksArticle_Edit_paragraph: {
        display: 'inline-block',
        width: '100%',
        position: 'relative',
        boxSizing: 'border-box',
        padding: '0.5rem 0',
        borderBottom: 'solid 1px #000000',
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
      editingEditorContent: this.props.marksObj.data[markKey].editorContent
    });
    this.props._set_ArticleEdit({key: markKey, layer: this.props.layer});
  }

  _handleClick_markComponentEditor(event){
    event.stopPropagation();
    event.preventDefault();
    this.contentEditor.current.focus();
  }

  _handleClick_ArticleEdit_cancel(event){
    event.stopPropagation();
    event.preventDefault();
    this.setState({
      markEditing: false,
      editingEditorContent: null
    });
    this.props._set_ArticleEdit(false);
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
          style={this.style.Com_MarksArticle_Edit_paragraph}>
          {
            (this.state.markEditing==key) ?(
              <div>
                <div
                  style={Object.assign({}, styleMiddle.boxEditor, styleMiddle.textEditor)}
                  onClick={this._handleClick_markComponentEditor}>
                  <DraftEditor
                    ref={this.contentEditor}
                    editorState={this.state.editingEditorContent}
                    _on_EditorChange={this._set_EditorUpdate}/>
                </div>
                <div
                  style={Object.assign({}, styleMiddle.boxEditingPanel)}>
                  <div
                    style={Object.assign({}, styleMiddle.boxSubmitButton, {borderRadius: '0.7rem', backgroundColor:'rgb(233, 181, 90)'})}
                    onClick={this._handleClick_ArticleEdit_complete}>
                    <span
                      className={'centerAlignChild'}
                      style={styleMiddle.spanInteractions}>
                      {'save'}
                    </span>
                  </div>
                  <div
                    style={Object.assign({}, styleMiddle.boxSubmitButton)}
                    onClick={this._handleClick_ArticleEdit_cancel}>
                    <span
                      className={'centerAlignChild'}
                      style={Object.assign({}, styleMiddle.spanInteractions, {color: '#ababab'})}>
                      {'cancel'}
                    </span>
                  </div>
                </div>
              </div>
            ):(
              <div>
                <div
                  style={Object.assign({}, styleMiddle.boxEditor, styleMiddle.textEditor)}
                  markkey={key}
                  onClick={this._handleClick_Article_editing}>
                  <DraftDisplay
                    editorState={this.props.marksObj.data[key].editorContent}/>
                </div>
                <div
                  style={styleMiddle.boxEditingPanel}>
                  <div
                    style={styleMiddle.boxEditingPanelSvg}
                    markkey={key}
                    onClick={this._handleClick_Article_openMark}>
                    <SvgEditingSerial
                      serial={index+1} />
                  </div>
                </div>
              </div>
            )
          }
        </div>
      )
    })

    return(
      <div
        style={this.style.Com_MarksArticle_Edit_}>
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
)(MarksArticleEdit));
