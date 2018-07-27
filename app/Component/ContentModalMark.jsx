import React from 'React';
import MarkEditingBlock from './MarkEditingBlock.jsx';
import MarkEditingList from './MarkEditingList.jsx';

export default class ContentModalMark extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      markCircles: [],
      markEditorContent: [],
      markId: [],
      markExpand: null,
      markExpandify: false
    };
    this._reset_expandState = ()=>{this.setState({markExpand: null, markExpandify: false});};
    this._set_markNewSpot = this._set_markNewSpot.bind(this);
    this._set_markDelete = this._set_markDelete.bind(this);
    this._set_markUpdate_editor = this._set_markUpdate_editor.bind(this);
    this._handleClick_MarksLayer = this._handleClick_MarksLayer.bind(this);
    this._handleClick_MarkNumber = this._handleClick_MarkNumber.bind(this);
    this._handleClick_editingComplete = this._handleClick_editingComplete.bind(this);
    this._handleClick_editingCancell =this._handleClick_editingCancell.bind(this);
    this.style={
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
        cursor: 'crosshair'
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

  _set_markNewSpot(portionCoordinate){
    this.setState((prevState, props)=>{
      prevState.markCircles.push(portionCoordinate);
      prevState.markEditorContent.push(null);
      prevState.markId.push('mark_'+this.props.focusBlock+'_'+this.state.markId.length);
      return {markCircles: prevState.markCircles, markEditorContent: prevState.markEditorContent, markId: prevState.markId, markExpand: (prevState.markCircles.length-1), markExpandify: true}
    });
  }

  _set_markDelete(){
    this.state.markCircles.splice(this.state.markExpand, 1);
    this.state.markEditorContent.splice(this.state.markExpand, 1);
    this.state.markId.splice(this.state.markExpand, 1);
    this._reset_expandState();
  }

  _set_markUpdate_editor(contentRaw, index){
    this.state.markEditorContent[index]=contentRaw;
  }

  _handleClick_MarksLayer(event){
    event.stopPropagation();
    event.preventDefault();
    let originalCoordinate = {
      clickX : event.clientX,
      clickY : event.clientY,
      holdingLeft: this.Com_ContentModal_ImgSection_div_img.getBoundingClientRect().left,
      holdingTop: this.Com_ContentModal_ImgSection_div_img.getBoundingClientRect().top,
      holdingWidth: this.Com_ContentModal_ImgSection_div_img.clientWidth,
      holdingHeight: this.Com_ContentModal_ImgSection_div_img.clientHeight
    };

    let portionCoordinate = {
      top: ((originalCoordinate.clickY-originalCoordinate.holdingTop)/originalCoordinate.holdingHeight*100),
      left: ((originalCoordinate.clickX-originalCoordinate.holdingLeft)/originalCoordinate.holdingWidth*100)
    };
    this._set_markNewSpot(portionCoordinate);
  }

  _handleClick_MarkNumber(number){
    if(number !== this.state.markExpand){
      this.setState((prevState, props) => {return {markExpandify: false}}, ()=>{this.setState({markExpand: number, markExpandify: true});})
    }else if(number == this.state.markExpand){
      this._reset_expandState();
    }
  }

  _handleClick_editingComplete(event){
    event.stopPropagation();
    event.preventDefault();
    let marksData = new Object();
    this.state.markId.forEach((id, index)=>{
      marksData[id] = {markCoordinate: this.state.markCircles[index], markEditorContent: this.state.markEditorContent[index], markId: id};
    })
    this.props._close_Mark_Complete(marksData, this.props.blockName);
  }

  _handleClick_editingCancell(event){
    event.stopPropagation();
    event.preventDefault();
    this.props._close_img_Cancell();
  }

  componentDidMount(){
    let keys = Object.keys(this.props.marksObj);
    if(keys.length>0){
      let circles = keys.map(function(key, index){
        return this.props.marksObj[key].markCoordinate
      });
      let editorContent = keys.map((key, index)=>{
        return this.props.marksObj[key].markEditorContent
      })
      let ids = keys.map((key, index)=>{
        return this.props.marksObj[key].markId
      });
      this.setState((prevState, props)=>{return {markCircles: circles, markEditorContent: editorContent, markId: ids};})
    }
  }

  render(){
    return(
      <div
        style={this.style.Com_Modal_ContentModal_Mark}>
        <div
          style={this.style.Com_ContentModal_ImgSection_div}>
          <img
            style={this.style.Com_ContentModal_ImgSection_div_img}
            ref={(element) => {this.Com_ContentModal_ImgSection_div_img = element;}}
            src={this.props.imgSrc}
            onClick={this._handleClick_MarksLayer}/>
          {
            this.state.markExpandify &&
            <MarkEditingBlock
              markNr = {this.state.markExpand}
              coordinate={this.state.markCircles[this.state.markExpand]}
              editorState={this.state.markEditorContent[this.state.markExpand]}
              frame={{width: this.Com_ContentModal_ImgSection_div_img.clientWidth, height: this.Com_ContentModal_ImgSection_div_img.clientHeight}}
              _set_markUpdate_editor={this._set_markUpdate_editor}
              _set_refsArr={this.props._set_refsArr}
              _set_markDelete={this._set_markDelete}
              _reset_expandState={this._reset_expandState}/>
          }
        </div>
        <div
          style={this.style.Com_ContentModal_ListSection_div}>
          <MarkEditingList
            markCircles={this.state.markCircles}
            markExpand={this.state.markExpand}
            _handleClick_MarkNumber={this._handleClick_MarkNumber}/>
        </div>
        <div
          style={this.style.Com_ContentModal_ControlSection_div}>
          <div
            style={this.style.Com_ContentModal_ControlSection_div_Cancel}
            onClick={this._handleClick_editingCancell}>
            {'刪除'}
          </div>
          <div
            style={this.style.Com_ContentModal_ControlSection_div_Complete}
            onClick={this._handleClick_editingComplete}>
            {"完成"}
          </div>
        </div>
      </div>
    )
  }
}
