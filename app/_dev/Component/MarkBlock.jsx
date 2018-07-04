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
      Com_MarkBlock_thank_div: {
        width: '31%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0'
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
      },
      Com_MarkBlock_Main_div: {
        width: '36%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '30%'
      },
      Com_MarkBlock_Main_div_editor_div: {
        width: '90%',
        height: '70%',
        position: 'absolute',
        top: '5%',
        left: '50%',
        transform: 'translate(-50%, 0)',
        boxSizing: 'border-box',
        borderBottom: "1px solid white",
        color: '#FAFAFA',
        overflow: 'auto'
      },
      Com_MarkBlock_Main_div_panel: {
        width: '90%',
        height: '25%',
        position: 'absolute',
        bottom: '0%',
        left: '50%',
        transform: 'translate(-50%, 0)',
        boxSizing: 'border-box',
        color: '#FAFAFA'
      }
    };
  }

  _css_calculate_MarkBlockPosition(){
    let [left, top, bottom, right] = [0,0,0,0];
    this.props.coordinate.left>50 ? right = (100-this.props.coordinate.left) : left = this.props.coordinate.left;
    this.props.coordinate.top>50 ? bottom = (100-this.props.coordinate.top-5) : top = this.props.coordinate.top;

    return(
      {
        width: "36vw",
        height: '64vh',
        position: 'absolute',
        top: top+"%",
        bottom: bottom+'%',
        left: left+'%',
        right: right+'%',
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
          style={this.style.Com_MarkBlock_thank_div}>
          <div
            style={this.style.Com_MarkBlock_thank_div_div_helper}>
            <img
              style={this.style.Com_MarkBlock_thank_div_div_helper_img}
              src={"/大頭貼.png"}/>
            <p style={{display: 'inline-block', color: '#FAFAFA'}}>{'元元張'}</p>
          </div>
          <div
            style={this.style.Com_MarkBlock_thank_div_div_helper}>
            <img
              style={this.style.Com_MarkBlock_thank_div_div_helper_img}
              src={"/大頭貼.png"}/>
            <p style={{display: 'inline-block', color: '#FAFAFA'}}>{'方方土'}</p>
          </div>
          <p style={this.style.Com_MarkBlock_thank_div_p_banner}>{'感謝襄助'}</p>
        </div>
        <div
          style={this.style.Com_MarkBlock_Main_div}>
          <div
            style={this.style.Com_MarkBlock_Main_div_editor_div}>
            <Editor
              ref={(element)=>{this.contentEditor = element;}}
              editorState={this.state.editorState}
              onChange={this.changeEditorState}
              readOnly/>
          </div>
          <div
            style={this.style.Com_MarkBlock_Main_div_panel}>
            <span>{'編輯紀錄'}</span>
            <span>{'提問'}</span>
            <span>{'啟發'}</span>
          </div>
        </div>
      </div>
    )
  }
}
