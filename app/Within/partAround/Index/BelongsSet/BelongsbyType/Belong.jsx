import React from 'react';
import {
  Link,
  withRouter,
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import stylesFont from "../../../stylesFont.module.css"; //Notice, we use shared css file here for easier control


class Belong extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onNode: false,
      onEdit: false,
    };
    this._render_type = this._render_type.bind(this);
    this._render_nodeLink = this._render_nodeLink.bind(this);
    this._handleClick_belongEdit = this._handleClick_belongEdit.bind(this);
    this._handleMouseOn_Edit = ()=> this.setState((prevState,props)=>{return {onEdit: prevState.onEdit?false:true}});
  }

  _handleClick_belongEdit(event){
    event.preventDefault();
    event.stopPropagation();

    this.props._set_searchModal(this.props.type);
  }


  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  _render_nodeLink(){
    //determine the id of current node
    const nodeId = this.props.belongsByType[this.props.type];

    return (
      <div className={classnames(styles.boxNode)}>
        <span
          className={classnames(
            styles.spanNode,
            stylesFont.fontNodesTitle,
            stylesFont.colorEditBlack
          )}>
          {nodeId in this.props.nounsBasic ? (
            this.props.nounsBasic[nodeId].name) : (
              null
            )}
          </span>
        </div>
    )
  }

  _render_type(){
    return (
      <div
        title={this.props.i18nUIString.catalog["descript_BelongTypeInteract"][0]+this.props.type+this.props.i18nUIString.catalog["descript_BelongTypeInteract"][1]}
        className={classnames(styles.boxTitleType)}>
        <span
          className={classnames(styles.spanType, stylesFont.colorEditLightBlack, stylesFont.fontHint)}>
          { (this.props.type=="residence") ? "Current Stay" : this.props.type}</span>
      </div>
    )
  }

  render(){

    return(
      <div
        className={classnames(styles.comBelong)}>

        <div
          className={classnames(styles.boxCornerTitle)}>
          {
            !!(this.props.type in this.props.belongsByType) &&
            this._render_nodeLink()
          }
        </div>
        <div
          className={classnames(styles.boxCategory)}>
          {this._render_type()}
          <div
            onMouseEnter={this._handleMouseOn_Edit}
            onMouseLeave={this._handleMouseOn_Edit}
            onClick={this._handleClick_belongEdit}>
            <span
              className={classnames(
                styles.spanEdit,
                stylesFont.fontHint,
                stylesFont.colorWhiteGrey
              )}
              style={ this.state.onEdit ? {color: "#757575"}:{} }>
              {this.props.i18nUIString.catalog["submit_edit"]}
            </span>
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
    nounsBasic: state.nounsBasic,
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
)(Belong));
