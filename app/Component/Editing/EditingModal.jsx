import React from 'react';
import {
  Link,
  withRouter,
  Redirect
} from 'react-router-dom';
import {connect} from "react-redux";
import ImgBlock from './ImgBlock.jsx';
import EditingPanel from './EditingPanel.jsx';
import ContentModal from './ContentModal.jsx';
import NounsEditor from './NounsEditor.jsx';
import MarksArticle from '../MarksArticle.jsx';

const styleMiddle = {
  imgBLockDecoBack:{
    width: '21%',
    height: '100%',
    position: 'absolute',
    left: '65%',
    top: '0',
    boxSizing: 'border-box',
    backgroundColor: '#FAFAFA'
  }
}

class EditingModal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      contentInit: {focusBlock: null, markExpand: null},
      contentModalify: false,
      coverSrc: this.props.unitSet?this.props.unitSet.coverSrc:null,
      beneathSrc: this.props.unitSet?this.props.unitSet.beneathSrc:null,
      coverMarks: this.props.unitSet?this.props.unitSet.coverMarks:{list:[], data:{}},
      beneathMarks: this.props.unitSet?this.props.unitSet.beneathMarks:{list:[],data:{}},
      refsArr: this.props.unitSet?this.props.unitSet.refsArr:[],
      nouns: this.props.unitSet?this.props.unitSet.nouns:{list:[],basic:{}}
    };
    this._reset_modalState = () => {this.setState({contentInit: {focusBlock: null, markExpand: null}, contentModalify: false});};
    this._set_nouns = (nounSet) => {this.setState((prevState, props) => {return {nouns: nounSet}})};
    this._set_refsArr = ()=>{};
    this._open_ContentModal = this._open_ContentModal.bind(this);
    this._set_newImgSrc = this._set_newImgSrc.bind(this);
    this._close_Mark_Complete = this._close_Mark_Complete.bind(this);
    this._close_img_Cancell = this._close_img_Cancell.bind(this);
    this._handleClick_Editing_Cancell = this._handleClick_Editing_Cancell.bind(this);
    this._handleClick_Editing_Submit = this._handleClick_Editing_Submit.bind(this);
    this.style={
      Com_Modal_Editing_: {
        width: '86%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '50%',
        transform: 'translate(-50%, 0)',
        boxSizing: 'border-box',
        backgroundColor: '#101010'
      },
      Com_Modal_Editing_imgBlocks_: {
        width: '27%',
        height: '78%',
        position: 'absolute',
        top: '0',
        right: '0',
        boxSizing: 'border-box',
        backgroundColor: 'transparent'
      },
      Com_Modal_Editing_Panel_: {
        width: '100%',
        height: '6%',
        position: 'absolute',
        top: '88%',
        left:'0',
        boxSizing: 'border-box'
      },
      Com_Modal_Editing_InfoSide: {
        width: '28%',
        height: '32%',
        position: 'absolute',
        bottom: '22%',
        left: '13%',
        overflow: 'visible'
      },
      Com_Modal_Editing_imgBlocks_block_: {
        width: '80%',
        height: '34%',
        position: 'absolute',
        left: '0',
        boxSizing: 'border-box'
      },
      Com_Modal_Editing_article_: {
        display: 'inline-block',
        width: '48%',
        height: '72%',
        position: 'absolute',
        top: '6%',
        right: '4%',
        boxSizing: 'border-box',
        backgroundColor: 'transparent',
        overflow: 'auto'
      },
    }
  }

  _set_newImgSrc(dataURL, forBlock){
    if(forBlock=='cover'){
      this.setState({coverSrc: dataURL, contentInit: {focusBlock: forBlock, markExpand: null}, contentModalify: true})
    }else if(forBlock=='beneath'){
      this.setState({beneathSrc: dataURL, contentInit: {focusBlock: forBlock, markExpand: null}, contentModalify: true})
    };
  }

  _open_ContentModal(focusBlock, markKey){
    this.setState((prevState, props)=>{
      return {
        contentInit: {focusBlock: focusBlock, markExpand: markKey?markKey:null},
        contentModalify: true
      };
    });
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
    let focusBlock = this.state.contentInit.focusBlock;
    if(focusBlock=='cover'){
      this.setState({coverSrc: null, coverMarks:{list:[], data:{}},contentInit: {focusBlock: null, markExpand: null}, contentModalify: false})
    }else if(focusBlock=='beneath'){
      this.setState({beneathSrc: null, beneathMarks:{list:[], data:{}}, contentInit: {focusBlock: null, markExpand: null}, contentModalify: false})
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
    if(this.props.unitSubmitting) return;

    //to prevent any main mutation during process
    //notice this could not stop the change in the 'children' of each value
    let newObj = Object.assign({}, this.state);

    this.props._set_Submit(newObj);
  }

  render(){
    return(
      <div
        id={'editingModal'}
        style={this.style.Com_Modal_Editing_}>
        <div
          style={this.style.Com_Modal_Editing_InfoSide}>
          <NounsEditor
            nouns={this.state.nouns}
            _set_nouns={this._set_nouns}/>
        </div>
        <article
          style={this.style.Com_Modal_Editing_article_}>
          <MarksArticle
            layer={'cover'}
            marksObj={this.state.coverMarks}
            _set_MarkInspect={this._open_ContentModal}/>
          <div
            style={{width: '90%', height: '0', position: 'relative', marginLeft: '5%', borderTop: 'solid 1px #ABABAB', color: '#ABABAB'}}>
            {!this.state.coverSrc && "請按左側 新增圖片"}
          </div>
          <MarksArticle
            layer={'beneath'}
            marksObj={this.state.beneathMarks}
            _set_MarkInspect={this._open_ContentModal}/>
        </article>
        <div
          style={this.style.Com_Modal_Editing_imgBlocks_}>
          <div style={styleMiddle.imgBLockDecoBack}/>
          <div
            style={Object.assign({top: '8%'}, this.style.Com_Modal_Editing_imgBlocks_block_)}>
            <ImgBlock
              blockName={'cover'}
              previewSrc={this.state.coverSrc}
              _set_newImgSrc={this._set_newImgSrc}
              _open_ContentModal={this._open_ContentModal}/>
          </div>
          <div
            style={Object.assign({top: '54%'}, this.style.Com_Modal_Editing_imgBlocks_block_)}>
            <ImgBlock
              blockName={'beneath'}
              previewSrc={this.state.beneathSrc}
              _set_newImgSrc={this._set_newImgSrc}
              _open_ContentModal={this._open_ContentModal}/>
            {!this.state.coverSrc && <div style={{width: '100%',height: '100%',position:'absolute'}}></div>}
          </div>
        </div>
        <div
          style={this.style.Com_Modal_Editing_Panel_}>
          <EditingPanel
            creating={this.props.unitSet?false:true}
            _refer_toandclose={this.props._refer_toandclose}
            _handleClick_Editing_Submit={this._handleClick_Editing_Submit}
            _handleClick_Editing_Cancell={this._handleClick_Editing_Cancell}/>
        </div>
        {
          this.state.contentModalify &&
          <ContentModal
            creating={this.props.unitSet?false:true}
            layer={this.state.contentInit.focusBlock=='cover'?0:1}
            imgSrc={this.state.contentInit.focusBlock=='cover'?this.state.coverSrc:this.state.beneathSrc}
            marks={this.state.contentInit.focusBlock=='cover'?this.state.coverMarks:this.state.beneathMarks}
            markExpand={this.state.contentInit.markExpand}
            _set_refsArr={this.props._set_refsArr}
            _close_Mark_Complete={this._close_Mark_Complete}
            _close_img_Cancell={this._close_img_Cancell}/>
        }
        {
          this.props.unitSubmitting &&
          <div
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: '0',
              left:'0',
              backgroundColor: 'rgba(230,230,230,0.5)'
            }}
            onClick={(e)=>{e.preventDefault(); e.stopPropagation();}}>
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
    unitSubmitting: state.unitSubmitting
  }
}

export default withRouter(connect(
  mapStateToProps,
  null
)(EditingModal));
