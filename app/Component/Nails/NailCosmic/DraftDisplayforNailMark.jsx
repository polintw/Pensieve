import React from 'react';
import {Editor, EditorState, ContentState, convertToRaw, convertFromRaw} from 'draft-js';
import styles from "./style_nailcosmic.module.css";

export default class DraftDisplayforNailMark extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      editorState: this.props.editorState ?
        EditorState.createWithContent(
          ContentState.createFromBlockArray([convertFromRaw(this.props.rawContent).getFirstBlock()])
        ):EditorState.createEmpty()
    };
    this.changeEditorState = (editorState) => {this.setState({editorState: editorState})};
    this._draft_blockClass = this._draft_blockClass.bind(this);
    this.style={
      Com_DraftDisplay_: {
        width: '100%',
        height: '100%',
        position: 'relative',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }
    }
  }

  _draft_blockClass(contentBlock){
    return styles.markDraftDisplayEditor;
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.Com_DraftDisplay_}>
        <Editor
          ref={(element)=>{this.contentEditor = element;}}
          editorState={this.state.editorState}
          onChange={this.changeEditorState}
          blockStyleFn={this._draft_blockClass}
          readOnly/>
      </div>
    )
  }
}
