import React from 'react';
import {
  Link,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import ImgLayerEditing from './ImgLayerEditing.jsx';

const styleMiddle = {
  spanDestiny: {
    width: '100%',
    fontSize: '1.3rem',
    fontWeight: '400',
    letterSpacing: '0.1rem',
    textAlign: 'center',
    color: 'rgb(16, 16, 16)'
  }
}

class ContentEditor extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      imgWidth: "",
      imgHeight: "",
      marksList: [],
      markCircles: {},
      markEditorContent: {},
      markExpand: null,
      markExpandify: false
    };
    this._reset_expandState = ()=>{this.setState({markExpand: null, markExpandify: false});};
    this._set_markExpand = this._set_markExpand.bind(this);
    this._set_markNewSpot = this._set_markNewSpot.bind(this);
    this._set_markDelete = this._set_markDelete.bind(this);
    this._set_markUpdate_editor = this._set_markUpdate_editor.bind(this);
    this._handleClick_editingComplete = this._handleClick_editingComplete.bind(this);
    this._handleClick_img_delete =this._handleClick_img_delete.bind(this);
  }

  _set_markExpand(markKey){
    //no matter what situation, check if the parent comp knew we are editing.
    if(!this.props.editing) this.props._set_statusEditing(true); //_set_statusEditing() need a bool param.
    if(markKey !== this.state.markExpand){
      this.setState((prevState, props) => {return {markExpandify: false}}, ()=>{
        this.setState({markExpand: markKey, markExpandify: true});
      });
    }else if(markKey == this.state.markExpand){
      this._reset_expandState();
    }
  }

  _set_markNewSpot(portionCoordinate){
    //no matter what situation, check if the parent comp knew we are editing.
    if(!this.props.editing) this.props._set_statusEditing(true); //_set_statusEditing() need a bool param.

    let d = new Date(); //we need to create a specific id here, so we use time
    this.setState((prevState, props)=>{
      const tempId = this.props.layer+"_"+prevState.marksList.length+"_"+d.getTime(); //keep it "const" to assure the var would not change after push()
      prevState.markCircles[tempId] = portionCoordinate;
      prevState.markEditorContent[tempId] = null;
      prevState.marksList.push(tempId); // for unknown reason, we could only finish these steps outside the "return" obj
      return ({
        marksList: prevState.marksList,
        markCircles: prevState.markCircles,
        markEditorContent: prevState.markEditorContent,
        markExpand: (tempId),
        markExpandify: true
      })
    });
  }

  _set_markDelete(key){
    delete this.state.markCircles[key];
    delete this.state.markEditorContent[key];
    let indexTar = this.state.marksList.indexOf(key);
    this.state.marksList.splice(indexTar, 1);
    this._reset_expandState();
  }

  _set_markUpdate_editor(contentRaw, key){
    this.state.markEditorContent[key]=contentRaw;
  }

  _handleClick_editingComplete(event){
    event.stopPropagation();
    event.preventDefault();
    if(this.state.markExpandify) return;
    let marksData = {list:[], data:{}};
    this.state.marksList.forEach((markKey, index)=>{
      marksData["data"][markKey] = {
        top: this.state.markCircles[markKey].top,
        left: this.state.markCircles[markKey].left,
        editorContent: this.state.markEditorContent[markKey],
        layer: '',
        serial: index
      };
      marksData["list"].push(markKey)
    })
    this.props._set_Mark_Complete(marksData);
  }

  _handleClick_img_delete(event){
    event.stopPropagation();
    event.preventDefault();
    if(this.state.markExpandify) return;
    this.props._set_delete();
  }

  componentDidMount(){
    const self = this;
    let circles = {},
        editorContent = {};
    //We don't know if this was a new one, or editing an old one,
    //so we set the whole state by props at the begining.
    this.props.marks.list.forEach(function(key, index){
      circles[key] = {top: self.props.marks.data[key].top, left: self.props.marks.data[key].left}
      editorContent[key] = self.props.marks.data[key].editorContent
    });
    this.setState((prevState, props)=>{
      return {
        marksList: props.marks.list,
        markCircles: circles,
        markEditorContent: editorContent,
      };
    })
  }

  render(){
    return(
      <div
        className={classnames(styles.comContentEditor)}>
        {
          this.props.editing &&
          <div
            className={classnames('boxAbsoluteFull', styles.boxEditingBack)}>
            <div
              className={classnames(
                styles.boxButtonComplete,
                styles.roundRecBox,
                {[this.state.markExpandify]: styles.boxSubmitInvalid}
              )}
              style={Object.assign({}, {backgroundColor:'#ff7a5f'})}
              onClick={this._handleClick_editingComplete}>
              <span
                className={'centerAlignChild'}
                style={styleMiddle.spanDestiny}>
                {"complete"}</span>
            </div>
          </div>
        }
        <div
          className={classnames(styles.boxImgFrame)}>
          <ImgLayerEditing
            imgSrc={this.props.imgSrc}
            currentMark={this.state.markExpand}
            markOpened={this.state.markExpandify}
            marksList={this.state.marksList}
            markCircles={this.state.markCircles}
            markEditorContent={this.state.markEditorContent}
            _set_Markvisible={this._set_markExpand}
            _set_markNewSpot={this._set_markNewSpot}
            _set_markUpdate_editor={this._set_markUpdate_editor}
            _set_markDelete={this._set_markDelete}
            _reset_expandState={this._reset_expandState}
            _set_warningDialog={this.props._set_warningDialog}/>
          <div
            className={classnames(
              styles.boxSubmitDelete,
              {[this.state.markExpandify]: styles.boxSubmitInvalid}
            )}
            onClick={this._handleClick_img_delete}>
            <span
              className={'centerAlignChild'}
              style={styleMiddle.spanDestiny}>
              {' ╳ '}</span>

          </div>
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
)(ContentEditor));
