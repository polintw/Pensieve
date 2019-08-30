import React from 'react';
import {
  Link,
  withRouter,
  Redirect
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import {NodesExtensible} from './NodesDisplay/NodesDisplay.jsx';
import {AccountPlate} from '../Component/AccountPlate.jsx';
import ImgPreview from '../Component/ImgPreview.jsx';

const styleMiddle = {

}

class RelatedOrigin extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.nailImgBox = React.createRef();
    this._render_nails_Marks = this._render_nails_Marks.bind(this);
    this.style={

    };
  }

  _render_nails_Marks(){
    let list = this.props.unitCurrent.coverMarksList.concat(this.props.unitCurrent.beneathMarksList);
    let marksData = Object.assign({}, this.props.unitCurrent.coverMarksData, this.props.unitCurrent.beneathMarksData);
    let marksDOM = [];
    const self = this;

    for(let i=0 ; i< list.length && i< 3; i++){
      let key = list[i]
      marksDOM.push(
        <div
          key={"key_nailcosmic_"+self.props.unitId+"_marks_"+i}
          className={classnames(styles.boxMark, styles.fontMark)}>
          <DisplayMarkPreview
            rawContent={marksData[key].editorContent}/>
        </div>
      )
    }
    return marksDOM;
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  render(){
    //this component use data only from the props.unitCurrent, so there are something need to remember:
    //one is, there is case the unitCurrent would be empty, so render by coverSrc like UnitModal
    return(
      <div
        className={classnames(styles.Nails_Basic, 'boxRelativeFull')}>
        {
          (this.props.unitCurrent.coverSrc) ? (
            <Link
              to={{
                pathname: this.props.match.url+"/units/"+this.props.unitId,
                search: '?theater',
                state: {from: this.props.location.state.from}
              }}
              className={'plainLinkButton'}>
              <div
                ref={this.nailImgBox}>
                <ImgPreview
                  blockName={''}
                  previewSrc={'/router/img/'+this.props.unitCurrent.coverSrc+'?type=thumb'}
                  _handleClick_ImgPreview_preview={()=>{this.nailImgBox.current.click()}}/>
                <div style={commonStyle.Com_Nails_Basic_pic_mask}/>
                <div
                  style={commonStyle.Com_Nails_Basic_content_}>
                  {this._render_nails_Marks()}
                </div>
                <div
                  onClick={this._handleClick_Account}
                  style={Object.assign({}, this.style.Com_Unit_UnitImgLayers_commonSection_InfoPanel_blocks_,{marginBottom:'0.5rem',textAlign: 'right', cursor:'pointer'})}>
                  <AccountPlate
                    size={'layer'}
                    accountFisrtName={this.props.unitCurrent.authorBasic.firstName}
                    accountLastName={this.props.unitCurrent.authorBasic.lastName}/>
                </div>
              </div>
              <div
                style={commonStyle.Com_Nails_Basic_nouns_}>
                <div
                  className={'nodesListLayers'}
                  style={this.style.Com_Unit_UnitImgLayers_contentSection_links_nouns}>
                  <NodesExtensible
                    nouns={this.props.unitCurrent.nouns}
                    styleItem= {{margin: '0 0 2.32rem'}}
                    _handleClick_listNoun={this.props.}/>
                </div>
              </div>
            </Link>
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
