import React from 'react';
import {
  Link,
  withRouter,
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import stylesFont from "../../../stylesFont.module.css"; //Notice, we use shared css file here for easier control
import SearchModal from '../../../../../Components/NodesSearch/SearchModal/SearchModal.jsx';


class Belong extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onEdit: false,
      searchModal: false
    };
    this._render_type = this._render_type.bind(this);
    this._render_nodeLink = this._render_nodeLink.bind(this);
    this._set_searchModal = this._set_searchModal.bind(this);
    this._handleClick_belongEdit = this._handleClick_belongEdit.bind(this);
    this._set_ModalOnly = ()=>{this.setState((prevState,props)=>{ return {searchModal: prevState.searchModal ? false : true}; })};
    this._handleMouseOn_Edit = ()=> this.setState((prevState,props)=>{return {onEdit: prevState.onEdit?false:true}});
  }

  _handleClick_belongEdit(event){
    event.preventDefault();
    event.stopPropagation();

    this._set_searchModal(this.props.type);
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
    const typeParentList = (this.props.type== "homeland") ? "homelandup" : "residenceup";
    const firstParentId = (typeParentList in this.props.belongsByType) ? this.props.belongsByType[typeParentList]['listToTop'][0] : null;

    return (
      <div className={classnames(styles.boxNode)}>
        <div
          className={classnames( 'plainLinkButton')}>
          <span
            className={classnames(
              styles.spanNode,
              "fontNodesEqual", "weightBold","colorEditBlack")}>
            {nodeId in this.props.nounsBasic ? (
              this.props.nounsBasic[nodeId].name) : (
                null
              )}
            </span>
        </div>
        {
          !!(firstParentId in this.props.nounsBasic) &&
          <span
            className={classnames(styles.spanType, "colorEditBlack", "fontContent")}>
            { "/ " + this.props.nounsBasic[firstParentId].name }
          </span>
        }
        </div>
    )
  }

  _render_type(){
    return (
      <div
        title={this.props.i18nUIString.catalog["descript_BelongTypeInteract"][0]+this.props.type+this.props.i18nUIString.catalog["descript_BelongTypeInteract"][1]}
        className={classnames(styles.boxTitleType)}>
        <span
          className={classnames(styles.spanType, stylesFont.colorEditLightBlack, stylesFont.fontContent)}>
          { (this.props.type=="residence") ? "Current Stay" : this.props.type}</span>
      </div>
    )
  }

  render(){

    return(
      <div
        className={classnames(styles.comBelong)}>

        <div
          className={classnames(styles.boxCategory)}>
          {this._render_type()}
          {
            (this.props.userInfo.accountStatus != "newly") &&
            <div
              onMouseEnter={this._handleMouseOn_Edit}
              onMouseLeave={this._handleMouseOn_Edit}
              onClick={this._handleClick_belongEdit}>
              <span
                className={classnames(
                  styles.spanEdit,
                  stylesFont.fontContent,
                  stylesFont.colorWhiteGrey
                )}
                style={ this.state.onEdit ? {color: "#757575"}:{} }>
                {this.props.i18nUIString.catalog["submit_edit"]}
              </span>
            </div>
          }
        </div>
        <div
          className={classnames(styles.boxCornerTitle)}>
          {
            !!(this.props.type in this.props.belongsByType) &&
            this._render_nodeLink()
          }
        </div>

        {
          this.state.searchModal &&
          <div
            className={classnames(styles.boxSearchModal)}>
            <SearchModal
              settingType={this.props.type}
              _set_choiceAnType={this.props._set_choiceAnType}
              _set_searchModal={this._set_searchModal}
              _set_ModalOnly={this._set_ModalOnly}/>
          </div>
        }

      </div>
    )
  }

  _set_searchModal(settingType){
    this.props._set_Settingtype( !!settingType ? settingType: ''); //param 'settingType' could be empty if it was cancel or finished
    this.setState((prevState, props)=>{
      return {
        searchModal: prevState.searchModal ? false: true
      };
    });
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
