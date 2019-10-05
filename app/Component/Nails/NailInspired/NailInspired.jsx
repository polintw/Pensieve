import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import ImgPreview from '../../ImgPreview.jsx';
import DisplayMarkPreview from '../../Draft/DisplayMarkPreview.jsx';
import {
  renderNodesRows
} from '../utils.js';

class NailInspired extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onFrame: false,
      onImg: false,
      overContent: false
    };
    this.nailImgBox = React.createRef();
    this._render_nails_nouns = this._render_nails_nouns.bind(this);
    this._handleOver_Content = this._handleOver_Content.bind(this);
    this._handleOut_Content = this._handleOut_Content.bind(this);
    this._handleOver_nailFrame = this._handleOver_nailFrame.bind(this);
    this._handleOut_nailFrame = this._handleOut_nailFrame.bind(this);
    this._handleEnter_nailImg = this._handleEnter_nailImg.bind(this);
    this._handleLeave_nailImg = this._handleLeave_nailImg.bind(this);
    this.style = {
      Com_Nails_Inspired_: {
        width: '100%',
        height: '100%',
        position: 'relative',
        boxSizing: 'border-box',
        backgroundColor: 'white',
        overflow: 'hidden'
      },
      Com_Nails_Inspired_pic_img_: {
        width: '100%',
        height: 'auto',
        position: 'absolute',
        bottom: '0%',
        left: '0%',
      }
    }
  }

  _handleOver_Content(e){
    e.stopPropagation(); //stop propagation so the outer frame would not be triggred
    this.setState({overContent: e.currentTarget.getAttribute('value')});
  }

  _handleOut_Content(e){
    e.stopPropagation();
    this.setState({overContent: false})
  }

  _handleOver_nailFrame(e){
    e.stopPropagation();
    this.setState({onFrame: true})
  }

  _handleOut_nailFrame(e){
    e.stopPropagation();
    this.setState({onFrame: false})
  }

  _handleEnter_nailImg(e){
    this.setState({onImg: true})
  }

  _handleLeave_nailImg(e){
    this.setState({onImg: false})
  }

  _render_nails_nouns(){
    let nodesDOM = renderNodesRows(this.props, styles);

    return nodesDOM;
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    //this Nail was different from others.
    //in order to render multiple marks inside same Unit,
    //the Nail would be divided into 2 part: only marks, and the rest.
    //both 2 part form a rectangle , but only marks one influence the width of the parent,
    //means both part decide the absolute width by itself, the parent's would follow the marks only.
    return(
      <div
        className={classnames(
          styles.frame,
          {[styles.frameOnMouse]: this.state.onFrame}
        )}>
        <div
          className={classnames(styles.boxMarkPreview)}>
          <MarksFive
            {...this.props}
            overContent={this.state.overContent}
            _handleOver_Content={this._handleOver_Content}
            _handleOut_Content={this._handleOut_Content}/>
        </div>
        <Link
          to={{
            pathname: this.props.linkPath,
            search: '?theater&unitId='+this.props.unitId,
            state: {from: this.props.location}
          }}
          className={classnames('plainLinkButton')}
          onMouseOver={this._handleOver_nailFrame}
          onMouseOut={this._handleOut_nailFrame}>
          <div
            ref={this.nailImgBox}
            className={classnames(
              styles.boxImg,
              {[styles.boxImgNailWide]: (this.props.unitBasic.marksList.length > 1)}
            )}
            onMouseEnter={this._handleEnter_nailImg}
            onMouseLeave={this._handleLeave_nailImg}>
            <ImgPreview
              blockName={''}
              previewSrc={'/router/img/'+this.props.unitBasic.pic_layer0+'?type=thumb'}
              _handleClick_ImgPreview_preview={()=>{this.nailImgBox.current.click()}}/>
            <div
              className={classnames(
                styles.boxMask,
                {[styles.interMask]: this.state.onImg}
              )}/>
            <div className={styles.boxAuthor}>
              <span
                className={classnames('fontNailAuthor', styles.spanAuthor, styles.fontAuthor)}>
                {this.props.unitBasic.authorId in this.props.usersBasic ? this.props.usersBasic[this.props.unitBasic.authorId].account:null}
              </span>
            </div>
          </div>
          <div
            className={classnames(
              styles.boxNodes,
              {[styles.boxNodesNailWide]: (this.props.unitBasic.marksList.length > 1)}
            )}>
            {this._render_nails_nouns()}
          </div>
        </Link>
      </div>
    )
  }
}

class MarksFive extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    //the mark(s), would be put in a rectangle 5vw left to right border,
    //but start from the bottom corner(beneath the img)
    let marksDOM = [];
    const plainDOM = (num)=>{ //the plain block used to fill in the empty place
      return(
        <div
          key={"key_nailInspired_plain_"+num+"_ofUnit_"+this.props.unitId}
          className={styles.boxMark}/>
      )
    };

    //First, render the mark, only the first 5
    //remember to add a 'hint' in the fututre if there are more than 5
    for(let i=0 ; i< this.props.unitBasic.marksList.length && i< 5; i++){
      let markKey = this.props.unitBasic.marksList[i]
      marksDOM.push(
        <div
          key={"key_nailInspired_mark_"+i+"_ofUnit_"+this.props.unitId}
          className={classnames(styles.boxMark, 'fontNailMark', styles.fontMark)}>
          <Link
            to={{
              pathname: this.props.match.url+"/unit",
              search: '?theater&unitId='+this.props.unitId+"&mark="+markKey,
              state: {from: this.props.location}
            }}
            value={markKey}
            className={classnames('plainLinkButton', styles.boxContent)}
            style={(this.props.overContent==markKey) ? {outline: 'double 1.5px #777777'}: {}}
            onMouseOver={this.props._handleOver_Content}
            onMouseOut={this.props._handleOut_Content}>
            <DisplayMarkPreview
              rawContent={this.props.marksBasic[markKey].editorContent}/>
          </Link>
        </div>
      );
    };

    //than, important! add the filling,
    //1 or 2 depend on the number of the marks,
    //2 filings would render the empty place next to the Nodes.
    //It is desired if there are even number of marks.
    if(!!(this.props.unitBasic.marksList.length % 2)) marksDOM.unshift(plainDOM(0))
    else {marksDOM.unshift(plainDOM(1)); marksDOM.unshift(plainDOM(0)); };

    return marksDOM;

  }
}


const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
    nounsBasic: state.nounsBasic,
    usersBasic: state.usersBasic
  }
}

export default withRouter(connect(
  mapStateToProps,
  null
)(NailInspired));
