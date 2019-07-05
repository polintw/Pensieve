import React from 'react';
import {Editor, EditorState, ContentState, convertToRaw, convertFromRaw} from 'draft-js';
import styles from "./styleDisplay.module.css";

export default class DisplayMarkPreview extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      editorState: this.props.rawContent ?
        EditorState.createWithContent(
          convertFromRaw(this.props.rawContent)
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
    return styles.markDisplayBlock;
  }

  render(){
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
