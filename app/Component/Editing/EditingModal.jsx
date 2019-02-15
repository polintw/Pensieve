import React from 'React';
import {
  Link,
  withRouter,
  Redirect
} from 'react-router-dom';
import {connect} from "react-redux";
import ImgBlock from './ImgBlock.jsx';
import EditingInfoSide from './EditingInfoSide.jsx';
import ContentModal from './ContentModal.jsx';
import MarksArticle from '../MarksArticle.jsx';

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
        backgroundColor: '#51514A'
      },
      Com_Modal_Editing_imgBlocks_: {
        display: 'inline-block',
        width: '16%',
        height: '100%',
        position: 'relative',
        boxSizing: 'border-box',
        backgroundColor: '#313130',
        color: '#FFFFFC'
      },
      Com_Modal_Editing_imgBlocks_block_: {
        width: '100%',
        height: '21%',
        position: 'absolute',
        boxSizing: 'border-box'
      },
      Com_Modal_Editing_article_: {
        display: 'inline-block',
        width: '56%',
        height: '100%',
        position: 'relative',
        boxSizing: 'border-box',
        backgroundColor: '#f8f8f8',
        verticalAlign: 'top'
      },
      Com_Modal_Editing_InfoSide: {
        display: 'inline-block',
        width: '28%',
        height: '100%',
        position: 'relative',
        boxSizing: 'border-box'
      }
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
    //「send to Unit as string, Unit use them as obj, create and edit as obj, but submit as string」
    let newObj = Object.assign({}, this.state); //prevent data lost during unmount.
    newObj["joinedMarksList"] = newObj.coverMarks.list.concat(newObj.beneathMarks.list);
    newObj["joinedMarks"] = Object.assign({}, newObj.coverMarks.data, newObj.beneathMarks.data);
    delete newObj.coverMarks;
    delete newObj.beneathMarks;
    newObj.joinedMarksList.forEach((key, index)=>{
      let editorString = JSON.stringify(newObj.joinedMarks[key].editorContent);
      newObj.joinedMarks[key].editorContent = editorString;
    })

    this.props._set_Submit(newObj);
  }

  render(){
    return(
      <div
        id={'editingModal'}
        style={this.style.Com_Modal_Editing_}>
        <div
          style={this.style.Com_Modal_Editing_imgBlocks_}>
          <div
            style={Object.assign({top: '28%'}, this.style.Com_Modal_Editing_imgBlocks_block_)}>
            <ImgBlock
              blockName={'cover'}
              previewSrc={this.state.coverSrc}
              _set_newImgSrc={this._set_newImgSrc}
              _open_ContentModal={this._open_ContentModal}/>
          </div>
          <div
            style={Object.assign({top: '51%', opacity: this.state.coverSrc?1:0.5}, this.style.Com_Modal_Editing_imgBlocks_block_)}>
            <ImgBlock
              blockName={'beneath'}
              previewSrc={this.state.beneathSrc}
              _set_newImgSrc={this._set_newImgSrc}
              _open_ContentModal={this._open_ContentModal}/>
            {!this.state.coverSrc && <div style={{width: '100%',height: '100%',position:'absolute'}}></div>}
          </div>
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
          style={this.style.Com_Modal_Editing_InfoSide}>
          <EditingInfoSide
            creating={this.props.unitSet?false:true}
            nouns={this.state.nouns}
            _set_nouns={this._set_nouns}
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
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent
  }
}

export default withRouter(connect(
  mapStateToProps,
  null
)(EditingModal));
