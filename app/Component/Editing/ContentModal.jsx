import React from 'React';
import MarkEditingBlock from './MarkEditingBlock.jsx';
import MarksSpotList from './MarksSpotList.jsx';
import ModalBox from '../ModalBox.jsx';

export default class ContentModal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      imgWidth: "",
      imgHeight: "",
      marksList: [],
      markCircles: {},
      markEditorContent: {},
      markExpand: null,
      markExpandify: false
    };
    this.Com_ContentModal_ImgSection_div_img = React.createRef();
    this._reset_expandState = ()=>{this.setState({markExpand: null, markExpandify: false});};
    this._set_markExpand = this._set_markExpand.bind(this);
    this._set_markNewSpot = this._set_markNewSpot.bind(this);
    this._set_markDelete = this._set_markDelete.bind(this);
    this._set_markUpdate_editor = this._set_markUpdate_editor.bind(this);
    this._handleLoaded_img_ContentModal = this._handleLoaded_img_ContentModal.bind(this);
    this._handleClick_editingComplete = this._handleClick_editingComplete.bind(this);
    this._handleClick_editingCancell =this._handleClick_editingCancell.bind(this);
    this.style={
      Com_Modal_ContentModal: {
        width: "100%",
        height: "100%",
        position: "fixed",
        top: "0%",
        left: '0'
      },
      Com_Modal_ContentModal_Mark: {
        width: '86%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '50%',
        transform: 'translate(-50%, 0)',
        boxSizing: 'border-box',
        backgroundColor: '#313130',
        boxShadow: '0px 1.2vh 2.4vw 0vw'
      },
      Com_ContentModal_ImgSection_div: {
        width: '85%',
        height: '91%',
        position: 'absolute',
        top: '1%',
        left: '0%',
        boxSizing: 'border-box'
      },
      Com_ContentModal_ImgSection_div_img: {
        maxWidth: '100%',
        maxHeight: '100%',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
      },
      Com_ContentModal_ListSection_div: {
        width: '14%',
        height: '91%',
        position: 'absolute',
        top: '0',
        right: '0',
        boxSizing: 'border-box',
        borderLeft: 'solid 2px #FAFAFA'
      },
      Com_ContentModal_ControlSection_div: {
        width: '100%',
        height: '8%',
        position: 'absolute',
        bottom: '0',
        left: '0'
      },
      Com_ContentModal_ControlSection_div_Cancel: {
        width: '10%',
        height: '72%',
        position: 'absolute',
        top: '50%',
        right: '2%',
        transform: 'translate(0, -50%)',
        boxSizing: 'border-box',
        border: '0.1vw solid #FAFAFA',
        borderRadius: '10px',
        fontSize: '3.2vh',
        textAlign: 'center',
        color: '#FAFAFA',
        cursor: 'pointer'
      },
      Com_ContentModal_ControlSection_div_Complete: {
        width: '10%',
        height: '72%',
        position: 'absolute',
        top: '50%',
        right: '15%',
        transform: 'translate(0, -50%)',
        boxSizing: 'border-box',
        border: '0.1vw solid #FAFAFA',
        borderRadius: '10px',
        fontSize: '3.2vh',
        textAlign: 'center',
        color: '#FAFAFA',
        cursor: 'pointer'
      }
    }
  }

  _set_markExpand(markKey){
    if(markKey !== this.state.markExpand){
      this.setState((prevState, props) => {return {markExpandify: false}}, ()=>{this.setState({markExpand: markKey, markExpandify: true});})
    }else if(markKey == this.state.markExpand){
      this._reset_expandState();
    }
  }

  _set_markNewSpot(portionCoordinate){
    this.setState((prevState, props)=>{
      const currentNr = this.props.layer+"_"+prevState.marksList.length; //keep it "const" to assure the var would not change after push()
      prevState.markCircles[currentNr] = portionCoordinate;
      prevState.markEditorContent[currentNr] = null;
      return {marksList: prevState.marksList.push(currentNr), markCircles: prevState.markCircles, markEditorContent: prevState.markEditorContent, markExpand: (currentNr), markExpandify: true}
    });
  }

  _set_markDelete(key){
    delete this.state.markCircles[key];
    delete this.state.markEditorContent[key];
    let indexTar = this.state.marksList.indexOf(key);
    this.state.marksList.splice(indexTar, 1);
    this._reset_expandState();
  }

  _set_markUpdate_editor(contentRaw, key){
    this.state.markEditorContent[key]=contentRaw;
  }

  _handleClick_editingComplete(event){
    event.stopPropagation();
    event.preventDefault();
    let marksData = {list:[], data:{}};
    this.state.marksList.forEach((markKey, index)=>{
      let jsonContentState = JSON.stringify(this.state.markEditorContent[markKey]);
      marksData["data"][markKey] = {
        top: this.state.markCircles[markKey].top,
        left: this.state.markCircles[markKey].left,
        editorContent: jsonContentState,
        layer: this.props.layer,
        serial: index
      };
      marksData["list"].push(markKey)
    })
    this.props._close_Mark_Complete(marksData, this.props.layer);
  }

  _handleClick_editingCancell(event){
    event.stopPropagation();
    event.preventDefault();
    this.props._close_img_Cancell();
  }

  _handleLoaded_img_ContentModal(event){
    this.setState({
      imgWidth: this.Com_ContentModal_ImgSection_div_img.current.clientWidth,
      imgHeight: this.Com_ContentModal_ImgSection_div_img.current.clientHeight
    });
  }

  componentDidMount(){
    const self = this;
    let circles = {},
        editorContent = {};
    this.props.marks.list.forEach(function(key, index){
      circles[key] = {top: self.props.marks.data[key].top, left: self.props.marks.data[key].left}
      editorContent[key] = self.props.marks.data[key].editorContent
    });
    this.setState((prevState, props)=>{
      return {
        marksList: props.marks.list,
        markCircles: circles,
        markEditorContent: editorContent
      };
    })
  }

  render(){
    return(
      <ModalBox containerId="root">
        <div
          style={this.style.Com_Modal_ContentModal}>
          <div
            style={this.style.Com_Modal_ContentModal_Mark}>
            <div
              style={this.style.Com_ContentModal_ImgSection_div}>
              <img
                style={this.style.Com_ContentModal_ImgSection_div_img}
                ref={this.Com_ContentModal_ImgSection_div_img}
                src={this.props.imgSrc}
                onLoad={this._handleLoaded_img_ContentModal}/>
              <MarksSpotList
                marksList={this.state.marksList}
                markCircles={this.state.markCircles}
                markExpand={this.state.markExpand}
                frame={{width: this.state.imgWidth, height: this.state.imgHeight}}
                _set_markExpand={this._set_markExpand}
                _set_markNewSpot={this._set_markNewSpot}/>
              {
                this.state.markExpandify &&
                <MarkEditingBlock
                  markKey = {this.state.markExpand}
                  coordinate={this.state.markCircles[this.state.markExpand]}
                  editorState={this.state.markEditorContent[this.state.markExpand]}
                  frame={{width: this.state.imgWidth, height: this.state.imgHeight}}
                  _set_refsArr={this.props._set_refsArr}
                  _set_markUpdate_editor={this._set_markUpdate_editor}
                  _set_markDelete={this._set_markDelete}
                  _reset_expandState={this._reset_expandState}/>
              }
            </div>
            <div
              style={this.style.Com_ContentModal_ControlSection_div}>
              {
                this.props.creating &&
                <div
                  style={this.style.Com_ContentModal_ControlSection_div_Cancel}
                  onClick={this._handleClick_editingCancell}>
                  {'刪除'}
                </div>
              }
              <div
                style={this.style.Com_ContentModal_ControlSection_div_Complete}
                onClick={this._handleClick_editingComplete}>
                {"完成"}
              </div>
            </div>
          </div>
        </div>
      </ModalBox>
    )
  }
}
