import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import ImgPreview from '../../ImgPreview.jsx';
import {AccountPlate} from '../../AccountPlate.jsx';
import DisplayMarkPreview from '../../Draft/DisplayMarkPreview.jsx';
import styles from "./styles.module.css";
import {
  renderNodesRows
} from '../utils.js';

class NailBroaded extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onFrame: false,
      onImg: false
    };
    this.nailImgBox = React.createRef();
    this.nailUnitLink = React.createRef();
    this._handleEnter_nailFrame = this._handleEnter_nailFrame.bind(this);
    this._handleLeave_nailFrame = this._handleLeave_nailFrame.bind(this);
    this._handleEnter_nailImg = this._handleEnter_nailImg.bind(this);
    this._handleLeave_nailImg = this._handleLeave_nailImg.bind(this);
    this._render_nails_Marks = this._render_nails_Marks.bind(this);
    this._render_nails_nouns = this._render_nails_nouns.bind(this);
    this._render_nail_broads = this._render_nail_broads.bind(this);
    this.style={

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

  _render_nail_broads(){
    let list = this.props.broadsList,
        listDOM = [];

    for(let i=0; i< 2 && i< list.length; i++ ){
      let userId = list[i];

      listDOM.push(
        <div
          key={"key_Nail_BroadList_"+this.props.unitId+"_"+userId}
          className={classnames(styles.boxAccount, styles.fontAuthor)}>
          {
            (userId in this.props.usersBasic) &&
            <AccountPlate
              size={'layer'}
              accountFisrtName={this.props.usersBasic[userId].firstName}
              accountLastName={this.props.usersBasic[userId].lastName}
              styleFirst={{fontSize: '1.27rem', letterSpacing: '0.04rem'}}
              styleLast={{fontSize: '1.27rem', letterSpacing: '0.04rem'}}/>
          }
          {
            ((i+1) < list.length) &&
            "﹐"
          }
        </div>
      );
    }

    return (
      <div>
        {listDOM}
        <br/>
        {
          (list.length > 2) &&
          <span
            className={classnames(styles.fontBroads)}>
            {this.props.i18nUIString.catalog["descript_Nail_BroadList"][1]}
          </span>
        }
        <span
          className={classnames(styles.fontBroads)}>
          {this.props.i18nUIString.catalog["descript_Nail_BroadList"][0]}
        </span>
      </div>
    );
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
      <Link
        ref={this.nailUnitLink}
        to={{
          pathname: this.props.linkPath,
          search: '?theater&unitId='+this.props.unitId,
          state: {from: this.props.location}
        }}
        className={classnames(
          'plainLinkButton',
          styles.frame,
          {[styles.frameOnMouse]: this.state.onFrame}
        )}
        onMouseEnter={this._handleEnter_nailFrame}
        onMouseLeave={this._handleLeave_nailFrame}>
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
            className={classnames(styles.boxNodes)}>
            {this._render_nails_nouns()}
          </div>
        </div>
        <div
          className={classnames(styles.boxBroads)}>
          {this._render_nail_broads()}
        </div>
        <div
          className={classnames(styles.boxContent)}>
          <div
            className={classnames(styles.boxMarkPreview)}>
            {this._render_nails_Marks()}
          </div>
          <div className={styles.boxAuthor}>
            <span
              className={classnames('fontNailAuthor', styles.spanAuthor, styles.fontAuthor)}>
              {this.props.unitBasic.authorId in this.props.usersBasic ? this.props.usersBasic[this.props.unitBasic.authorId].account:null}
            </span>
          </div>
        </div>
      </Link>
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
)(NailBroaded));
