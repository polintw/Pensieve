import React from 'React';
import PlaceEditing from './PlaceEditing.jsx';
import ImgBlock from './ImgBlock.jsx';
import RefBlock from './RefBlock.jsx';
import ContentModal from './ContentModal.jsx';
import InfoNoun from './InfoNoun.jsx';

export default class EditingModal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      focusBlock: null,
      contentModalify: false,
      coverSrc: null,
      beneathSrc: null,
      coverMarks: {markCircles:[], markEditorContent: []},
      beneathMarks: {markCircles:[], markEditorContent: []},
      refsArr: [],
      nounsArr: []
    };
    this._set_focusBlock = (block) => {this.setState({focusBlock: block})};
    this._set_contentModalify = (bool) => {this.setState({contentModalify: bool})};
    this._set_coverSrc = (dataURL) => {this.setState({coverSrc: dataURL})};
    this._set_beneathSrc = (dataURL) => {this.setState({beneathSrc: dataURL})};
    this._set_coverMarks = (marksObj) => {this.setState({coverMarks: marksObj})};
    this._set_beneathMarks = (marksObj) => {this.setState({beneathMarks: marksObj})};
    this._set_refsArr = (refObj) => {this.state.refsArr.push(refObj);this.setState({refsArr: this.state.refsArr})};
    this._set_nounsArr = (noun) => {this.setState((prevState, props) => {prevState.nounsArr.push(noun); return {nounsArr: prevState}})};
    this._set_newImgSrc = this._set_newImgSrc.bind(this);
    this._close_Mark_Complete = this._close_Mark_Complete.bind(this);
    this._close_editingCancell = this._close_editingCancell.bind(this);
    this._handleClick_Editing_Cancell = this._handleClick_Editing_Cancell.bind(this);
    this._handleClick_Editing_Submit = this._handleClick_Editing_Submit.bind(this);
    this.style={
      div_Com_EditingModal: {

      },
    }
  }

  _set_newImgSrc(dataURL, forBlock){
    if(forBlock=='cover'){
      this.setState({coverSrc: dataURL, focusBlock: forBlock, contentModalify: true})
    }else if(forBlock=='beneath'){
      this.setState({beneathSrc: dataURL, focusBlock: forBlock, contentModalify: true})
    };
  }

  _close_Mark_Complete(markData, focusBlock){
    this._set_contentModalify(false);
    this._set_focusBlock(null);
    switch (focusBlock) {
      case 'cover':
        this._set_coverMarks(markData);
        break;
      case 'beneath':
        this._set_beneathMarks(markData);
        break;
      default:
        break;
    }
  }

  _close_editingCancell(){
    this._set_contentModalify(false);
    this._set_focusBlock(null);
  }

  _handleClick_Editing_Cancell(event){
    event.stopPropagation();
    event.preventDefault();
    this.props._set_Clear();
  }

  _handleClick_Editing_Submit(event){
    event.stopPropagation();
    event.preventDefault();
    this.props._set_Submit(this.state);
  }

  render(){
    let editDate = new Date();

    return(
      <div
        id={'editingModal'}
        style={this.style.div_Com_EditingModal}>
        <div
          style={this.style.div_Com_EditingModal_InfoSide}>
          <div
            style={}>
            <InfoNoun
              nounsArr={this.state.nounsArr}
              _set_nounsArr={this._set_nounsArr}/>
          </div>
          <div>
            <span>{editDate.getMonth()+1}</span>
            <span>{' 月'}</span>
            <span>{editDate.getDate()}</span>
            <span>{' 日'}</span>
          </div>
        </div>
        <div
          style={this.style.div_Com_EditingModal_PicMain}>
          <ImgBlock
            blockName={'cover'}
            componentStyle={this.style.div_Com_ImgBlock_Cover}
            previewSrc={this.state.coverSrc}
            _set_newImgSrc={this._set_newImgSrc}
            _set_contentModalify={this._set_contentModalify}
            _set_focusBlock={this._set_focusBlock}/>
          <ImgBlock
            blockName={'Second'}
            componentStyle={this.style.div_Com_ImgBlock_Second}
            previewSrc={this.state.secondSrc}
            _set_newImgSrc={this._set_newImgSrc}
            _set_contentModalify={this._set_contentModalify}
            _set_focusBlock={this._set_focusBlock}/>
          <RefBlock
            componentStyle={this.style.div_Com_ImgBlock_Ref}
            refsArr={this.state.refsArr}
            _set_refsArr={this._set_refsArr}
            _set_focusBlock={this._set_focusBlock}/>
        </div>
        <div
          style={this.style.div_Com_EditingModal_ControlSide}>
          <div
            style={this.style.div_Com_EditingModal_ControlSide_Submit}
            onClick={this._handleClick_Editing_Submit}>
            {"發布"}
          </div>
          <div
            onClick={this._handleClick_Editing_Cancell}>
            {"取消"}
          </div>
        </div>
        {
          this.state.contentModalify &&
          <ContentModal
            focusBlock={this.state.focusBlock}
            coverSrc={this.state.coverSrc}
            beneathSrc={this.state.beneathSrc}
            coverMarks={this.state.coverMarks}
            beneathMarks={this.state.beneathMarks}
            refsArr={this.state.refsArr}
            _set_refsArr={this._set_refsArr}
            _close_Mark_Complete={this._close_Mark_Complete}
            _close_editingCancell={this._close_editingCancell}/>
        }
      </div>
    )
  }
}
