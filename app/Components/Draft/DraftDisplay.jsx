import React from 'react';
import { EditorState,convertToRaw, convertFromRaw} from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import createLinkifyPlugin from 'draft-js-linkify-plugin';
import styles from "./styleDisplay.module.css";

const linkifyPlugin = createLinkifyPlugin({target: '_blank'});
const plugins = [linkifyPlugin];

export default class DraftDisplay extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      editorState: this.props.editorState?EditorState.createWithContent(convertFromRaw(this.props.editorState)):EditorState.createEmpty()
    };
    this.changeEditorState = (editorState) => {this.setState({editorState: editorState});}; //no use, just for component requirement.
    this._draft_blockClass = this._draft_blockClass.bind(this);
  }

  _draft_blockClass(contentBlock){
    return styles.markDisplayBlock;
  }

  render(){
    //we put the editorState here, because it's 'Display' and readOnly, we won't change any content
    //second, the displaying content should update follow it's parent---like editing.

    return(
      <div>
        <Editor
          ref={(element)=>{this.contentEditor = element;}}
          editorState={this.state.editorState}
          onChange={this.changeEditorState}
          blockStyleFn={this._draft_blockClass}
          plugins={plugins}
          readOnly/>
      </div>
    )
  }
}
