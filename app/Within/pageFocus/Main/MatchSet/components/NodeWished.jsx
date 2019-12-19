import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';

import {NodeSearchModule} from '../../../../../Component/NodeSearchModule.jsx';


class NodeWished extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      settingModal: false,
      onNode: false,
      onType: false
    };
    this._render_nodeLink = this._render_nodeLink.bind(this);
    this._handleClick_wish_set = this._handleClick_wish_set.bind(this);
    this._handleClick_wish_delete = this._handleClick_wish_delete.bind(this);
    this._handleMouseOn_Node = ()=> this.setState((prevState,props)=>{return {onNode: prevState.onNode?false:true}});
    this._set_settingModal = ()=> this.setState((prevState, index)=>{return {settingModal: prevState.settingModal? false: true}});
    this.style={

    }
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

  _render_nodeLink(){
    const nodeId = this.props.wishedNode;

    return (
      <div
        className={classnames()}>
        <Link
          to={"/cosmic/nodes/"+nodeId}
          className={classnames('plainLinkButton')}
          onMouseEnter={this._handleMouseOn_Node}
          onMouseLeave={this._handleMouseOn_Node}>
          <div
            className={classnames()}>
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
        <div
          onClick={this._handleClick_wish_delete}>
          <span>
            {" ╳ "}
          </span>
        </div>

      </div>
    )
  }

  render(){

    return(
      <div
        className={classnames()}>
        {
          this.state.settingModal &&
          <div
            className={classnames()}>
            <div
              className={classnames()}>
              <span
                className={classnames()}
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
          onClick={this._handleClick_wish_set}>
          <span>
            {(this.props.listIndex==3) ?
              this.props.i18nUIString.catalog["catagory_MatchNodes_wished"][1] :
              this.props.i18nUIString.catalog["catagory_MatchNodes_wished"][0]
            }
          </span>
        </div>

        {
          this.props.wishedNode && //we skip render if the node was 'undefined' or 'null', both meaning empty list
          this._render_nodeLink()
        }

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
