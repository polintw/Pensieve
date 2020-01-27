import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import stylesMain from "../styles.module.css"; //Notice, we use shared css file here for easier control

class SupplyNode extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onNode: false,
      onDemand: false
    };
    this._render_nodeLink = this._render_nodeLink.bind(this);
    this._render_submitButton = this._render_submitButton.bind(this);
    this._handleClick_nodeSupply = this._handleClick_nodeSupply.bind(this);
    this._handleMouseOn_Node = ()=> this.setState((prevState,props)=>{return {onNode: prevState.onNode?false:true}});
    this._handleMouseOn_demand = ()=> this.setState((prevState,props)=>{return {onDemand: prevState.onDemand?false:true}});
    this.style={

    }
  }

  _handleClick_nodeSupply(event){
    event.preventDefault();
    event.stopPropagation();
    const nodeId = this.props.displayingNode;
    //distinguish order or list me
    if(this.props.supplyStatus) this.props._submit_order(nodeId) //if under order, submit directly
    else{ //'list me'
      //if under list me, check the waitingStatus first to decide submit or remove
      this.props.waitingStatus? this.props._submit_waiting_remove(nodeId) : this.props._submit_waiting(nodeId);
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  _render_submitButton(){
    return (
      <div
        className={classnames(styles.boxNodeSubmit, stylesMain.fontSubmit, stylesMain.colorFstAssist)}
        style={this.state.onDemand? {color: '#ff7a5f'}:{}}
        onMouseEnter={this._handleMouseOn_demand}
        onMouseLeave={this._handleMouseOn_demand}
        onClick={this._handleClick_nodeSupply}>
        {
          this.props.supplyStatus ? (
            <span>
              {this.props.i18nUIString.catalog['link_Main_matchSupplyAction'][0]}
            </span>
          ):(
            <span>
              {this.props.i18nUIString.catalog['link_Main_matchSupplyAction'][1]}
            </span>
          )
        }
      </div>
    )
  }

  _render_nodeLink(){
    const nodeId = this.props.displayingNode;

    return (
      <Link
        to={"/cosmic/nodes/"+nodeId}
        className={classnames('plainLinkButton', styles.boxNodeLink)}
        onMouseEnter={this._handleMouseOn_Node}
        onMouseLeave={this._handleMouseOn_Node}>
        <div
          className={classnames(styles.boxNodeName, stylesMain.fontOption)}>
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
    )
  }

  render(){
    return(
      <div
        className={classnames(styles.boxNode)}>
        {this._render_nodeLink()}
        {this._render_submitButton()}
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    i18nUIString: state.i18nUIString,
    nounsBasic: state.nounsBasic,
    indexLists: state.indexLists
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(SupplyNode));
