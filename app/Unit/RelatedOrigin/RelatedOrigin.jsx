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
    maxHeight: '72%',
    position: 'absolute',
    bottom: '16%',
    right: '0',
    boxSizing: 'border-box',
    padding: '0 3%'
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
        className={classnames('boxRelativeFull')}>
        {
          (this.props.unitCurrent.coverSrc) ? (
            <div>
              <Link
                to={{
                  pathname: this.props.match.url+"/units/"+this.props.unitCurrent.unitId,
                  search: '?theater',
                  state: {from: this.props.location.state.from}
                }}
                className={'plainLinkButton'}>
                <div
                  ref={this.originImgBox}>
                  <ImgPreview
                    blockName={''}
                    previewSrc={'/router/img/'+this.props.unitCurrent.coverSrc+'?type=thumb'}
                    _handleClick_ImgPreview_preview={()=>{this.originImgBox.current.click()}}/>
                  <div style={styleMiddle.Com_Nails_Basic_pic_mask}/>
                  <div
                    style={styleMiddle.Com_Nails_Basic_content_}>
                    {this._render_origin_Marks()}
                  </div>
                  <div
                    className={styles.boxAuthor}>
                    <AccountPlate
                      size={'layer'}
                      accountFisrtName={this.props.unitCurrent.authorBasic.firstName}
                      accountLastName={this.props.unitCurrent.authorBasic.lastName}/>
                  </div>
                </div>
              </Link>
              <div
                className={styles.boxNodes}>
                <div
                  className={classnames('nodesListRela', style.boxListRela)}>
                  <NodesExtensible
                    nouns={this.props.unitCurrent.nouns}
                    styleItem= {{margin: '0 0 2.32rem'}}
                    _handleClick_listNoun={this._refer_toNodes}/>
                </div>
              </div>
            </div>
          ):(
            <div>


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
