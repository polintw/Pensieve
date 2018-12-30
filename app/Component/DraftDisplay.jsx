import React from 'react';
import {Editor, EditorState,convertToRaw, convertFromRaw} from 'draft-js';

export default class DraftDisplay extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      editorState: this.props.editorState?EditorState.createWithContent(convertFromRaw(this.props.editorState)):EditorState.createEmpty(),
    };
    this.changeEditorState = (editorState) => {this.setState({editorState: editorState})};
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

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.Com_DraftDisplay_}>
        <Editor
          ref={(element)=>{this.contentEditor = element;}}
          editorState={this.state.editorState}
          onChange={this.changeEditorState}
          readOnly/>
      </div>
    )
  }
}
