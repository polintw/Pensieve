import React from 'React';
import ModalBox from '../ModalBox.jsx';
import RefEditing from './RefEditing.jsx';
import {Editor, EditorState,convertToRaw, convertFromRaw} from 'draft-js';

export default class MarkEditingBlock extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      editorState: this.props.editorState?EditorState.createWithContent(convertFromRaw(this.props.editorState)):EditorState.createEmpty(),
      refQuote: false
    }
    this.changeEditorState = (editorState) => {this.setState({editorState: editorState});this.props._set_markUpdate_editor(convertToRaw(editorState.getCurrentContent()), this.props.markNr)};
    this._set_refArr_new = this._set_refArr_new.bind(this);
    this._css_calculate_contentPosition = this._css_calculate_contentPosition.bind(this);
    this._handleClick_blockPanel_complete = this._handleClick_blockPanel_complete.bind(this);
    this._handleClick_blockPanel_delete = this._handleClick_blockPanel_delete.bind(this);
    this._handleClick_markContent_Ref = this._handleClick_markContent_Ref.bind(this);
    this._handleClick_markComponentEditor = this._handleClick_markComponentEditor.bind(this);
    this.style={
      Com_div_MarkEditingBlock: {
        width: this.props.frame.width,
        height: this.props.frame.height,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)'
      },
      component_refEditing: {
        outline: {
          width: "22%",
          height: '45%',
          position: 'absolute',
          top: this.props.coordinate.top-23+"%",
          left: this.props.coordinate.left+28+'%',
          boxSizing: 'border-box',
          backgroundColor: 'rgba(25,25,25,0.6)',
          borderRadius: '2.5vw'
        },
        web_inputEditor: {
          width: '85%',
          height: '20%',
          position: 'absolute',
          top: '15%',
          left: '50%',
          transform: 'translate(-50%, 0)',
          boxSizing: 'border-box',
          padding: '3% 1%',
          borderBottom: "1px solid white",
          color: '#FAFAFA',
          cursor: 'text'
        },
        web_preview_outline: {
          width: '100%',
          height: '50%',
          position: 'absolute',
          top: '35%',
          left: '0',
          boxSizing: 'border-box'
        },
        web_preview_body: {
          width: '90%',
          height: '70%',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          boxSizing: 'border-box',
          border: '1px solid black',
          boxShadow: '0 1px 3px 1px'
        },
        web_panel: {
          width: '100%',
          height: '16%',
          position: 'absolute',
          top: '88%',
          left: '50%',
          transform: 'translate(-50%, 0)',
          boxSizing: 'border-box'
        }
      },
      Com_MarkEditingBlock_Circle_svg: {
        width: '3vw',
        height: '3vw',
        position: 'absolute',
        top: this.props.coordinate.top+"%",
        left: this.props.coordinate.left+'%',
        transform: 'translate(-50%, -50%)',
        overflow: 'visible',
        cursor: 'pointer'
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
        width: "95%",
        height: '90%',
        position: 'absolute',
        top: '0',
        right: '0',
        boxSizing: 'border-box',
        fontSize: '1.2rem',
        letterSpacing: '0.15rem',
        fontWeight: '400',
        color: '#FAFAFA',
        overflow: 'auto',
        cursor: 'text'
      },
      Com_MarkEditingBlock_Content_Main_div_edit_Panel_: {
        width: '90%',
        height: '9%',
        position: 'absolute',
        top: '91%',
        right: '0%',
        color: '#FAFAFA'
      },
      Com_MarkEditingBlock_Content_Main_div_edit_Panel_ref: {
        float: 'right',
        fontSize: '2.8vh',
        cursor: 'pointer'
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

  _handleClick_markContent_Ref(event){
    event.stopPropagation();
    event.preventDefault();
    this.setState({refQuote: true});
  }

  _handleClick_markComponentEditor(event){
    event.stopPropagation();
    event.preventDefault();
    this.markEditor.focus();
  }

  _handleClick_blockPanel_delete(event){
    event.stopPropagation();
    event.preventDefault();
    this.props._set_markDelete();
  }

  _handleClick_blockPanel_complete(event){
    event.stopPropagation();
    event.preventDefault();
    this.props._reset_expandState();
  }

  _set_refArr_new(refObj){
    this.setState({refQuote: false});
    this.props._set_refsArr(refObj);
  }

  _css_calculate_contentPosition(){
    let [left, top, right] = [null,null,null];
    this.props.coordinate.left>50 ? right = (100-this.props.coordinate.left)+'%' : left = this.props.coordinate.left+'%';
    top = (this.props.coordinate.top) * (30) / (100) + '%';

    return(
      {
        width: "36vw",
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

  componentDidMount(){
    this.markEditor.focus();
  }

  render(){
    return(
      <div
        style={this.style.Com_div_MarkEditingBlock}
        onClick={(event)=>{event.stopPropagation();event.preventDefault();}}>
        <div
          style={this._css_calculate_contentPosition()}>
          <div
            style={this.style.Com_MarkEditingBlock_Content_Main_div}>
            <div
              style={this.style.Com_MarkEditingBlock_Content_Main_div_edit_}>
              <div
                style={this.style.Com_MarkEditingBlock_Content_Main_div_edit_Editor}
                onClick={this._handleClick_markComponentEditor}>
                <Editor
                  ref={(element)=>{this.markEditor = element;}}
                  editorState={this.state.editorState}
                  onChange={this.changeEditorState}/>
              </div>
              <div
                style={this.style.Com_MarkEditingBlock_Content_Main_div_edit_Panel_}>
                <div
                  style={this.style.Com_MarkEditingBlock_Content_Main_div_edit_Panel_ref}
                  onClick={this._handleClick_markContent_Ref}>
                  {"[ ]"}
                </div>
              </div>
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
          {
            this.state.refQuote &&
            <ModalBox containerId={"mark_"+this.props.markNr}>
              <RefEditing
                componentStyleGroup={this.style.component_refEditing}
                _set_refArr_new={this._set_refArr_new}/>
            </ModalBox>
          }
        </div>
        <svg
          style={this.style.Com_MarkEditingBlock_Circle_svg}>
          <circle r="20" cx="50%" cy="50%" stroke='white' fill="none"/>
        </svg>
      </div>
    )
  }
}
