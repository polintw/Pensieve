import React from 'react';
import {
  Link,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import OutboundLinkView from './OutboundLink/OutboundLinkView.jsx';
import BtnLinkEdit from './OutboundLink/BtnLinkEdit.jsx';
import ContentEditor from './ContentEditor/ContentEditor.jsx';
import NodesView from './NodesEditor/NodesView/NodesView.jsx';
import AssignNodes from './NodesEditor/AssignNodes.jsx';
import AssignSwitch from './NodesEditor/AssignSwitch.jsx';
import Submit from './components/Submit/Submit.jsx';
import ImgImport from './components/ImgImport.jsx';

class EditingPanel extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      contentEditing: false,
      nodesShift: false,
      coverSrc: !!this.props.unitSet?this.props.unitSet.coverSrc:null,
      coverMarks: !!this.props.unitSet?this.props.unitSet.coverMarks:{list:[], data:{}},
      nodesSet: !!this.props.unitSet?this.props.unitSet.nodesSet:[],
      //beneath, is remaining for future use, and kept the parent comp to process submitting
      beneathSrc: null,
      beneathMarks: {list:[],data:{}},
      refsArr: [],
      outboundLinkObj: {},
      authorIdentity: 'userAccount'
    };
    this._set_newImgSrc = this._set_newImgSrc.bind(this);
    this._set_Mark_Complete = this._set_Mark_Complete.bind(this);
    this._set_statusEditing = this._set_statusEditing.bind(this);
    this._set_nodesEditView = this._set_nodesEditView.bind(this);
    this._submit_new_node = this._submit_new_node.bind(this);
    this._submit_newShare = this._submit_newShare.bind(this);
    this._submit_new_mainLink = this._submit_new_mainLink.bind(this);
    this._submit_deleteNodes= this._submit_deleteNodes.bind(this);
    this._render_importOrCover = this._render_importOrCover.bind(this);
    this._render_PanelView = this._render_PanelView.bind(this);
    this._set_authorIdentity = (chosenIdentity)=>{ this.setState({ authorIdentity: chosenIdentity}); };
  }

  _submit_new_mainLink(linkObj){
    this.setState((prevState, props)=>{
      return {
        outboundLinkObj: linkObj
      };
    })
  }

  _submit_new_node(nodesArr){
    /*
    'nodesArr' was an arr composed of a chain of 'node' objs,
    and could replace the prevState directly
    */
    this.setState((prevState, props)=>{
      return {
        nodesSet: nodesArr
      }
    })
  }

  _submit_deleteNodes(target){
    this.setState((prevState, props)=>{
      let targetArr = prevState.nodesSet;
      let updateArr = [];
      //'target' is an index mark the unwanted node
      updateArr = targetArr.slice(); // copy to prevent modified state
      updateArr.splice(target, 1);

      return {
        nodesSet: updateArr
      }
    })
  }

  _set_newImgSrc(dataURL){
    this.setState({
      coverSrc: dataURL,
    })
  }

  _set_Mark_Complete(markData, layer){
    this.setState((prevState, props) => {
      return {coverMarks: markData, contentEditing: false};
    });
  }

  _set_statusEditing(bool){
    this.setState((prevState, props)=>{
      return {
        contentEditing: bool
      }
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
    if(!newObj["coverSrc"] || newObj['nodesSet'].length < 1) { // the 'img' & 'node assigned to' are required
      this.props._set_warningDialog([{text: this.props.i18nUIString.catalog['message_CreateShare_basicRequireWarn'],style:{}}], 'warning');
      return;
    }else if(this.props.unitSubmitting){
      this.props._set_warningDialog([{text: "submit is processing, please hold on ...",style:{}}], 'warning');
      return;
    }else if(this.state.contentEditing){
      this.props._set_warningDialog([{text: "your edit hasn't completed.", style:{}}], 'warning');
      return;
    };
    //Then if everything is fine
    //seal the mark obj by fill in the lasr undetermined value, 'layer'
    newObj.coverMarks.list.forEach((markKey, index)=>{
      newObj.coverMarks.data[markKey].layer = 0;
    });
    // clean the outboundLinkObj to submit
    newObj["outboundLinkMain"] = ("urlString" in newObj.outboundLinkObj) ? newObj.outboundLinkObj['urlString'] : null;
    /*
    a part dealing with a depracated belong type, 'both', was removed from this section
    */

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
        <ImgImport
          _set_newImgSrc={this._set_newImgSrc}/>
      )
    }else{
      return(
        <ContentEditor
          editing={this.state.contentEditing}
          imgSrc={this.state.coverSrc}
          marks={this.state.coverMarks}
          _set_statusEditing={this._set_statusEditing}
          _set_Mark_Complete={this._set_Mark_Complete}
          _set_warningDialog={this.props._set_warningDialog}/>
      )
    }
  }

  _render_PanelView(){
    switch (this.state.nodesShift) {
      case 'nodeEditor':
        return (
          <div
            className={classnames(
              styles.boxContent,
              styles.boxContentWidth, styles.boxPanelHeight, styles.boxPanelPadding)}>
            <NodesView
              nodesSet={this.state.nodesSet}
              _submit_new_node={this._submit_new_node}
              _set_nodesEditView={this._set_nodesEditView}/>
          </div>
        )
        break;
      case 'outboundLink':
        return (
          <div
            className={classnames(
              styles.boxContent,
              styles.boxContentWidth, styles.boxPanelHeight, styles.boxPanelPadding)}>
              <OutboundLinkView
                _submit_new_mainLink={this._submit_new_mainLink}
                _set_nodesEditView={this._set_nodesEditView}/>
          </div>
        )
        break;
      default:
        return (
          <div
            className={classnames(
              styles.boxContent,
              styles.boxContentWidth, styles.boxPanelHeight, styles.boxPanelPadding)}>
            <div
              className={classnames(styles.boxSubmit)}>
              <Submit
                editing={this.state.contentEditing}
                authorIdentity={this.state.authorIdentity}
                contentPermit={(!this.state["coverSrc"] || this.state['nodesSet'].length < 1) ? false : true}
                confirmDialog={!!this.props.confirmDialog ? this.props.confirmDialog : false}
                warningDialog={!!this.props.warningDialog ? this.props.warningDialog : false}
                _set_Clear={this.props._set_Clear}
                _set_authorIdentity = {this._set_authorIdentity}
                _submit_newShare={this._submit_newShare} />
            </div>
            <div
              className={classnames(styles.boxFrame)}>
              {this._render_importOrCover()}
            </div>
            <div
              className={classnames(styles.boxNodesList)}>
              <div
                className={classnames(styles.boxSubtitle, "fontContent", "colorEditLightBlack")}>
                {this.props.i18nUIString.catalog["guidingCreateShare_AssignGroup"]}
              </div>
              <div
                className={classnames(styles.boxAssignedNodes)}>
                <div style={{flex: '1'}}>
                  <AssignNodes
                    nodesSet={this.state.nodesSet}
                    nodeDelete={false}
                    _submit_deleteNodes={this._submit_deleteNodes} />
                  <AssignSwitch
                    nodesSet={this.state.nodesSet}
                    _set_nodesEditView={this._set_nodesEditView}/>
                </div>
                <div
                  className={classnames(styles.boxNodesRowBtnLink)}>
                  <BtnLinkEdit
                    outboundLinkObj={this.state.outboundLinkObj}
                    _set_nodesEditView={this._set_nodesEditView}/>
                </div>
              </div>
            </div>
          </div>
        )
    }
  }

  render(){
    return(
      <div
        className={classnames(styles.comEditingPanel)}
        onClick={(e)=>{e.preventDefault();e.stopPropagation();/*prevent bubbling to bg of wherever it was called*/}}>
        {
          this._render_PanelView()
        }

        {
          this.props.unitSubmitting &&
          <div
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: '0',
              left:'0',
              backgroundColor: 'rgba(230,230,230,0.5)'
            }}
            onClick={(e)=>{e.preventDefault(); e.stopPropagation();}}/>
        }
      </div>
    )
  }

  _set_nodesEditView(viewStr){
    this.setState((prevState, props)=>{
      return {
        nodesShift: viewStr
      };
    })
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    unitSubmitting: state.unitSubmitting,
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
