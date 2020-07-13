import React from 'react';
// It is important to import the Editor which accepts plugins.
import Editor, { createEditorStateWithText } from 'draft-js-plugins-editor';
import createToolbarPlugin from 'draft-js-static-toolbar-plugin';
import {
  //Editor,
  EditorState,
  convertToRaw,
  convertFromRaw,
  SelectionState
} from 'draft-js';

const charactersLimit = 4000;
const charactersRemindThreshold = 150;
// Creates an Instance for Editor plugins. At this step, a configuration object can be passed in
// as an argument.
const staticToolbarPlugin = createToolbarPlugin();
const { Toolbar } = staticToolbarPlugin;
const plugins = [staticToolbarPlugin];

class DraftEditor extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      editorState: this.props.editorState?EditorState.createWithContent(convertFromRaw(this.props.editorState)):EditorState.createEmpty(),
    };
    this.contentEditor = React.createRef();
    this.changeEditorState = this.changeEditorState.bind(this);
    this._count_CharactersRemain = this._count_CharactersRemain.bind(this);
    this._handleBeforeInput = this._handleBeforeInput.bind(this);
    this._handlePastedText = this._handlePastedText.bind(this);
  }

  changeEditorState(editorState){
    this.setState((prevState, props)=>{
      return { editorState: editorState};
    }, ()=>{
      let remaining = this._count_CharactersRemain();

      if(remaining < charactersRemindThreshold){
        this.props._handleMessage(remaining+" characters to go.")
      }
      else this.props._handleMessage(null);
    });

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
      <div>
        <Editor
          ref={this.props.parentRef ? this.props.parentRef : this.contentEditor}
          editorState={this.state.editorState}
          handleBeforeInput={this._handleBeforeInput}
          handlePastedText={this._handlePastedText}
          onChange={this.changeEditorState}
          plugins={plugins}
          placeholder={!!this.props.placeholder?this.props.placeholder : ''}/>
        <Toolbar />
      </div>
    )
  }

  _count_CharactersRemain(){
    const currentContent = this.state.editorState.getCurrentContent();
    const currentContentLength = currentContent.getPlainText('').length;
    const currentBlocksMap = currentContent.getBlockMap();
    const currentBlocksCount = currentBlocksMap.count(); //"iterable.length has been deprecated, use iterable.size or iterable.count()." by react developer
    let charactersRemain = charactersLimit - ((11 * currentBlocksCount) + currentContentLength);

    if(currentBlocksCount >= 22 ||  charactersRemain < 0){ return 0;}
    else return charactersRemain;
  }

  _handleBeforeInput () {
    let remaining = this._count_CharactersRemain();

    if (!remaining) {
      this.props._handleMessage("The characters or lines of content have been over the limit.")
      return 'handled'; //Returning 'handled' causes the default behavior of the beforeInput event to be prevented
    }
  }

  _handlePastedText (pastedText, html, editorState) {
    let remaining = this._count_CharactersRemain();
    remaining -= pastedText.length;

    if (!remaining || remaining < 0) {
      this.props._handleMessage("The characters or lines of content have been over the limit.")
      return 'handled'; //Returning 'handled' causes the default behavior of the beforeInput event to be prevented
    }
  }

}

export default React.forwardRef((props, ref) => <DraftEditor parentRef={ref?ref:null} {...props}/>);
