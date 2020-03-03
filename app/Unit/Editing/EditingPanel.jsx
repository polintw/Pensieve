import React from 'react';
import {
  Link,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import ContentEditor from './ContentEditor/ContentEditor.jsx';
import NodesEditor from './NodesEditor/NodesEditor.jsx';
import Submit from './components/Submit.jsx';
import ImgImport from './components/ImgImport.jsx';

class EditingPanel extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      coverSrc: !!this.props.unitSet?this.props.unitSet.coverSrc:null,
      coverMarks: !!this.props.unitSet?this.props.unitSet.coverMarks:{list:[], data:{}},
      contentEditing: false,
      nouns: this.props.unitSet?this.props.unitSet.nouns:{list:[],basic:{}}

      //beneath, is remaining for future use, and kept the parent comp to process submitting
      beneathSrc: null,
      beneathMarks: {list:[],data:{}},
      refsArr: []
    };
    this._set_newImgSrc = this._set_newImgSrc.bind(this);
    this._set_img_delete = this._set_img_delete.bind(this);
    this._set_Mark_Complete = this._set_Mark_Complete.bind(this);
    this._set_statusEditing = this._set_statusEditing.bind(this);
    this._submit_newShare = this._submit_newShare.bind(this);
    this._render_importOrCover = this._render_importOrCover.bind(this);
  }

  _set_newImgSrc(dataURL){
    this.setState({
      coverSrc: dataURL,
      contentEditing: true //going to edit directly
    })
  }

  _set_img_delete(){
    /*
      Currently only has layer 'cover',
      so we delete all process related to 'beneath' (refer to previous ver.)
    */
    this.setState((prevState, props)=>{
      let modifiedState = {
        coverSrc: null,
        coverMarks:{list:[], data:{}},
        contentEditing: false
      };

      return modifiedState;
    })
  }

  _set_Mark_Complete(markData, layer){
    this.setState((prevState, props) => {
      return {coverMarks: markData, contentEditing: false};
    });
  }

  _set_statusEditing(bool){
    this.setState((prevState, props)=>{
      return (
        contentEditing: bool
      )
    });
  }

  _submit_newShare(){
    //shallow copy, prevent render init during the modifications
    let newObj = Object.assign({}, this.state);
    /*
      Going to check everything:
      - if the obj contain cover & nodes: give warn
      - no Unit was submitting: give warn
      - not editing: give warn
    */
    if(!newObj["coverSrc"] || newObj["nouns"]["list"].length < 1) {
      this.props._set_warningDialog("make sure you've already upload 1 image and set at least 1 Node.", 'warning'});
      return;
    }else if(this.props.unitSubmitting){
      this.props._set_warningDialog('submit is processing, please hold on ...', 'warning'});
      return;
    }else if(this.state.editing){
      this.props._set_warningDialog("your edit hasn't completed.", 'warning'});
      return;
    };
    //Then if everything is fine
    //seal the mark obj by fill in the lasr undetermined value, 'layer'
    newObj.coverMarks.list.forEach((markKey, index)=>{
      newObj.coverMarks.data[markKey].layer='0';
    });

    this.props._set_Submit(newObj);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  _render_importOrCover(){
    if(!this.state.coverSrc ){
      return(
        <div
          className={styleMiddle.imgBLockButton}
          style={Object.assign({},{top: '14%'})}>
          <ImgImport
            _set_newImgSrc={this._set_newImgSrc}/>
        </div>
      )
    }else{
      return(
        <ContentEditor
          editing={this.state.contentEditing}
          imgSrc={this.state.coverSrc}
          marks={this.state.coverMarks}
          _set_statusEditing={this._set_statusEditing}
          _set_Mark_Complete={this._set_Mark_Complete}
          _set_delete={this._set_img_delete}/>
      )
    }
  }

  render(){
    return(
      <div
        className={classnames(styles.comEditingPanel)}>
        <div>
          {this._render_importOrCover()}
        </div>

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
            editing={this.state.contentEditing}
            confirmDialog={this.props.confirmDialog}
            warningDialog={this.props.warningDialog}
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
