import React from 'react';
import MarkDialogue from './MarkDialogue.jsx';
import SvgBulb from './SvgBulb.jsx';
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
      Com_MarkBlock_content_: {
        display: 'inline-block',
        width: '21vw',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        margin: '0'
      },
      Com_MarkBlock_content_editor_: {
        width: '100%',
        height: '90%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        margin: '0',
        padding: '2% 2% 2% 3%',
        fontSize: '1.2rem',
        letterSpacing: '0.15rem',
        fontWeight: '400',
        color: '#FAFAFA',
        overflow: 'auto'
      },
      Com_MarkBlock_content_panel_: {
        width: '100%',
        height: '10%',
        position: 'absolute',
        bottom: '0',
        left: '0',
        boxSizing: 'border-box',
        color: '#FAFAFA'
      },
      Com_MarkBlock_content_panel_raise:{
        width: '35%',
        height: '100%',
        float: 'right',
        cursor: 'pointer'
      },
      Com_MarkBlock_dialogue_: {
        display: 'inline-block',
        width: '13vw',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '21vw',
        boxSizing: 'border-box',
        padding: '2% 3%',
        borderLeft: 'solid 1px white',
        color: '#FAFAFA',
      },
      Com_MarkBlock_side_: {
        display: 'inline-block',
        height: '100%',
        position: 'absolute',
        top: '0',
        right: '0',
        boxSizing: 'border-box',
        backgroundColor: 'white'
      },
      Com_MarkBlock_side_thanks_: {
        display: 'inline-block',
        width: '100%',
        height: '90%',
        position: 'absolute',
        top: '0%',
        left: '0%',
        boxSizing: 'border-box'
      },
      Com_MarkBlock_side_bottom_bulb: {
        width: '30%',
        height: '10%',
        position: 'absolute',
        bottom: '0',
        right: '2%'
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
        width: this.state.dialogue?'36vw':'34vw',
        height: '52vh',
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

  componentDidMount(){

  }

  render(){
    return(
      <div
        style={this._css_calculate_MarkBlockPosition()}>
        <div
          style={this.style.Com_MarkBlock_content_}>
          <div
            style={this.style.Com_MarkBlock_content_editor_}>
            <Editor
              ref={(element)=>{this.contentEditor = element;}}
              editorState={this.state.editorState}
              onChange={this.changeEditorState}
            readOnly/>
          </div>
          <div
            style={this.style.Com_MarkBlock_content_panel_}>
            <span>{'編輯紀錄'}</span>
            <span
              style={this.style.Com_MarkBlock_content_panel_raise}
              onClick={this._handleClick_openDialogue}>{'舉手'}</span>
          </div>
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
            this.state.dialogue?Object.assign({width: '2vw'}, this.style.Com_MarkBlock_side_):
            Object.assign({width: '12vw'}, this.style.Com_MarkBlock_side_)}>
          <div
            style={this.style.Com_MarkBlock_side_thanks_}>

          </div>
          <div
            style={this.style.Com_MarkBlock_side_bottom_bulb}>
            <SvgBulb/>
          </div>
        </div>
      </div>
    )
  }
}
