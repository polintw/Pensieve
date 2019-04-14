import React from 'react';
import {Editor, EditorState,convertToRaw, convertFromRaw} from 'draft-js';

class DraftEditor extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      editorState: this.props.editorState?EditorState.createWithContent(convertFromRaw(this.props.editorState)):EditorState.createEmpty(),
    };
    this.changeEditorState = this.changeEditorState.bind(this);
    this.style={
      Com_DraftDisplay_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box'
      }
    }
  }

  changeEditorState(editorState){
    this.setState({editorState: editorState});
    this.props._on_EditorChange(editorState);
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.Com_DraftEditor_}>
        <Editor
          ref={this.props.parentRef?this.props.parentRef:(element)=>{this.contentEditor = element;}}
          editorState={this.state.editorState}
          onChange={this.changeEditorState}/>
      </div>
    )
  }
}

export default React.forwardRef((props, ref) => <DraftEditor parentRef={ref?ref:null} {...props}/>);
