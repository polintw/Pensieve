import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import SharedStatics from './SharedStatics.jsx';
import ImgPreview from '../../ImgPreview.jsx';
import DisplayMarkPreview from '../../Draft/DisplayMarkPreview.jsx';
import DraftDisplay from '../../Draft/DraftDisplay.jsx';
import {SvgBulbPlainHalf} from '../../Svg/SvgBulb.jsx';
import {
  renderNodesRows
} from '../utils.js';

class NailShared extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onFrame: false,
      onImg: false
    };
    this.nailImgBox = React.createRef();
    this._handleEnter_nailFrame = this._handleEnter_nailFrame.bind(this);
    this._handleLeave_nailFrame = this._handleLeave_nailFrame.bind(this);
    this._handleEnter_nailImg = this._handleEnter_nailImg.bind(this);
    this._handleLeave_nailImg = this._handleLeave_nailImg.bind(this);
    this._render_nails_Marks = this._render_nails_Marks.bind(this);
    this._render_nails_nouns = this._render_nails_nouns.bind(this);
    this.style={
      Com_Nails_Shared_breach_button_: {
        fontSize: '1.28rem',
        fontWeight: '300',
        letterSpacing: '0.22rem',
        color: 'grey',
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

  _render_nails_Marks(){
    let list = this.props.unitBasic.marksList;
    let marksDOM = [];
    const self = this;

    for(let i=0 ; i< list.length && i< 3; i++){
      let key = list[i]
      marksDOM.push(
        <div
          key={"key_nailcosmic_"+self.props.unitId+"_marks_"+i}
          className={classnames(styles.boxMark, 'fontNailMark', styles.fontMark)}>
          <DisplayMarkPreview
            rawContent={self.props.marksBasic[key].editorContent}/>
        </div>
      )
    }
    return marksDOM;
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
          className={classnames('plainLinkButton', styles.frame)}>
          <div
            className={classnames(styles.boxMarkPreview)}>
            {this._render_nails_Marks()}
          </div>
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
            <div
              className={classnames(styles.boxBreach)}>
              <Link
                to={{
                  pathname: this.props.linkPath,
                  search: '?theater&unitId='+this.props.unitId,
                  state: {from: this.props.location}
                }}
                className={classnames("plainLinkButton", styles.boxBreachItem, styles.boxHalfBulb)}
                style={Object.assign({}, this.style.Com_Nails_Shared_breach_button_, {
                  stroke:this.props.notifiedStatus.inspired?'#ff7a5f':'#aaaaaa',
                  strokeWidth: '10px',
                  fill:'none'
                })}>
                <SvgBulbPlainHalf/>
              </Link>
              <div
                className={classnames(styles.boxBreachItem, styles.boxStatics)}>
                <SharedStatics
                  unitId={this.props.unitId}/>
              </div>
            </div>

          </div>
          <div
            className={styles.boxNodes}>
            {this._render_nails_nouns()}
          </div>
        </Link>
      </div>
    )
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
)(NailShared));
