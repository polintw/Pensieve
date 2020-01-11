import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import stylesMatch from '../styles.module.css';
import stylesMain from "../../styles.module.css"; //Notice, we use shared css file here for easier control
import {NodeSearchModule} from '../../../../../Component/NodeSearchModule.jsx';


class NodeWished extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      settingModal: false,
      onNode: false,
      onType: false,
      onDel: false
    };
    this._render_nodeLink = this._render_nodeLink.bind(this);
    this._render_nodeStatus = this._render_nodeStatus.bind(this);
    this._handleClick_wish_set = this._handleClick_wish_set.bind(this);
    this._handleClick_wish_delete = this._handleClick_wish_delete.bind(this);
    this._handleMouseOn_Type = this._handleMouseOn_Type.bind(this);
    this._handleMouseOn_Node = ()=> this.setState((prevState,props)=>{return {onNode: prevState.onNode?false:true}});
    this._handleMouseOn_Del = ()=> this.setState((prevState,props)=>{return {onDel: prevState.onDel?false:true}});
    this._set_settingModal = ()=> this.setState((prevState, index)=>{return {settingModal: prevState.settingModal? false: true}});
    this.style={

    }
  }

  _handleMouseOn_Type(event){
    //change only when if the box was empty
    if(!this.props.wishedNode && !this.props.axios){
      this.setState((prevState, props)=>{
        return {onType: prevState.onType?false: true}
      });
    };
  }

  _handleClick_wish_set(event){
    event.preventDefault();
    event.stopPropagation();
    //could open node search if the box was empty
    if(!this.props.wishedNode && !this.props.axios) this._set_settingModal();
  }

  _handleClick_wish_delete(event){
    event.preventDefault();
    event.stopPropagation();
    if(!this.props.axios) this.props._submit_wish_remove(this.props.wishedNode);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  _render_nodeStatus(){
    let status = !this.props.nodeStatus['finished']? this.props.nodeStatus['taken'] ? 'taken': '' : 'finished';

    switch (status) {
      case 'taken':
        return (
          <div>
            {this.props.i18nUIString.catalog["descript_MatchNodes_demandTaken"]}
          </div>
        )
        break;
      case 'finished':
        return (
          <div>
            {"✔"}
          </div>
        )
        break;
      default:
        return null
    }
  }

  _render_nodeLink(){
    const nodeId = this.props.wishedNode;

    return (
      <div
        className={classnames(stylesMatch.boxNode)}>
        <Link
          to={"/cosmic/nodes/"+nodeId}
          className={classnames('plainLinkButton', stylesMatch.boxNodeLink)}
          onMouseEnter={this._handleMouseOn_Node}
          onMouseLeave={this._handleMouseOn_Node}>
          <div
            className={classnames(stylesMatch.boxNodeName, stylesMain.fontCorner)}>
            {
              this.state.onNode &&
              <span style={{
                  width: '74%', position: 'absolute', bottom: '10%', left: '5%',
                  borderBottom: 'solid 1px #ff7a5f'
                }}/>
            }
            {nodeId in this.props.nounsBasic ? (
              this.props.nounsBasic[nodeId].name) : (
                null
            )}
          </div>
        </Link>
      </div>
    )
  }

  render(){
    return(
      <div
        className={classnames(stylesMatch.boxNodeWished)}>
        {
          this.state.settingModal &&
          <div
            className={classnames(stylesMatch.boxSettingModal)}>
            <div
              className={classnames(stylesMatch.boxSettingType)}>
              <span
                className={classnames(stylesMatch.spanType, stylesMain.fontType)}
                style={{lineHeight: '3rem'}}>
                {this.props.i18nUIString.catalog["catagory_MatchNodes_wished"][0]}
              </span>
            </div>
            <NodeSearchModule
              type={"option"}
              _set_nodeChoice={this.props._set_choiceFromSearch}
              _set_SearchModal_switch={this._set_settingModal}
              _handleClick_SearchModal_switch={(e)=>{e.preventDefault();e.stopPropagation();this._set_settingModal();}}/>
          </div>
        }
        <div
          className={classnames(
            stylesMatch.boxNodeType,
            stylesMain.fontType,
            {[stylesMatch.fontOnType]: this.state.onType}
          )}
          style={{position: 'relative', marginBottom: '1.5rem'}}
          onClick={this._handleClick_wish_set}
          onMouseEnter={this._handleMouseOn_Type}
          onMouseLeave={this._handleMouseOn_Type}>
          <span>
            {(this.props.listIndex==2) ?
              this.props.i18nUIString.catalog["catagory_MatchNodes_wished"][1] :
              this.props.i18nUIString.catalog["catagory_MatchNodes_wished"][0]
            }
          </span>
          {
            this.props.wishedNode &&
            <div
              className={classnames(stylesMatch.boxSubmitWishDel, stylesMatch.fontSubmit)}
              style={{fontSize: '1rem', color: this.state.onDel? '#000000': 'rgb(110, 110, 110)'}}
              onMouseEnter={this._handleMouseOn_Del}
              onMouseLeave={this._handleMouseOn_Del}
              onClick={this._handleClick_wish_delete}>
              <span>
                {" ╳ "}
              </span>
            </div>
          }
        </div>
        {
          this.props.wishedNode && //we skip render if the node was 'undefined' or 'null', both meaning empty list
          this._render_nodeLink()
        }
        <div>
          {this._render_nodeStatus()}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
    i18nUIString: state.i18nUIString,
    nounsBasic: state.nounsBasic,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(NodeWished));
