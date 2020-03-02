import React from 'react';
import {
  Link,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import ContentModal from './ContentModal/ContentModal.jsx';
import NodesEditor from './NodesEditor/NodesEditor.jsx';
import Submit from './components/Submit.jsx';
import ImgImport from './components/ImgImport.jsx';

class EditingPanel extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._render_importOrPreview = this._render_importOrPreview.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  _render_importOrPreview(){
    return(
      <div
        className={styleMiddle.imgBLockButton}
        style={Object.assign({},{top: '14%'})}>
        <ImgImport
          blockName={'cover'}
          _set_newImgSrc={this._set_newImgSrc}/>
      </div>
    )
  }

  render(){
    return(
      <div
        className={classnames(styles.comChain)}>
        <div
          style={this.style.Com_Modal_Editing_imgBlocks_}>
          {this._render_importOrPreview()}
        </div>

        <ContentModal
          creating={this.props.unitSet?false:true}
          layer={this.state.contentInit.focusBlock=='cover'?0:1}
          imgSrc={this.state.contentInit.focusBlock=='cover'?this.state.coverSrc:this.state.beneathSrc}
          marks={this.state.contentInit.focusBlock=='cover'?this.state.coverMarks:this.state.beneathMarks}
          markExpand={this.state.contentInit.markExpand}
          _set_refsArr={this.props._set_refsArr}
          _close_Mark_Complete={this._close_Mark_Complete}
          _close_img_Cancell={this._handleClick_Img_Delete}/>
        <div
          style={this.style.Com_Modal_Editing_Side_}>
          <NodesEditor
            settingType={this.state.settingType}
            _set_choiceAnType={this._set_choiceAnType}
            _set_searchModal={this._set_searchModal}/>

        </div>
        <div
          style={this.style.Com_Modal_Editing_Panel_}>
          <Submit
            warningModal={this.state.warningModal}
            articleEditing={this.state.articleEditing}
            _set_Clear={this.props._set_Clear}
            _submit_newShare={this._submit_newShare}
            _refer_toandclose={this.props._refer_toandclose}/>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    belongsByType: state.belongsByType
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(EditingPanel));
