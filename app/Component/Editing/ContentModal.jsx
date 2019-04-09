import React from 'react';
import ImgLayerEditing from './ImgLayerEditing.jsx';
import ModalBox from '../ModalBox.jsx';

const generalStyle={
  submitInvalid: { //use a box to cover the valid submit button
    backgroundColor: '#e6e6e6',
    color: '#e6e6e6',
    cursor: 'auto',
    opacity: '0.6'
  }
}

const styleMiddle = {
  imgDecoBackContent:{
    width: '4%',
    height: '78%',
    position: 'absolute',
    left: '10%',
    top: '0',
    boxSizing: 'border-box',
    backgroundColor: '#FAFAFA'
  },
  boxSubmitButton:{
    width: '68%',
    height: '31%',
    position: 'absolute',
    boxSizing: 'border-box',
  },
  boxSubmitInvalid: {
    width: '100%',
    height: '100%',
    boxSizing: 'border-box'
  },
  roundRecBox: {
    borderRadius: '2.4vh',
    backgroundColor: "#e6e6e6",
    cursor: 'pointer'
  },
  spanDestiny: {
    width: '100%',
    fontSize: '1.3rem',
    fontWeight: '400',
    letterSpacing: '0.1rem',
    textAlign: 'center',
    color: 'rgb(16, 16, 16)'
  }
}

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
    this._reset_expandState = ()=>{this.setState({markExpand: null, markExpandify: false});};
    this._set_markExpand = this._set_markExpand.bind(this);
    this._set_markNewSpot = this._set_markNewSpot.bind(this);
    this._set_markDelete = this._set_markDelete.bind(this);
    this._set_markUpdate_editor = this._set_markUpdate_editor.bind(this);
    this._handleClick_editingComplete = this._handleClick_editingComplete.bind(this);
    this._handleClick_editingCancell =this._handleClick_editingCancell.bind(this);
    this.style={
      Com_Modal_ContentModal: {
        width: "100%",
        height: "100%",
        position: "fixed",
        top: "0%",
        left: '0',
        backgroundColor: '#101010',
      },
      Com_Modal_ContentModal_Mark: { //keep it & _imglayer is convenient for making img following the format of UnitImg
        width: '100%',
        height: '96%',
        position: 'absolute',
        top: '0',
        right: '0%',
        boxSizing: 'border-box',
      },
      Com_Modal_ContentModal_Mark_imglayer: {
        width: '86%',
        height: '99%',
        position: 'absolute',
        top: '1%',
        right: '0%',
        boxSizing: 'border-box'
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
        width: '14%',
        height: '15%',
        position: 'absolute',
        bottom: '5%',
        left: '0',
        boxSizing: 'border-box'
      },
      Com_ContentModal_ControlSection_div_Cancel: {
        bottom: '52%',
        right: '2%',
      },
      Com_ContentModal_ControlSection_div_Complete: {
        bottom: '0%',
        right: '2%',
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
      prevState.marksList.push(currentNr); // for unknown reason, we could only finish these steps outside the "return" obj
      return ({
        marksList: prevState.marksList,
        markCircles: prevState.markCircles,
        markEditorContent: prevState.markEditorContent,
        markExpand: (currentNr),
        markExpandify: true
      })
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
    if(this.state.markExpandify) return;
    let marksData = {list:[], data:{}};
    this.state.marksList.forEach((markKey, index)=>{
      marksData["data"][markKey] = {
        top: this.state.markCircles[markKey].top,
        left: this.state.markCircles[markKey].left,
        editorContent: this.state.markEditorContent[markKey],
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
    if(this.state.markExpandify) return;
    this.props._close_img_Cancell();
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
        markEditorContent: editorContent,
        markExpand: props.markExpand,
        markExpandify: props.markExpand?true : false
      };
    })
    //Be awared ! the mounted component only means ModalBox itself here, it would render the children "leter"
  }

  render(){
    return(
      <ModalBox containerId="editingModal">
        <div
          style={this.style.Com_Modal_ContentModal}>
          <div style={styleMiddle.imgDecoBackContent}/>
          <div
            style={this.style.Com_Modal_ContentModal_Mark}>
            <div
              style={this.style.Com_Modal_ContentModal_Mark_imglayer}>
              <ImgLayerEditing
                imgSrc={this.props.imgSrc}
                currentMark={this.state.markExpand}
                markOpened={this.state.markExpandify}
                marksList={this.state.marksList}
                markCircles={this.state.markCircles}
                markEditorContent={this.state.markEditorContent}
                _set_Markvisible={this._set_markExpand}
                _set_markNewSpot={this._set_markNewSpot}
                _set_markUpdate_editor={this._set_markUpdate_editor}
                _set_markDelete={this._set_markDelete}
                _reset_expandState={this._reset_expandState}/>
            </div>
          </div>
          <div
            style={this.style.Com_ContentModal_ControlSection_div}>
            {
              this.props.creating &&
              <div
                style={
                  Object.assign({}, this.style.Com_ContentModal_ControlSection_div_Cancel, styleMiddle.boxSubmitButton, styleMiddle.roundRecBox)}
                onClick={this._handleClick_editingCancell}>
                <span
                  className={'centerAlignChild'}
                  style={styleMiddle.spanDestiny}>
                  {'delete'}</span>
                {this.state.markExpandify && <div style={Object.assign({}, styleMiddle.boxSubmitInvalid, styleMiddle.roundRecBox, generalStyle.submitInvalid)}/>}
              </div>
            }
            <div
              style={
                Object.assign({}, this.style.Com_ContentModal_ControlSection_div_Complete, styleMiddle.boxSubmitButton, styleMiddle.roundRecBox, {backgroundColor:'#ff7a5f'})}
              onClick={this._handleClick_editingComplete}>
              <span
                className={'centerAlignChild'}
                style={styleMiddle.spanDestiny}>
                {"complete"}</span>
              {this.state.markExpandify && <div style={Object.assign({}, styleMiddle.boxSubmitInvalid, styleMiddle.roundRecBox, generalStyle.submitInvalid)}/>}
            </div>
          </div>
        </div>
      </ModalBox>
    )
  }
}
