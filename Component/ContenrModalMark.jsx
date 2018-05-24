import React from 'React';
import MarkEditingBlock from './MarkEditingBlock.jsx';
import MarkEditingList from './MarkEditingList.jsx';

export default class ContenrModalMark extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      markCircles: this.props.marksData.markCircles,
      markEditorContent: this.props.marksData.markEditorContent,
      markExpand: null
    };
    this._set_markNewSpot = this._set_markNewSpot.bind(this);
    this._set_markUpdate_editor = this._set_markUpdate_editor.bind(this);
    this._handleClick_MarksLayer = this._handleClick_MarksLayer.bind(this);
    this._handleClick_MarkNumber = this._handleClick_MarkNumber.bind(this);
    this._handleClick_editingComplete = this._handleClick_editingComplete.bind(this);
    this._handleClick_editingCancell =this._handleClick_editingCancell.bind(this);
    this.style={

    }
  }

  _set_markNewSpot(portionCoordinate){
    this.state.markCircles.push(portionCoordinate);
    this.state.markEditorContent.push(null);
    this.setState({markCircles: this.state.markCircles, markEditorContent: this.state.markEditorContent, markExpand: (this.state.markCircles.length-1)});
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
      holdingLeft: this.div_markLayer.getBoundingClientRect().left,
      holdingTop: this.div_markLayer.getBoundingClientRect().top,
      holdingWidth: this.div_markLayer.clientWidth,
      holdingHeight: this.div_markLayer.clientHeight
    };

    let portionCoordinate = {
      top: ((originalCoordinate.clickY-originalCoordinate.holdingTop)/originalCoordinate.holdingHeight*100),
      left: ((originalCoordinate.clickX-originalCoordinate.holdingLeft)/originalCoordinate.holdingWidth*100)
    };
    this._set_markNewSpot(portionCoordinate);
  }

  _handleClick_MarkNumber(number){
    if(number !== this.state.markExpand){
      this.setState({markExpand: null});
      this.setState({markExpand: number});
    }
  }

  _handleClick_editingComplete(event){
    event.stopPropagation();
    event.preventDefault();
    this.props._close_Mark_Complete({markCircles:this.state.markCircles, markEditorContent: this.state.markEditorContent}, this.props.blockName);
  }

  _handleClick_editingCancell(event){
    event.stopPropagation();
    event.preventDefault();
    this.props._close_editingCancell();
  }

  render(){
    return(
      <div>
        <div
          style={}
          onClick={this._handleClick_MarksLayer}>
          <img
            src={this.props.imgSrc}
            style={}/>
          {
            this.state.markExpand &&
            <MarkEditingBlock
              markNr = {this.state.markExpand}
              coordinate={this.state.markCircles[this.state.markExpand]}
              editorState={this.state.markEditorContent[this.state.markExpand]}
              _set_markUpdate_editor={this._set_markUpdate_editor}
              _set_refsArr={this.props._set_refsArr}/>
          }
        </div>
        <div>
          <MarkEditingList
            markCircles={this.state.markCircles}
            markExpand={this.state.markExpand}
            _handleClick_MarkNumber={this._handleClick_MarkNumber}/>
        </div>
        <div>
          <div
            onClick={this._handleClick_editingCancell}>
            {'取消'}
          </div>
          <div
            style={}
            onClick={this._handleClick_editingComplete}>
            {"完成"}
          </div>
        </div>
      </div>
    )
  }
}
