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
    this._set_editingComplete = this._set_editingComplete.bind(this);
  }

  _set_markExpand(markKey){
    //no matter what situation, check if the parent comp knew we are editing.
    if(markKey !== this.state.markExpand){
      if(!this.props.editing) this.props._set_statusEditing(true); //_set_statusEditing() need a bool param.
      this.setState((prevState, props) => {return {markExpandify: false}}, ()=>{
        this.setState({markExpand: markKey, markExpandify: true});
      });
    }
    else if(markKey == this.state.markExpand){ //the 'cancel' process, different from 'delete'
      this._reset_expandState();
      this.props._set_statusEditing(false); //_set_statusEditing() need a bool param.
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
    //notice here we "didn't" setState(), just 'saved' the data without re-render
    delete this.state.markCircles[key];
    delete this.state.markEditorContent[key];
    let indexTar = this.state.marksList.indexOf(key);
    this.state.marksList.splice(indexTar, 1);
    this._reset_expandState();
    this._set_editingComplete();
  }

  _set_markUpdate_editor(contentRaw, key){
    /*
    this processing structure was a reamining from previous ver., aiming to deal with 2 layers which has to open ContentEditor in a different modal.
    Now only 1 layer used, but keep this structure for the future.
    */
    this.state.markEditorContent[key]=contentRaw; //notice here we "didn't" setState(), just 'saved' the data without re-render
    this._reset_expandState();
    this._set_editingComplete();
  }


  _set_editingComplete(){
    /*
    this processing structure was a reamining from previous ver., aiming to deal with 2 layers which has to open ContentEditor in a different modal.
    Now only 1 layer used, but keep this structure for the future.
    */
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
          _set_warningDialog={this.props._set_warningDialog}/>
      </div>

    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitView: state.unitView,
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
