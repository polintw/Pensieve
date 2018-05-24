import React from 'React';
import ModalBox from './ModalBox.jsx';
import RefEditing from './RefEditing.jsx';
import {Editor, EditorState,convertToRaw, convertFromRaw} from 'draft-js';

export default class MarkEditingBlock extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      editorState: this.props.editorState?EditorState.createWithContent(convertFromRaw(this.props.editorState)):EditorState.createEmpty(),
      refQuote: false
    }
    this.changeEditorState = (editorState) => {this.setState({editorState: editorState});this._set_markUpdate(convertToRaw(editorState.getCurrentContent()), this.props.index)};
    this._set_refArr_new = this._set_refArr_new.bind(this);
    this._handleClick_markContent_Ref = this._handleClick_markContent_Ref.bind(this);
    this._handleClick_MarkComponentEditor = this._handleClick_MarkComponentEditor.bind(this);
    this.style={
      div_Com_MarkEditingBlock: {
        overflow: 'visible'
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
      svg_Com_MarkEditingBlock_MarkCircle: {
        width: '40px',
        height: '40px',
        position: 'absolute',
        top: this.props.coordinate.top+"%",
        left: this.props.coordinate.left+'%',
        transform: 'translate(-50%, -50%)',
        overflow: 'visible',
        cursor: 'pointer'
      },
      div_Com_MarkEditingBlock_MarkContent: {
        width: "22%",
        height: '45%',
        position: 'absolute',
        top: this.props.coordinate.top-23+"%",
        left: this.props.coordinate.left+5+'%',
        boxSizing: 'border-box',
        backgroundColor: 'rgba(25,25,25,0.6)',
        borderRadius: '2.5vw'
      },
      div_markContent_Editor: {
        width: '90%',
        height: '70%',
        position: 'absolute',
        top: '5%',
        left: '50%',
        transform: 'translate(-50%, 0)',
        boxSizing: 'border-box',
        borderBottom: "1px solid white",
        color: '#FAFAFA',
        overflow: 'auto',
        cursor: 'text'
      },
      div_markContent_Panel: {
        width: '90%',
        height: '20%',
        position: 'absolute',
        top: '75%',
        left: '50%',
        transform: 'translate(-50%, 0)'
      },
      div_markContent_PanelSave: {
        width: '30%',
        height: '90%',
        position: 'absolute',
        bottom: '5%',
        left: '65%',
        boxSizing: 'border-box',
        border: '1px solid #FAFAFA',
        color: '#FAFAFA',
        cursor: 'pointer'
      },
      div_markContent_PanelRef: {
        width: '20%',
        height: '90%',
        position: 'absolute',
        bottom: '5%',
        left: '40%',
        fontSize: '1vw',
        color: '#FAFAFA',
        cursor: 'pointer'
      }
    }
  };

  _handleClick_markContent_Ref(event){
    event.stopPropagation();
    event.preventDefault();
    this.setState({refQuote: true});
  }

  _handleClick_MarkComponentEditor(event){
    event.stopPropagation();
    event.preventDefault();
    this.contentEditor.focus();
  }

  _set_refArr_new(refObj){
    this.setState({refQuote: false});
    this.props._set_refsArr(refObj);
  }

  render(){
    return(
      <div
        style={this.style.div_Com_MarkEditingBlock}
        onClick={(event)=>{event.stopPropagation();event.preventDefault();}}>
        <svg
          style={this.style.svg_Com_MarkEditingBlock_MarkCircle}>
          <circle r="20" cx="50%" cy="50%" stroke='white' fill="none"/>
        </svg>
        <div
          style={this.style.div_Com_MarkEditingBlock_MarkContent}>
          <div>
            <div
              style={this.style.div_markContent_Editor}
              onClick={this._handleClick_MarkComponentEditor}>
              <Editor
                ref={(element)=>{this.contentEditor = element;}}
                editorState={this.state.editorState}
                onChange={this.changeEditorState}/>
            </div>
            <div
              style={this.style.div_markContent_Panel}>
              <div
                style={this.style.div_markContent_PanelRef}
                onClick={this._handleClick_markContent_Ref}>
                {"[]"}
                {
                  this.state.refQuote &&
                  <ModalBox containerId={"mark_"+this.props.index}>
                    <RefEditing
                      componentStyleGroup={this.style.component_refEditing}
                      _set_refArr_new={this._set_refArr_new}/>
                  </ModalBox>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
