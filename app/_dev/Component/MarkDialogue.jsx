import React from 'react';
import {Editor, EditorState,convertToRaw, convertFromRaw} from 'draft-js';

export default class MarkDialogue extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
    };
    this.changeEditorState = (editorState) => {this.setState({editorState: editorState})};
    this._handleClick_sendDialogue = this._handleClick_sendDialogue.bind(this);
    this.style = {
        Com_MarkDialogue_: {
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: '0',
            left: '0',
            boxSizing: 'border-box'
        },
        Com_MarkDialogue_new_: {

        }
    };
  }

  _handleClick_sendDialogue(event){
    event.preventDefault();
    event.stopPropagation();

  }

  componentDidMount(){
      this.dialogueEditor.focus();
  }

  render(){
    const self = this;
    let path = this.props.dialogueArr.map(function(rawContent, index){
        
    })
    return(
      <div
        style={this.style.Com_MarkDialogue_}>
        <div>
            {path}
        </div>
        <div
          style={this.style.Com_MarkDialogue_new_}>
          <div>
            <Editor
                ref={(element)=>{this.dialogueEditor = element;}}
                editorState={this.state.editorState}
                onChange={this.changeEditorState}/>
          </div>
          <span
            onClick={this._handleClick_sendDialogue}>{"send"}</span>
        </div>
      </div>
    )
  }
}
