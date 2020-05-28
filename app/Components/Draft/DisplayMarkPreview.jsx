import React from 'react';
import {Editor, EditorState, ContentState, convertToRaw, convertFromRaw} from 'draft-js';
import styles from "./styleDisplay.module.css";

const _truncate_previewMark = (editorState, tbc, charCount = 259) => {
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

  while (!isTruncated && blocks[index]) { //loop if not yet over the limit & blocks remaining
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
  else if(!isTruncated && tbc){ // mainly for mobile device, which means no `...` at the end due to not truncated
    const lastText = truncatedBlocks[truncatedBlocks.length-1] //take the last one in blocks
    .getText()
    .slice();
    const appendState = ContentState.createFromText(`${lastText}...`);
    truncatedBlocks.splice(truncatedBlocks.length-1, 1, appendState.getFirstBlock());
    const state = ContentState.createFromBlockArray(truncatedBlocks);
    return EditorState.createWithContent(state);
  }

  return editorState; //only 1 mark & without truncate
};


export default class DisplayMarkPreview extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      editorState: this.props.rawContent ?
        _truncate_previewMark(EditorState.createWithContent(
          convertFromRaw(this.props.rawContent)
        ), !!this.props.multipleMark) : EditorState.createEmpty()
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

  componentDidUpdate(prevProps, prevState, snapshot){
    if(this.props.markId != prevProps.markId){ // detect the mark going to display
      this.setState({
        editorState: this.props.rawContent ?
          _truncate_previewMark(EditorState.createWithContent(
            convertFromRaw(this.props.rawContent)
          ), !!this.props.multipleMark) : EditorState.createEmpty()
      });
    };
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

  _draft_blockClass(contentBlock){
    return styles.markDisplayBlock;
  }

}
