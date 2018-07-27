import React from 'react';
import MarkDialogue from './MarkDialogue.jsx';
import {Editor, EditorState,convertToRaw, convertFromRaw} from 'draft-js';

export default class MarkBlock extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      editorState: this.props.editorState?EditorState.createWithContent(convertFromRaw(this.props.editorState)):EditorState.createEmpty(),
      dialogue: false
    };
    this.changeEditorState = (editorState) => {this.setState({editorState: editorState})};
    this._css_calculate_MarkBlockPosition = this._css_calculate_MarkBlockPosition.bind(this);
    this._handleClick_openDialogue = this._handleClick_openDialogue.bind(this),
    this.style = {
      Com_MarkBlock_content_editor_: {
        display: 'inline-block',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        margin: '0',
        padding: '2% 3%',
        color: '#FAFAFA',
        overflow: 'auto'
      },
      Com_MarkBlock_dialogue_: {
        display: 'inline-block',
        width: '26.5%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '47%',
        boxSizing: 'border-box',
        padding: '2% 3%',
        color: '#FAFAFA',
      },
      Com_MarkBlock_side_: {
        display: 'inline-block',
        height: '100%',
        position: 'absolute',
        top: '0',
        right: '0',
        boxSizing: 'border-box'
      },
      Com_MarkBlock_side_panel_: {
        width: '100%',
        height: '10%',
        position: 'absolute',
        bottom: '0',
        left: '0',
        boxSizing: 'border-box',
        color: '#FAFAFA'
      },
      Com_MarkBlock_side_panel_span_dialogue:{
        cursor: 'pointer'
      },
      Com_MarkBlock_side_thanks_: {
        display: 'inline-block',
        width: '94%',
        height: '86%',
        position: 'absolute',
        top: '2%',
        left: '3%',
        boxSizing: 'border-box'
      },
      Com_MarkBlock_side_thanks_helper_: {
        width: '100%',
        height: '20%',
        position: 'relative',
        boxSizing: 'border-box',
        padding: '5% 1%'
      }
    };
  }

  _handleClick_openDialogue(event){
    event.preventDefault();
    event.stopPropagation();
    this.setState((prevState, props)=>{return this.state.dialogue?{dialogue: false}: {dialogue: true}})
  }

  _css_calculate_MarkBlockPosition(){
    let [left, top, right] = [null,null,null];
    this.props.coordinate.left>50 ? right = (100-this.props.coordinate.left)+'%' : left = this.props.coordinate.left+'%';
    top = (this.props.coordinate.top) * (30) / (100) + '%';

    return(
      {
        width: this.state.dialogue?'36vw':'27vw',
        height: '50vh',
        position: 'absolute',
        top: top,
        left: left,
        right: right,
        boxSizing: 'border-box',
        backgroundColor: 'rgba(25,25,25,0.6)',
        boxShadow: '0 0 4vw rgba(25,25,25,0.6)'
      }
    )
  }

  componentDidMount(){/*
    axios.get('/unit/single/dialogue?unitName='+self.state.unitName+'&id=Berlin&markId='+, {
      headers: {'charset': 'utf-8'}
    }).then(function(res){
      self.props.setState({
        dialogueArr:
      })
    })*/
  }

  render(){
    return(
      <div
        style={this._css_calculate_MarkBlockPosition()}>
        <div
          style={
            this.state.dialogue?Object.assign({width: '47%'}, this.style.Com_MarkBlock_content_editor_):
            Object.assign({width: '63%'}, this.style.Com_MarkBlock_content_editor_)}>
          <Editor
            ref={(element)=>{this.contentEditor = element;}}
            editorState={this.state.editorState}
            onChange={this.changeEditorState}
            readOnly/>
        </div>
        {
          this.state.dialogue &&
          <div
            style={this.style.Com_MarkBlock_dialogue_}>
            <MarkDialogue
              dialogueArr={[]}/>
          </div>
        }
        <div
          style={
            this.state.dialogue?Object.assign({width: '26.5%'}, this.style.Com_MarkBlock_side_):
            Object.assign({width: '37%'}, this.style.Com_MarkBlock_side_)}>
          <div
            style={this.style.Com_MarkBlock_side_panel_}>
            <span>{'編輯紀錄'}</span>
            <span
              style={this.style.Com_MarkBlock_side_panel_span_dialogue}
              onClick={this._handleClick_openDialogue}>{'提問'}</span>
            <span>{'啟發'}</span>
          </div>
          <div
            style={this.style.Com_MarkBlock_side_thanks_}>
            <div
              style={this.style.Com_MarkBlock_side_thanks_helper_}>

            </div>
            <div
              style={this.style.Com_MarkBlock_side_thanks_helper_}>

            </div>
          </div>
        </div>
      </div>
    )
  }
}
