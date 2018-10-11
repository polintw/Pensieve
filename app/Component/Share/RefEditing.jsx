import React from 'React';
import Ref from './Ref.jsx';
import LinkifyIt from 'linkify-it';
import {Editor, EditorState,convertToRaw, convertFromRaw} from 'draft-js';

export default class RefEditing extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      preview: null,
      previewWeb: {"class": "web"},
      axios: false
    };
    this.changeEditorState = (editorState) => this.setState({editorState: editorState});
    this._handle_Paste_linkDetect = this._handle_Paste_linkDetect.bind(this);
    this._handleClick_refEditing_webSave = this._handleClick_refEditing_webSave.bind(this);
    this._handleClick_ref_webInputEditor = this._handleClick_ref_webInputEditor.bind(this);
    this._axios_get_outsideWeb = this._axios_get_outsideWeb.bind(this);
    this.style= {
      web_panel_save: {
        width: '30%',
        height: '90%',
        position: 'absolute',
        top: '5%',
        right: '10%',
        boxSizing: 'border-box',
        backgroundColor: '#9999DD',
        color: 'white',
        cursor: 'pointer'
      }
    }
  }

  _axios_get_outsideWeb(link){
    const self = this;
    axios.get("/get/transfer/web",{
      params: {
        transferUrl: link
      },
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      }
    }).then(function(res){
      if(res.status == 200){
        delete res.data.response;
        Object.assign(self.state.previewWeb, res.data);
        self.setState({
          preview: true,
          previewWeb: self.state.previewWeb,
          axios: false
        })
      }else{
        console.log(res.data);
        self.setState({axios: false})
        alert("status not 200");
      }
    }).catch(function (error) {
      console.log(error);
      self.setState({axios: false});
      alert("err during getting data: "+error);
    });
  }

  _handle_Paste_linkDetect(text, html) {
    const linkIf = LinkifyIt().match(text);
    if(linkIf !== 'undefined' && linkIf !== null){
      let link = text.substring(linkIf[0].index, linkIf[0].lastIndex+1);
      this.state.previewWeb['detectedLink'] = link;
      this.setState({axios: true, previewWeb: this.state.previewWeb});
      this._axios_get_outsideWeb(link);
    }
  }

  _handleClick_ref_webInputEditor(event){
    event.preventDefault();
    event.stopPropagation();
    this.web_inputEditor.focus();
  }

  _handleClick_refEditing_webSave(event){
    event.stopPropagation();
    event.preventDefault();
    let savedRefData = new Object();
    savedRefData = {
      "class": this.state.previewWeb.class,
      "webLink": this.state.previewWeb.detectedLink,
      "title": this.state.previewWeb.title,
      "img": this.state.previewWeb.img
    }
    this.props._set_refArr_new(savedRefData);
    this.setState({
      editorState: EditorState.createEmpty(),
      preview: null,
      previewWeb: {"class": "web"}
    })
  }

  componentDidMount(){
    this.web_inputEditor.focus();
  }

  componentDidUpdate(){
    //Copy and paste from the old "pile" project, perhaps useful in the future
    /*
    const {editorState} = this.props;
    const selectionState = editorState.getSelection();
    const anchorKey = selectionState.getAnchorKey();
    const currentContent = editorState.getCurrentContent();
    const currentContentBlock = currentContent.getBlockForKey(anchorKey);
    const blockText = currentContentBlock.getText();
    const linkIf = LinkifyIt().match(blockText);
    if(linkIf !== 'undefined' && linkIf !== null){
      let link = blockText.substring(linkIf[0].index, linkIf[0].lastIndex+1);
      this.props.set_UrlState(link);
    }*/
  }

  render(){
    return(
      <div
        style={this.props.componentStyleGroup.outline}>
        <div
          style={this.props.componentStyleGroup.web_inputEditor}
          onClick={this._handleClick_ref_webInputEditor}>
          <Editor
            ref={(element)=>{this.web_inputEditor = element;}}
            editorState={this.state.editorState}
            onChange={this.changeEditorState}
            handlePastedText= {(text, html) => {this._handle_Paste_linkDetect(text, html);}}/>
        </div>
        {
          this.state.preview &&
          <div
            style={this.props.componentStyleGroup.web_preview_outline}>
            <Ref
              id={'ref_editing_preview_'}
              componentStyle={this.props.componentStyleGroup.web_preview_body}
              refData={this.state.previewWeb}/>
          </div>
        }
        <div
          style={this.props.componentStyleGroup.web_panel}>
          <div
            style={this.style.web_panel_save}
            onClick={this._handleClick_refEditing_webSave}>
            {"save"}
          </div>
        </div>
      </div>
    )
  }
}
