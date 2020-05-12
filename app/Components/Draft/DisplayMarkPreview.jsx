import React from 'react';
import {Editor, EditorState, ContentState, convertToRaw, convertFromRaw} from 'draft-js';
import styles from "./styleDisplay.module.css";

const _truncate_previewMark = (editorState, charCount = 259) => {
  /*
    ref: https://github.com/facebook/draft-js/issues/742
    by: JimLiu & irvingv8
  */
  const contentState = editorState.getCurrentContent();
  const blocks = contentState.getBlocksAsArray();

  let index = 0;
  let currentLength = 0;
  let isTruncated = false;
  const truncatedBlocks = [];

  while (!isTruncated && blocks[index]) { //loop if not yet iver the limit & blocks remaining
    const block = blocks[index];
    const length = block.getLength();
    if (currentLength + length > charCount) {
      isTruncated = true;
      const truncatedText = block
      .getText()
      .slice(0, charCount - currentLength);
      const state = ContentState.createFromText(`${truncatedText}...`);
      truncatedBlocks.push(state.getFirstBlock());
    } else {
      truncatedBlocks.push(block);
    }
    currentLength += length + 1;
    index++;
  }

  if (isTruncated) {
    const state = ContentState.createFromBlockArray(truncatedBlocks);
    return EditorState.createWithContent(state);
  }

  return editorState;
};


export default class DisplayMarkPreview extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      editorState: this.props.rawContent ?
        _truncate_previewMark(EditorState.createWithContent(
          convertFromRaw(this.props.rawContent)
        )) : EditorState.createEmpty()
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
