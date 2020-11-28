import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import NailMarksPreview from '../components/NailMarksPreview.jsx';
import ImgPreview from '../../ImgPreview.jsx';
import SvgPin from '../../Svg/SvgPin.jsx';
import {
  renderNodesRows,
  renderNodesRowsCustom
} from '../generators.js';
import {
  domain
} from '../../../../config/services.js';

class NailFeedFocus extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onFrame: false,
    };
    this.nailImgBox = React.createRef();
    this.nailUnitLink = React.createRef();
    this._handleEnter_nailFrame = this._handleEnter_nailFrame.bind(this);
    this._handleLeave_nailFrame = this._handleLeave_nailFrame.bind(this);
    this._render_nails_nouns = this._render_nails_nouns.bind(this);
    this._render_ContentBox = this._render_ContentBox.bind(this);
    this.style={

    }
  }

  _handleEnter_nailFrame(e){
    this.setState({onFrame: true})
  }

  _handleLeave_nailFrame(e){
    this.setState({onFrame: false})
  }

  _render_nails_nouns(){
    let customNodesTitle = !!this.props.customNodesTitle ? this.props.customNodesTitle : null;
    let nodesDOM = [];
    if(!!customNodesTitle){ nodesDOM = renderNodesRowsCustom(this.props, customNodesTitle)} // currently only GuideNails using, so render without check
    else nodesDOM = renderNodesRows(this.props, styles);

    return nodesDOM;
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    let linkSearch = ((this.props.location.search.length > 0) ? this.props.location.search+'&' : '?') +'unitId='+this.props.unitId+'&unitView=theater';

    return(
      <Link
        ref={this.nailUnitLink}
        to={{
          pathname: this.props.linkPath,
          search: linkSearch,
          state: {from: this.props.location}
        }}
        className={classnames(
          'plainLinkButton',
          styles.frame,
          styles.frmaeSmall,
          {[styles.frameOnMouse]: this.state.onFrame}
        )}
        onClick={(e)=>{if( !this.props.linkPath ){e.preventDefault();};/*a optional control, mean the parent want to take the refer control*/ }}
        onMouseEnter={this._handleEnter_nailFrame}
        onMouseLeave={this._handleLeave_nailFrame}>
        {this._render_ContentBox()}
      </Link>
    )
  }

  _render_ContentBox(){
    let contentBoxDOM = [];
    contentBoxDOM.push(contentBoxImg(this));
    this.props.leftimg ? contentBoxDOM.push(contentBoxMarks(this)) : contentBoxDOM.unshift(contentBoxMarks(this));
    return contentBoxDOM;
  }

}

const contentBoxImg = (self)=>{
  let imgSrcCover = domain.protocol+ '://'+domain.name+'/router/img/'+self.props.unitBasic.pic_layer0+'?type=thumb';

  return (
    <div
      key={"key_NailBoxImg_"+self.props.unitId}
      className={classnames(
        styles.boxContent,
        {[styles.boxContentNarrow]: self.props.narrowWidth}
      )}
      style={{width: '46.76%'} /* partio from BoxMark, which is 50% */ }>
      <div
        ref={self.nailImgBox}
        className={styles.boxImg}>
        <ImgPreview
          blockName={''}
          previewSrc={ imgSrcCover }
          _handleClick_ImgPreview_preview={()=>{self.nailImgBox.current.click()}}/>
      </div>
    </div>
  )
};
const contentBoxMarks = (self)=>{
  return (
    <div
      key={"key_NailBoxMarks_"+self.props.unitId}
      className={classnames(
        styles.boxContent,
        {[styles.boxContentNarrow]: self.props.narrowWidth}
      )}>
      <div
        className={classnames(styles.boxTitle)}>
        <div
          className={classnames(styles.boxTitlePin)}>
          <div
            style={{width: "11px", height: "16px"}}>
            <SvgPin
              mouseOn={self.state.onFrame}/>
          </div>
        </div>
        <div
          className={classnames(styles.boxNodes)}>
          {self._render_nails_nouns()}
        </div>
      </div>
      <div
        className={classnames(styles.boxPreview)}>
        <NailMarksPreview
          unitId={self.props.unitId}
          unitBasic={self.props.unitBasic}
          marksBasic={self.props.marksBasic}
          spotCount={false}
          smallCircle={true}/>
      </div>
    </div>
  )
};

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
    usersBasic: state.usersBasic
  }
}

export default withRouter(connect(
  mapStateToProps,
  null
)(NailFeedFocus));
