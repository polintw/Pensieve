import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styleNailBasic.module.css";
import ImgPreview from '../../ImgPreview.jsx';
import DraftDisplayforNailMark from '../../Draft/DraftDisplayforNailMark.jsx';

const commonStyle = {
  Com_Nails_Basic_pic_: {
    width: '100%',
    height: '70%',
    position: 'relative',
    boxSizing: 'border-box',
    overflow: 'hidden',
  },
  Com_Nails_Basic_banner_author: {
    position: 'relative',
    boxSizing: 'border-box',
    padding: '0 3%',
    margin: '8px 0 0',
    textAlign: 'right',
  },
  Com_Nails_Basic_content_: {
    maxWidth: '80%',
    maxHeight: '72%',
    position: 'absolute',
    bottom: '16%',
    right: '0',
    boxSizing: 'border-box',
    padding: '0 3%'
  },
  Com_Nails_Basic_content_mark: {
    width: '100%',
    position: 'relative',
    boxSizing: 'border-box',
    marginBottom: '0.28rem',
    textAlign: 'right', // prevent influence from parent
  },
  Com_Nails_Basic_pic_img: {
    display: 'block', // default value was 'inline-block', but sometime it would let it leave some blank
    width: '100%',
    height: 'auto'
  },
  Com_Nails_Basic_pic_mask: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: '0',
    left: '0',
    backgroudColor: 'rgba(0,0,0,0.5)',
    backgroundImage: 'linear-gradient(129deg, transparent, rgba(0, 0, 0, 0.06), rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.3),rgba(0, 0, 0, 0.42), rgba(0, 0, 0, 0.54), rgba(0, 0, 0, 0.64))'
    //must beneath the 'backgroudColor', let browser choose if it do support gradient
  },
  Com_Nails_Basic_nouns_: {
    width: '100%',
    height: '2.64rem', // match the font sizr of noun, let only show first line
    position: 'relative',
    boxSizing: 'border-box',
    padding: '1% 1%',
    margin: '6px 0 4px',
    overflow: 'hidden'
  },
  Com_Nails_Basic_nouns_div_: {
    display: 'inline-block',
    position: 'relative',
    boxSizing: 'border-box',
    marginLeft: '0.56rem',
    textAlign: 'left',
  }
}

class NailBasic extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
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
          className={styles.fontContent}
          style={commonStyle.Com_Nails_Basic_content_mark}>
          <DraftDisplayforNailMark
            rawContent={self.props.marksBasic[key].editorContent}/>
        </div>
      )
    }
    return marksDOM;
  }

  _render_nails_nouns(){
    let list = this.props.unitBasic.nounsList;
    let nounsDOM = [];

    list.forEach((id, index)=>{
      nounsDOM.push(
        <div
          key={"key_nailcosmic_"+this.props.unitId+"_nouns_"+index}
          className={styles.fontNouns}
          style={commonStyle.Com_Nails_Basic_nouns_div_}>
          {id in this.props.nounsBasic ? (
            this.props.nounsBasic[id].name+" .") : (
              null
            )}
        </div>
      )
    })
    return nounsDOM;
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    return(
      <div
        className={classnames(styles.Nails_Basic, 'boxRelativeFull')}>
        <Link
          to={{
            pathname: this.props.match.url+"/units/"+this.props.unitId,
            search: '?theater',
            state: {from: this.props.location}
          }}
          className={'plainLinkButton'}>
          <div
            style={commonStyle.Com_Nails_Basic_pic_}>
            <ImgPreview
              blockName={'cover'}
              previewSrc={'/router/img/'+this.props.unitBasic.pic_layer0+'?type=thumb'}
              _handleClick_ImgPreview_preview={()=>{}}/>
            <div style={commonStyle.Com_Nails_Basic_pic_mask}/>
            <div
              style={commonStyle.Com_Nails_Basic_content_}>
              {this._render_nails_Marks()}
            </div>
          </div>
          <div
            style={commonStyle.Com_Nails_Basic_nouns_}>
            {this._render_nails_nouns()}
          </div>
          <div
            className={styles.fontAccount}
            style={commonStyle.Com_Nails_Basic_banner_author}>
            {this.props.unitBasic.authorId in this.props.usersBasic ? this.props.usersBasic[this.props.unitBasic.authorId].account:null}
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
)(NailBasic));
