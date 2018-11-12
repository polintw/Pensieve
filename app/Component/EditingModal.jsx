import React from 'React';
import EditingInfoSide from './Share/EditingInfoSide.jsx';
import ImgBlock from './Share/ImgBlock.jsx';
import RefBlock from './Share/RefBlock.jsx';
import ContentModal from './Share/ContentModal.jsx';

export default class EditingModal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      focusBlock: null,
      contentModalify: false,
      coverSrc: this.props.unitSet?this.props.unitSet.coverSrc:null,
      beneathSrc: this.props.unitSet?this.props.unitSet.beneathSrc:null,
      coverMarks: this.props.unitSet?this.props.unitSet.coverMarksObj:[],
      beneathMarks: this.props.unitSet?this.props.unitSet.beneathMarksObj:[],
      refsArr: this.props.unitSet?this.props.unitSet.refsArr:[],
      nounsArr: this.props.unitSet?this.props.unitSet.nouns:[]
    };
    this._reset_modalState = () => {this.setState({focusBlock: null, contentModalify: false});};
    this._set_focusBlock = (block) => {this.setState({focusBlock: block})};
    this._set_contentModalify = (bool) => {this.setState({contentModalify: bool})};
    this._set_refsArr = (refObj) => {this.setState((prevState,props)=>{return {refsArr: prevState.refsArr.push(refObj)};});};
    this._set_nounsArr = (nounBasic) => {this.setState((prevState, props) => {prevState.nounsArr.push(nounBasic); return {nounsArr: prevState.nounsArr}})};
    this._set_newImgSrc = this._set_newImgSrc.bind(this);
    this._close_Mark_Complete = this._close_Mark_Complete.bind(this);
    this._close_img_Cancell = this._close_img_Cancell.bind(this);
    this._handleClick_Editing_Cancell = this._handleClick_Editing_Cancell.bind(this);
    this._handleClick_Editing_Submit = this._handleClick_Editing_Submit.bind(this);
    this.style={
      Com_Modal_EditingModal: {
        width: '86%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '50%',
        transform: 'translate(-50%, 0)',
        boxSizing: 'border-box',
        backgroundColor: '#51514A'
      },
      Com_div_EditingModal_InfoSide: {
        display: 'inline-block',
        width: '31%',
        height: '100%',
        position: 'relative',
        boxSizing: 'border-box'
      },
      Com_div_EditingModal_BlocksMain: {
        display: 'inline-block',
        width: '60%',
        height: '100%',
        position: 'relative',
        boxSizing: 'border-box',
        backgroundColor: '#313130',
        color: '#FFFFFC'
      },
      Com_div_EditingModal_BlocksMain_ImgBlock_: {
        width: '100%',
        height: '40%',
        position: 'relative',
        boxSizing: 'border-box',
        borderBottom: '0.1vw solid black'
      },
      Com_div_EditingModal_BlocksMain_RefBlock: {
        width: '100%',
        height: '20%',
        position: 'relative',
        boxSizing: 'border-box'
      },
      Com_div_EditingModal_ControlSide: {
        display: 'inline-block',
        width: '9%',
        height: '100%',
        position: 'relative',
        boxSizing: 'border-box'
      },
      Com_div_EditingModal_ControlSide_Desitny: {
        width: '100%',
        height: '24%',
        position: 'absolute',
        bottom: '0',
        left: '0'
      },
      Com_div_EditingModal_ControlSide_Desitny_submit_: {
        width: '67%',
        height: '36%',
        position: 'absolute',
        top: '0%',
        left: '50%',
        transform: 'translate(-50%, 0)',
        boxSizing: 'border-box',
        border: '0.1vw solid #FAFAFA',
        borderRadius: '10px',
        cursor: 'pointer'
      },
      Com_div_EditingModal_ControlSide_Desitny_cancell_: {
        width: '67%',
        height: '36%',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, 0)',
        boxSizing: 'border-box',
        border: '0.1vw solid #FAFAFA',
        borderRadius: '10px',
        cursor: 'pointer'
      },
      Com_div_EditingModal_ControlSide_Desitny_div_span: {
        display: 'block',
        width: '100%',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '3.2vh',
        letterSpacing: '0.6vh',
        textAlign: 'center',
        color: '#FAFAFA'
      }
    }
  }

  _set_newImgSrc(dataURL, forBlock){
    if(forBlock=='cover'){
      this.setState({coverSrc: dataURL, focusBlock: forBlock, contentModalify: true})
    }else if(forBlock=='beneath'){
      this.setState({beneathSrc: dataURL, focusBlock: forBlock, contentModalify: true})
    };
  }

  _close_Mark_Complete(markData, layer){
    switch (layer) {
      case 0:
        this.setState((prevState, props) => {return {coverMarks: markData}}, this._reset_modalState());
        break;
      case 1:
        this.setState((prevState, props) => {return {beneathMarks: markData}}, this._reset_modalState());
        break;
      default:
        break;
    }
  }

  _close_img_Cancell(){
    let focusBlock = this.state.focusBlock;
    if(focusBlock=='cover'){
      this.setState({coverSrc: null, coverMarks: {}, focusBlock: null, contentModalify: false})
    }else if(focusBlock=='beneath'){
      this.setState({beneathSrc: null, beneathMarks: {}, focusBlock: null, contentModalify: false})
    };
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
    return(
      <div
        id={'editingModal'}
        style={this.style.Com_Modal_EditingModal}>
        <div
          style={this.style.Com_div_EditingModal_InfoSide}>
          <EditingInfoSide
            nounsArr={this.state.nounsArr}
            _set_nounsArr={this._set_nounsArr}/>
        </div>
        <div
          style={this.style.Com_div_EditingModal_BlocksMain}>
          <ImgBlock
            blockName={'cover'}
            componentStyle={this.style.Com_div_EditingModal_BlocksMain_ImgBlock_}
            previewSrc={this.state.coverSrc}
            _set_newImgSrc={this._set_newImgSrc}
            _set_contentModalify={this._set_contentModalify}
            _set_focusBlock={this._set_focusBlock}/>
          <ImgBlock
            blockName={'beneath'}
            componentStyle={this.style.Com_div_EditingModal_BlocksMain_ImgBlock_}
            previewSrc={this.state.beneathSrc}
            _set_newImgSrc={this._set_newImgSrc}
            _set_contentModalify={this._set_contentModalify}
            _set_focusBlock={this._set_focusBlock}/>
          <RefBlock
            componentStyle={this.style.Com_div_EditingModal_BlocksMain_RefBlock}
            refsArr={this.state.refsArr}
            _set_refsArr={this._set_refsArr}
            _set_contentModalify={this._set_contentModalify}
            _set_focusBlock={this._set_focusBlock}/>
        </div>
        <div
          style={this.style.Com_div_EditingModal_ControlSide}>
          <div
            style={this.style.Com_div_EditingModal_ControlSide_Desitny}>
            <div
              style={this.style.Com_div_EditingModal_ControlSide_Desitny_submit_}
              onClick={this._handleClick_Editing_Submit}>
              <span style={this.style.Com_div_EditingModal_ControlSide_Desitny_div_span}>
                {"發 布"}
              </span>
            </div>
            <div
              style={this.style.Com_div_EditingModal_ControlSide_Desitny_cancell_}
              onClick={this._handleClick_Editing_Cancell}>
              <span style={this.style.Com_div_EditingModal_ControlSide_Desitny_div_span}>
                {"取 消"}
              </span>
            </div>
          </div>
        </div>
        {
          this.state.contentModalify &&
          <ContentModal
            focusBlock={this.state.focusBlock}
            coverSrc={this.state.coverSrc}
            beneathSrc={this.state.beneathSrc}
            marksArr={this.state.focusBlock=='cover'?this.state.coverMarks:this.state.beneathMarks}
            refsArr={this.state.refsArr}
            _set_refsArr={this._set_refsArr}
            _close_Mark_Complete={this._close_Mark_Complete}
            _close_img_Cancell={this._close_img_Cancell}/>
        }
      </div>
    )
  }
}
