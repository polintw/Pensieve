import React from 'react';
import {
  Editor,
  EditorState,
  convertToRaw,
  convertFromRaw,
  SelectionState
} from 'draft-js';

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

  componentDidMount(){
    let currentContent = this.state.editorState.getCurrentContent();
    let currentLastBlock = currentContent.getLastBlock();
    let currentLastBlockKey= currentLastBlock.getKey();
    let currentLastBlockLength = currentLastBlock.getLength();
    let selectionState = new SelectionState({
      anchorKey: currentLastBlockKey,
      anchorOffset: currentLastBlockLength,
      focusKey: currentLastBlockKey,
      focusOffset: currentLastBlockLength
    });


    this.setState((prevState, props)=>{
      return {editorState: EditorState.forceSelection(prevState.editorState, selectionState)};
    });
  }

  render(){
    return(
      <div
        style={this.style.Com_DraftEditor_}>
        <Editor
          ref={this.props.parentRef?this.props.parentRef:(element)=>{this.contentEditor = element;}}
          editorState={this.state.editorState}
          onChange={this.changeEditorState}
          placeholder={!!this.props.placeholder?this.props.placeholder : ''}/>
      </div>
    )
  }
}

export default React.forwardRef((props, ref) => <DraftEditor parentRef={ref?ref:null} {...props}/>);
