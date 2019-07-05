import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import ImgPreview from '../../ImgPreview.jsx';
import DisplayMarkPreview from '../../Draft/DisplayMarkPreview.jsx';
import styles from "./styles.module.css";
import {
  renderNodesTitle
} from '../utils.js';

class NailWideDisplay extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.nailImgBox = React.createRef();
    this.nailUnitLink = React.createRef();
    this._render_nails_Marks = this._render_nails_Marks.bind(this);
    this._render_nails_nouns = this._render_nails_nouns.bind(this);
    this.style={

    }
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
          className={classnames(styles.boxMark, styles.fontMark)}>
          <DisplayMarkPreview
            rawContent={self.props.marksBasic[key].editorContent}/>
        </div>
      )
    }
    return marksDOM;
  }

  _render_nails_nouns(){
    let nodesDOM = renderNodesTitle(this.props, styles);

    return nodesDOM;
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    return(
      <div
        className={styles.frame}>
        <Link
          ref={this.nailUnitLink}
          to={{
            pathname: "/units/"+this.props.unitId,
            state: {from: this.props.location}
          }}
          className={classnames('plainLinkButton', styles.frame)}>
          <div className={styles.boxMarkArea}></div>
          <div
            className={classnames(styles.boxMarkPreview)}>
            {this._render_nails_Marks()}
          </div>
          <div
            ref={this.nailImgBox}
            className={styles.boxImg}>
            <ImgPreview
              blockName={''}
              previewSrc={'/router/img/'+this.props.unitBasic.pic_layer0+'?type=thumb'}
              _handleClick_ImgPreview_preview={()=>{this.nailImgBox.current.click()}}/>
          </div>
          <div
            className={classnames(styles.boxNodes)}>
            {this._render_nails_nouns()}
          </div>
          <div className={styles.boxAuthor}>
            <span
              className={styles.fontAuthor}>
              {this.props.unitBasic.authorId in this.props.usersBasic ? this.props.usersBasic[this.props.unitBasic.authorId].account:null}
            </span>
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
)(NailWideDisplay));
