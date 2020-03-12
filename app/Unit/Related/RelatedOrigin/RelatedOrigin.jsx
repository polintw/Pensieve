import React from 'react';
import {
  Link,
  withRouter,
  Redirect
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import {NodesExtensible} from '../../NodesDisplay/NodesExtensible.jsx';
import {AccountPalette} from '../../../Components/AccountPalette.jsx';
import ImgPreview from '../../../Components/ImgPreview.jsx';
//import DisplayMarkPreview from '../../../Components/Draft/DisplayMarkPreview.jsx';

const styleMiddle = {
  Com_Nails_Basic_content_: {
    width: '25%',
    maxHeight: '45%',
    position: 'absolute',
    bottom: '5%',
    right: '0',
    boxSizing: 'border-box',
    padding: '0 1% 0 4%',
    overflow: 'hidden'
  },
}

class RelatedOrigin extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onMouseEnter:false
    };
    this.originImgBox = React.createRef();
    this._refer_toNodes = this._refer_toNodes.bind(this);
    this._handleEnter_originBox = this._handleEnter_originBox.bind(this);
    this._handleLeave_originBox = this._handleLeave_originBox.bind(this);
    this._render_origin_Marks = this._render_origin_Marks.bind(this);
    this.style={

    };
  }

  _refer_toNodes(source, identity){
    this.props._refer_von_unit(identity, source);
  }

  _handleEnter_originBox(e){
    this.setState({onMouseEnter: true})
  }

  _handleLeave_originBox(e){
    this.setState({onMouseEnter: false})
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  _render_origin_Marks(){
    return ;
    /*

    Beneath, are the remain of the complete version,
    which has Summary layer.
    We just ignore it in simplified ver.

    let list = this.props.unitCurrent.coverMarksList.concat(this.props.unitCurrent.beneathMarksList);
    let marksData = Object.assign({}, this.props.unitCurrent.coverMarksData, this.props.unitCurrent.beneathMarksData);
    let marksDOM = [];
    const self = this;

    for(let i=0 ; i< list.length && i< 3; i++){
      let key = list[i]
      marksDOM.push(
        <div
          key={"key_nailcosmic_"+self.props.unitCurrent.unitId+"_marks_"+i}
          className={classnames(styles.boxMark, styles.fontMark)}>
          <DisplayMarkPreview
            rawContent={marksData[key].editorContent}/>
        </div>
      )
    }
    return marksDOM;
    */
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
                  state: this.props.location.state //keep the state as props, perhaps need to increase 'current location' for 'back' use
                }}
                className={classnames(
                  'plainLinkButton',
                  styles.linkOrigin,
                  {[styles.mouseOnPreview]: this.state.onMouseEnter}
                )}
                onMouseEnter={this._handleEnter_originBox}
                onMouseLeave={this._handleLeave_originBox}>
                <div
                  className={classnames(styles.boxPreview)}
                  ref={this.originImgBox}>
                  <ImgPreview
                    blockName={''}
                    previewSrc={this.props.unitCurrent.coverSrc}
                    _handleClick_ImgPreview_preview={()=>{this.originImgBox.current.click()}}/>
                  <div
                    className={classnames(
                      styles.boxMask,
                      {[styles.mouseOnImg]: this.state.onMouseEnter})}
                    />
                  <div
                    className={classnames(styles.boxAuthor, styles.fontAuthor)}>
                    <AccountPalette
                      size={'layer'}
                      accountFisrtName={this.props.unitCurrent.authorBasic.firstName}
                      accountLastName={this.props.unitCurrent.authorBasic.lastName}/>
                  </div>
                </div>
                <div
                  style={styleMiddle.Com_Nails_Basic_content_}>
                  {this._render_origin_Marks()}
                </div>
              </Link>
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
