import React from 'react';
import {
  Link,
  withRouter,
  Redirect
} from 'react-router-dom';
import {connect} from "react-redux";
import styleMiddle from "./styleEditingModal.module.css";
import ImgImport from '../ImgImport.jsx';
import NounsEditor from '../NounsEditor.jsx';
import EditingPanel from '../EditingPanel.jsx';
import ContentModal from '../ContentModal.jsx';
import MarksArticleEdit from '../MarksArticleEdit.jsx';
import ImgPreview from '../../ImgPreview.jsx';
import WarningModal from '../../WarningModal.jsx';

class EditingModal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      contentInit: {focusBlock: null, markExpand: null},
      contentModalify: false,
      warningModal: false,
      warningType: null,
      articleEditing: false,
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
    this._set_newImgSrc = this._set_newImgSrc.bind(this);
    this._set_ArticleEdit = this._set_ArticleEdit.bind(this);
    this._submit_newShare = this._submit_newShare.bind(this);
    this._open_ContentModal = this._open_ContentModal.bind(this);
    this._close_img_Cancell = this._close_img_Cancell.bind(this);
    this._close_Mark_Complete = this._close_Mark_Complete.bind(this);
    this._render_importOrPreview = this._render_importOrPreview.bind(this);
    this._handleClick_Img_Delete = this._handleClick_Img_Delete.bind(this);
    this._set_WarningModal_positive = this._set_WarningModal_positive.bind(this);
    this.style={
      Com_Modal_Editing_: {
        width: '86%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '51%',
        transform: 'translate(-50%, 0)',
        boxSizing: 'border-box',
        backgroundColor: '#101010',
        boxShadow: '0px 0.2rem 0.3rem 0rem'
      },
      Com_Modal_Editing_imgBlocks_: {
        width: '25%',
        height: '78%',
        position: 'absolute',
        top: '0',
        left: '10%',
        boxSizing: 'border-box',
        backgroundColor: 'transparent'
      },
      Com_Modal_Editing_Panel_: {
        width: '100%',
        height: '5%',
        position: 'absolute',
        top: '89%',
        left:'0',
        boxSizing: 'border-box'
      },
      Com_Modal_Editing_Side_: {
        width: '22%',
        height: '32%',
        position: 'absolute',
        bottom: '22%',
        right: '5.5%',
        overflow: 'visible'
      },
      Com_Modal_Editing_article_: {
        display: 'inline-block',
        width: '32%',
        height: '73%',
        position: 'absolute',
        top: '5%',
        left: '37%',
        boxSizing: 'border-box',
        borderRight: 'solid 2px', //then render in 'black' (initial one)
        backgroundColor: 'transparent',
        overflow: 'auto'
      },
    }
  }

  _set_WarningModal_positive(){
    switch (this.state.warningType) {
      case 'warning': //case only warn or remind by message
        this.setState({warningModal: false, warningType: null})
        break;
      default:
        this.setState({warningModal: false, warningType: null})
    }
  }

  _set_ArticleEdit(mark){
    this.setState({articleEditing: mark});
  }

  _set_newImgSrc(dataURL, forBlock){
    if(forBlock=='cover'){
      this.setState({coverSrc: dataURL, contentInit: {focusBlock: forBlock, markExpand: null}, contentModalify: true})
    }else if(forBlock=='beneath'){
      this.setState({beneathSrc: dataURL, contentInit: {focusBlock: forBlock, markExpand: null}, contentModalify: true})
    };
  }

  _open_ContentModal(focusBlock, markKey){
    if(this.props.unitSubmitting || this.state.warningModal) return;
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
    //only close the ContentModal only, do not save anything
    this.setState({contentModalify: false});
  }

  _handleClick_Img_Delete(){
    let focusBlock = this.state.contentInit.focusBlock;
    if(focusBlock=='cover'){
      this.setState((prevState, props)=>{
        let modifiedState= prevState.beneathSrc?(
          {
            coverSrc: prevState.beneathSrc,
            coverMarks:prevState.beneathMarks,
            beneathSrc: null,
            beneathMarks:{list:[], data:{}},
            contentInit: {focusBlock: null, markExpand: null},
            contentModalify: false
          }
        ):(
          {
            coverSrc: null,
            coverMarks:{list:[], data:{}},
            contentInit: {focusBlock: null, markExpand: null},
            contentModalify: false
          }
        );

        return modifiedState;
      })
    }else if(focusBlock=='beneath'){
      this.setState({beneathSrc: null, beneathMarks:{list:[], data:{}}, contentInit: {focusBlock: null, markExpand: null}, contentModalify: false})
    };
  }

  _submit_newShare(){
    //shallow copy, prevent render init during the modifications
    let newObj = Object.assign({}, this.state);
    //check form filled
    if(!newObj["coverSrc"] || newObj["nouns"]["list"].length < 1) {
      this.setState({warningModal: 'please upload at least one image, and search an existing place to choose for~', warningType: 'warning'});
      return;
    };
    //seal the mark obj by fill in the lasr undetermined value, 'layer'
    newObj.coverMarks.list.forEach((markKey, index)=>{
      newObj.coverMarks.data[markKey].layer='0';
    });
    newObj.beneathMarks.list.forEach((markKey, index)=>{
      newObj.beneathMarks.data[markKey].layer='1';
    });
    //Then if everything is fine
    this.props._set_Submit(newObj);
  }

  _render_importOrPreview(){
    if(!this.state.coverSrc && !this.state.beneathSrc){
      return(
        <div
          className={styleMiddle.imgBLockButton}
          style={Object.assign({},{top: '14%'})}>
          <ImgImport
            blockName={'cover'}
            _set_newImgSrc={this._set_newImgSrc}/>
        </div>
      )
    }else if(this.state.coverSrc && !this.state.beneathSrc){
      return(
        <div>
          <div
            className={styleMiddle.imgBLockPreview}
            style={Object.assign({},{top: '7%'})}>
            <ImgPreview
              blockName={'cover'}
              previewSrc={this.state.coverSrc}
              _handleClick_ImgPreview_preview={this._open_ContentModal}/>
          </div>
          {
            !this.props.unitSet &&
            <div
              className={styleMiddle.imgBLockButton}
              style={Object.assign({},{top: '70%'})}>
              <ImgImport
                blockName={'beneath'}
                _set_newImgSrc={this._set_newImgSrc}/>
            </div>
          }
        </div>
      )
    }else{
      return(
        <div>
          <div
            className={styleMiddle.imgBLockPreview}
            style={Object.assign({},{top: '7%'})}>
            <ImgPreview
              blockName={'cover'}
              previewSrc={this.state.coverSrc}
              _handleClick_ImgPreview_preview={this._open_ContentModal}/>
          </div>
          <div
            className={styleMiddle.imgBLockPreview}
            style={Object.assign({},{top: '54%'})}>
            <ImgPreview
              blockName={'beneath'}
              previewSrc={this.state.beneathSrc}
              _handleClick_ImgPreview_preview={this._open_ContentModal}/>
          </div>
        </div>
      )
    }
  }

  render(){
    return(
      <div
        id={'editingModal'}
        style={this.style.Com_Modal_Editing_}>
        <div
          style={this.style.Com_Modal_Editing_Side_}>
          <NounsEditor
            nouns={this.state.nouns}
            _set_nouns={this._set_nouns}/>
        </div>
        <article
          style={this.style.Com_Modal_Editing_article_}>
          <MarksArticleEdit
            layer={'cover'}
            marksObj={this.state.coverMarks}
            _set_ArticleEdit={this._set_ArticleEdit}
            _set_MarkInspect={this._open_ContentModal}
            _close_Mark_Complete={this._close_Mark_Complete}/>
          <div
            className={styleMiddle.contentMarkInter}
            style={Object.assign({}, {borderTop: this.state.coverSrc? 'solid 1px #ABABAB':''})}>
            {!this.state.coverSrc && "add a new picture to mark something!"}
          </div>
          <MarksArticleEdit
            layer={'beneath'}
            marksObj={this.state.beneathMarks}
            _set_ArticleEdit={this._set_ArticleEdit}
            _set_MarkInspect={this._open_ContentModal}
            _close_Mark_Complete={this._close_Mark_Complete}/>
        </article>
        <div
          style={this.style.Com_Modal_Editing_imgBlocks_}>
          <div
            className={styleMiddle.imgBLockDecoBack}/>
          {this._render_importOrPreview()}
          {
            this.state.articleEditing &&
            <div
              className={styleMiddle.imgBLockPreview}
              style={Object.assign({top: this.state.articleEditing.layer=='cover'? '7%':'54%'}, {boxShadow: '-0.1rem 0.1rem 0.6rem 0 #c5c5c0',cursor: 'default'})}
              onClick={(e)=>{e.stopPropagation()}}>
            </div>
          }
        </div>
        <div
          style={this.style.Com_Modal_Editing_Panel_}>
          <EditingPanel
            warningModal={this.state.warningModal}
            articleEditing={this.state.articleEditing}
            _set_Clear={this.props._set_Clear}
            _submit_newShare={this._submit_newShare}
            _refer_toandclose={this.props._refer_toandclose}/>
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
            _close_img_Cancell={this._handleClick_Img_Delete}/>
        }
        {
          this.state.warningModal &&
          <WarningModal
            type={this.state.warningType}
            message={this.state.warningModal}
            _set_WarningModal_positive={this._set_WarningModal_positive}/>
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
