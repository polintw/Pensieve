import React from 'react';
import {
  Link,
  withRouter,
  Redirect
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import {NodesExtensible} from '../NodesDisplay/NodesDisplay.jsx';
import {AccountPlate} from '../../Component/AccountPlate.jsx';
import ImgPreview from '../../Component/ImgPreview.jsx';
import DisplayMarkPreview from '../../Component/Draft/DisplayMarkPreview.jsx';

const styleMiddle = {
  Com_Nails_Basic_content_: {
    maxWidth: '80%',
    maxHeight: '30%',
    position: 'absolute',
    bottom: '10%',
    right: '0',
    boxSizing: 'border-box',
    padding: '0 3%',
    overflow: 'hidden'
  },
  pic_mask: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: '0',
    left: '0',
    backgroudColor: 'rgba(0,0,0,0.5)',
    backgroundImage: 'linear-gradient(172deg, transparent, rgba(0, 0, 0, 0.07), rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.17), rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.54), rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.66), rgba(0, 0, 0, 0.74))'
    //must beneath the 'backgroudColor', let browser choose if it do support gradient
  },
}

class RelatedOrigin extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.originImgBox = React.createRef();
    this._refer_toNodes = this._refer_toNodes.bind(this);
    this._render_origin_Marks = this._render_origin_Marks.bind(this);
    this.style={

    };
  }

  _refer_toNodes(source, identity){
    this.props._refer_von_unit(identity, source);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  _render_origin_Marks(){
    let list = this.props.unitCurrent.coverMarksList.concat(this.props.unitCurrent.beneathMarksList);
    let marksData = Object.assign({}, this.props.unitCurrent.coverMarksData, this.props.unitCurrent.beneathMarksData);
    let marksDOM = [];
    const self = this;

    for(let i=0 ; i< list.length && i< 3; i++){
      let key = list[i]
      marksDOM.push(
        <div
          key={"key_nailcosmic_"+self.props.unitCurrent.unitId+"_marks_"+i}
          className={classnames(styles.boxMark, 'fontContentSum')}>
          <DisplayMarkPreview
            rawContent={marksData[key].editorContent}/>
        </div>
      )
    }
    return marksDOM;
  }

  render(){
    //this component use data only from the props.unitCurrent, so there are something need to remember:
    //one is, there is case the unitCurrent would be empty, so render by coverSrc like UnitModal
    return(
      <div
        className={classnames(styles.comRelatedOrig)}>
        {
          (this.props.unitCurrent.coverSrc) ? (
            <div>
              <Link
                to={{
                  pathname: this.props.match.url,
                  search: '?theater&unitId='+this.props.unitCurrent.unitId,
                  state: {from: this.props.location.state.from}
                }}
                className={'plainLinkButton'}>
                <div
                  className={classnames(styles.boxPreview)}
                  ref={this.originImgBox}>
                  <ImgPreview
                    blockName={''}
                    previewSrc={this.props.unitCurrent.coverSrc}
                    _handleClick_ImgPreview_preview={()=>{this.originImgBox.current.click()}}/>
                  <div style={styleMiddle.pic_mask}/>
                  <div
                    style={styleMiddle.Com_Nails_Basic_content_}>
                    {this._render_origin_Marks()}
                  </div>
                </div>
              </Link>
              <div
                className={styles.boxAuthor}>
                <AccountPlate
                  size={'layer'}
                  accountFisrtName={this.props.unitCurrent.authorBasic.firstName}
                  accountLastName={this.props.unitCurrent.authorBasic.lastName}/>
              </div>
              <div
                className={styles.boxNodes}>
                <div
                  className={classnames('nodesListRela', styles.boxListRela)}>
                  <NodesExtensible
                    nouns={this.props.unitCurrent.nouns}
                    styleItem= {{margin: '0 0 2rem'}}
                    _handleClick_listNoun={this._refer_toNodes}/>
                </div>
              </div>
            </div>
          ):(
            <div
              className={'boxRelativeFull'}>
              <div
                style={{backgroundColor:'#F0F0F0',width: '20%', height: '20%', position: 'absolute', top: '40%', left: '40%'}}/>
            </div>
          )
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

const mapDispatchToProps = (dispatch)=>{
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(RelatedOrigin));
