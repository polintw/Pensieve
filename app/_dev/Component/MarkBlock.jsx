import React from 'react';
import {Editor, EditorState,convertToRaw, convertFromRaw} from 'draft-js';

export default class MarkBlock extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      editorState: this.props.editorState?EditorState.createWithContent(convertFromRaw(this.props.editorState)):EditorState.createEmpty(),
    };
    this.changeEditorState = (editorState) => {this.setState({editorState: editorState})};
    this._css_calculate_MarkBlockPosition = this._css_calculate_MarkBlockPosition.bind(this);
    this.style = {
      Com_MarkBlock_content_editor_: {
        display: 'inline-block',
        width: '17vw',
        height: '100%',
        position: 'relative',
        boxSizing: 'border-box',
        margin: '0',
        padding: '2% 3%',
        color: '#FAFAFA',
        overflow: 'auto'
      },
      Com_MarkBlock_side_: {
        display: 'inline-block',
        width: '12vw',
        height: '100%',
        position: 'relative',
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
      Com_MarkBlock_side_thanks_: {
        display: 'inline-block',
        width: '100%',
        height: '90%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box'
      },
      Com_MarkBlock_thank_div_div_helper: {
        width: '100%',
        height: '20%',
        position: 'relative',
        boxSizing: 'border-box',
        padding: '5% 1%'
      },
      Com_MarkBlock_thank_div_div_helper_img: {
        maxWidth: '100%',
        height: '97%',
        position: 'relative'
      },
      Com_MarkBlock_thank_div_p_banner: {
        width: '95%',
        height: '24%',
        position: 'absolute',
        top: '75%',
        left: '5%',
        fontSize: '1.2vw',
        letterSpacing: '0.4vw',
        color: '#FAFAFA'
      }
    };
  }

  _css_calculate_MarkBlockPosition(){
    let [left, top, right] = [null,null,null];
    this.props.coordinate.left>50 ? right = (100-this.props.coordinate.left)+'%' : left = this.props.coordinate.left+'%';
    top = (this.props.coordinate.top) * (30) / (100) + '%';

    return(
      {
        height: '61vh',
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

  render(){
    return(
      <div
        style={this._css_calculate_MarkBlockPosition()}>
        <div
          style={this.style.Com_MarkBlock_content_editor_}>
          <Editor
            ref={(element)=>{this.contentEditor = element;}}
            editorState={this.state.editorState}
            onChange={this.changeEditorState}
            readOnly/>
        </div>
        {
          <div></div>
        }
        <div
          style={this.style.Com_MarkBlock_side_}>
          <div
            style={this.style.Com_MarkBlock_side_panel_}>
            <span>{'編輯紀錄'}</span>
            <span>{'提問'}</span>
            <span>{'啟發'}</span>
          </div>
          <div
            style={this.style.Com_MarkBlock_side_thanks_}>
            <div
              style={this.style.Com_MarkBlock_thank_div_div_helper}>

            </div>
            <div
              style={this.style.Com_MarkBlock_thank_div_div_helper}>

            </div>
          </div>
        </div>
      </div>
    )
  }
}
