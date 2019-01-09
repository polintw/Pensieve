import React from 'React';
import {
  EditorState,
  convertToRaw,
  convertFromRaw
} from 'draft-js';
import DraftEditor from '../DraftEditor.jsx';
import ModalBox from '../ModalBox.jsx';

export default class MarkEditingBlock extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    }
    this.contentEditor = React.createRef();
    this._set_EditorUpdate = this._set_EditorUpdate.bind(this);
    this._handleClick_blockPanel_complete = this._handleClick_blockPanel_complete.bind(this);
    this._handleClick_blockPanel_delete = this._handleClick_blockPanel_delete.bind(this);
    this._handleClick_markComponentEditor = this._handleClick_markComponentEditor.bind(this);
    this.style={
      Com_MarkEditingBlock_frame_: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)'
      },
      Com_MarkEditingBlock_frame_svg: {
        width: '3vw',
        height: '3vw',
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        overflow: 'visible',
        cursor: 'pointer'
      },
      Com_MarkEditingBlock_Body_: {
        width: '42%',
        minHeight: '44vh',
        maxHeight: '88%',
        position: 'absolute',
        transform: 'translate(0,-50%)',
        boxSizing: 'border-box',
        backgroundColor: 'rgba(25,25,25,0.6)',
        boxShadow: '0 0 4vw rgba(25,25,25,0.6)'
      },
      Com_MarkEditingBlock_Content_Main_div: {
        width: '39%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '30%'
      },
      Com_MarkEditingBlock_Content_Main_div_edit_: {
        width: '90%',
        height: '83%',
        position: 'absolute',
        top: '5%',
        left: '50%',
        transform: 'translate(-50%, 0)',
        boxSizing: 'border-box',
        borderLeft: "1px solid white"
      },
      Com_MarkEditingBlock_Content_Main_div_edit_Editor: {
        width: '100%',
        minHeight: '22vh',
        maxHeight: '60vh',
        position: 'relative',
        boxSizing: 'border-box',
        margin: '0',
        fontSize: '1.2rem',
        letterSpacing: '0.15rem',
        fontWeight: '400',
        color: '#FAFAFA',
        overflow: 'auto',
        cursor: 'text'
      },
      Com_MarkEditingBlock_Content_Main_div_blockPanel_: {
        width: '90%',
        height: '10%',
        position: 'absolute',
        top: '90%',
        left: '50%',
        transform: 'translate(-50%, 0)',
        color: '#FAFAFA'
      },
      Com_MarkEditingBlock_Content_Main_div_blockPanel_span: {
        display: 'inline-block',
        boxSizing: 'border-box',
        margin: '0 0 0 5%',
        float: 'right',
        fontSize: '2.8vh',
        letterSpacing: '0.1vh',
        cursor: 'pointer'
      }
    }
  };

  _handleClick_markComponentEditor(event){
    event.stopPropagation();
    event.preventDefault();
    this.contentEditor.current.focus();
  }

  _handleClick_blockPanel_delete(event){
    event.stopPropagation();
    event.preventDefault();
    this.props._set_markDelete(this.props.markKey);
  }

  _handleClick_blockPanel_complete(event){
    event.stopPropagation();
    event.preventDefault();
    this.props._reset_expandState();
  }

  _set_EditorUpdate(editorState){
    this.props._set_markUpdate_editor(convertToRaw(editorState.getCurrentContent()), this.props.markKey);
  }

  componentDidMount(){
    this.contentEditor.current.focus();
  }

  render(){
    let [left, top, right] = [null,null,null],
    spotLeft = this.props.coordinate.left,
    spotTop = this.props.coordinate.top;
    //then count the desired position of the markblock
    let axisPx = ((spotLeft/100)*this.props.imgSpec.width)-(this.props.imgSpec.width/2);
    spotLeft>50 ? right = (this.props.frameSpec.width/2)-axisPx+15 : left = (this.props.frameSpec.width/2)+axisPx+15;
    top = (22 + (spotTop) * (34) / (100)) + '%';

    return(
      <div>
        <div
          style={Object.assign({width: this.props.imgSpec.width,height: this.props.imgSpec.height}, this.style.Com_MarkEditingBlock_frame_)}
          onClick={(event)=>{event.stopPropagation();event.preventDefault();}}>
          <svg
            style={Object.assign({top: spotTop+"%", left: spotLeft+'%'}, this.style.Com_MarkEditingBlock_frame_svg)}>
            <circle r="20" cx="50%" cy="50%" stroke='white' fill="none"/>
          </svg>
        </div>
        <div
          style={Object.assign({top: top, left: left, right: right},this.style.Com_MarkEditingBlock_Body_)}>
          <div
            style={this.style.Com_MarkEditingBlock_Content_Main_div_edit_Editor}
            onClick={this._handleClick_markComponentEditor}>
            <DraftEditor
              ref={this.contentEditor}
              editorState={this.props.editorState}
              _on_EditorChange={this._set_EditorUpdate}/>
          </div>
          <div
            style={this.style.Com_MarkEditingBlock_Content_Main_div_blockPanel_}>
            <span
              style={this.style.Com_MarkEditingBlock_Content_Main_div_blockPanel_span}
              onClick={this._handleClick_blockPanel_complete}>
              {'Complete'}
            </span>
            <span
              style={this.style.Com_MarkEditingBlock_Content_Main_div_blockPanel_span}
              onClick={this._handleClick_blockPanel_delete}>
              {'Delete'}
            </span>
          </div>
        </div>
      </div>
    )
  }
}
