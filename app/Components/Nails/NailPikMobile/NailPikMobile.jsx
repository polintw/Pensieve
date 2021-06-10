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
import AccountPalette from '../../AccountPalette.jsx';
import SvgPin from '../../Svg/SvgPin.jsx';
import {SvgBulbInspired} from '../../Svg/SvgBulb.jsx';
import {
  renderNodesRows,
  renderNodesRowsCustom
} from '../generators.js';
import {
  domain
} from '../../../../config/services.js';

class NailPikMobile extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onFrame: false,
      onCount: this.props.unitBasic.marksList[0] // default preview the first mark
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
    let urlParams = new URLSearchParams(this.props.location.search); //we need value in URL query
    urlParams.delete('unitId'); // make sure only 1 unitId remain
    urlParams.append('unitId', this.props.unitId);
    urlParams.append('unitView', "theater");

    return(
      <Link
        ref={this.nailUnitLink}
        to={{
          pathname: this.props.linkPath,
          search: urlParams.toString(),
          state: {from: this.props.location}
        }}
        className={classnames(
          'plainLinkButton',
          styles.frame,
          {
            [styles.frameOnMouse]: this.state.onFrame}
        )}
        onClick={(e)=>{if( !this.props.linkPath ){e.preventDefault();};/*a optional control, mean the parent want to take the refer control*/ }}
        onTouchStart={this._handleEnter_nailFrame}
        onTouchEnd={this._handleLeave_nailFrame}
        onMouseEnter={this._handleEnter_nailFrame}
        onMouseLeave={this._handleLeave_nailFrame}>
        {this._render_ContentBox()}
      </Link>
    )
  }

  _render_ContentBox(){
    let contentBoxDOM = [];
    contentBoxDOM.push(contentBoxImg(this));
    contentBoxDOM.unshift(contentBoxMarks(this));
    return contentBoxDOM;
  }

}

const contentBoxImg = (self)=>{
  let imgSrcCover = domain.protocol+ '://'+domain.name+'/router/img/'+self.props.unitBasic.pic_layer0+'?type=thumb';

  return (
    <div
      key={"key_NailBoxImg_"+self.props.unitId}
      className={classnames(styles.boxContent)}>
      <div
        ref={self.nailImgBox}
        className={styles.boxImg}>
        <ImgPreview
          blockName={''}
          previewSrc={ imgSrcCover }
          _handleClick_ImgPreview_preview={()=>{self.nailImgBox.current.click()}}/>
          {
            self.props.inspiredBulb &&
            <div
              className={classnames(styles.boxImgIconandBack)}>
              <div
                className={classnames(styles.boxImgIcon)}>
                <SvgBulbInspired
                  colorClass={"smallLight"}
                  mouseReact={false}/>
              </div>
            </div>
          }
      </div>
    </div>
  )
};
const contentBoxMarks = (self)=>{
  return (
    <div
      key={"key_NailBoxMarks_"+self.props.unitId}
      className={classnames(styles.boxContentMobile)}>
      <div
        className={styles.boxMarkPreviewCounts}>
        {_render_MarkCounts(self)}
      </div>
    </div>
  )
};
const _render_MarkCounts = (self)=>{
  let list = self.props.unitBasic.marksList;
  let countsDOM = [];

  for(let i=0 ; i< list.length && i< 5; i++){
    let key = list[i];
    countsDOM.push(
      <div
        key={"key_nailMarksCount_"+i}
        markkey={key}
        className={classnames(styles.boxOvalCount)}
        style={{
          backgroundColor: (self.state.onCount == key) ? "rgba(240, 151, 22, 0.45)": "rgba(84, 84, 84, 0.45)",
          width: '24px',
          height: '24px',
        }}>
      </div>
    )
  };
  if(list.length == 0){
    return(
      <div
        key={"key_nail_" + self.props.unitId + "_mark"}
        className={classnames("fontContent", "colorGrey", "fontStyleItalic")}
        style={{height: '24px', textAlign: 'right'}}>
        {self.props.i18nUIString.catalog['descript_Nail_noMark']}
      </div>
    )
  };
  return countsDOM;
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    unitCurrent: state.unitCurrent,
    nounsBasic: state.nounsBasic,
    usersBasic: state.usersBasic
  }
}

export default withRouter(connect(
  mapStateToProps,
  null
)(NailPikMobile));
