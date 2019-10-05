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
      onImg: false
    };
    this.nailImgBox = React.createRef();
    this._render_nails_nouns = this._render_nails_nouns.bind(this);
    this._handleEnter_nailFrame = this._handleEnter_nailFrame.bind(this);
    this._handleLeave_nailFrame = this._handleLeave_nailFrame.bind(this);
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

  _handleEnter_nailFrame(e){
    this.setState({onFrame: true})
  }

  _handleLeave_nailFrame(e){
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
        )}
        onMouseEnter={this._handleEnter_nailFrame}
        onMouseLeave={this._handleLeave_nailFrame}>
        <Link
          to={{
            pathname: this.props.linkPath,
            search: '?theater&unitId='+this.props.unitId,
            state: {from: this.props.location}
          }}
          className={classnames('plainLinkButton', styles.boxUnit)}>
          <div
            ref={this.nailImgBox}
            className={styles.boxImg}
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
            className={styles.boxNodes}>
            {this._render_nails_nouns()}
          </div>
        </Link>
        <div
          className={classnames(styles.boxMarkPreview)}>
          {_render_Marks_Less5(this.props)}
        </div>

      </div>
    )
  }
}

function _render_Marks_Less5(props){
  //the mark(s), would be put in a rectangle 5vw left to right border,
  //but start from the bottom corner(beneath the img)
  let marksDOM = [];
  const plainDOM = (num)=>{ //the plain block used to fill in the empty place
    return(
      <div
        key={"key_nailInspired_plain_"+num+"_ofUnit_"+props.unitId}
        className={styles.boxMark}/>
    )
  };

  //First, render the mark, only the first 5
  //remember to add a 'hint' in the fututre if there are more than 5
  for(let i=0 ; i< props.unitBasic.marksList.length && i< 5; i++){
    let markKey = props.unitBasic.marksList[i]
    marksDOM.push(
      <div
        key={"key_nailInspired_mark_"+i+"_ofUnit_"+props.unitId}
        className={classnames(styles.boxMark, 'fontNailMark', styles.fontMark)}>
        <Link
          to={{
            pathname: props.match.url+"/unit",
            search: '?theater&unitId='+props.unitId+"&mark="+markKey,
            state: {from: props.location}
          }}
          className={classnames('plainLinkButton', styles.boxContent)}>
          <DisplayMarkPreview
            rawContent={props.marksBasic[markKey].editorContent}/>
        </Link>
      </div>
    );
  };

  //than, important! add the filling,
  //1 or 2 depend on the number of the marks,
  //2 filings would render the empty place next to the Nodes.
  //It is desired if there are even number of marks.
  if(!!(props.unitBasic.marksList.length % 2)) marksDOM.unshift(plainDOM(0))
  else {marksDOM.unshift(plainDOM(1)); marksDOM.unshift(plainDOM(0)); };

  return marksDOM;
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
