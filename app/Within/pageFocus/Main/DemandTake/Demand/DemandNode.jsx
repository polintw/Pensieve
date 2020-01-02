import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import stylesMain from "../../styles.module.css"; //Notice, we use shared css file here for easier control

class DemandNode extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onNode: false,
      onNodeText: false
    };
    this._render_nodeLink = this._render_nodeLink.bind(this);
    this._handleClick_nodeTaken = this._handleClick_nodeTaken.bind(this);
    this._handleMouseOn_Node = ()=> this.setState((prevState,props)=>{return {onNode: prevState.onNode?false:true}});
    this._handleMouseOn_NodeText = ()=> this.setState((prevState,props)=>{return {onNodeText: prevState.onNode?false:true}});
    this.style={

    }
  }

  _handleClick_nodeTaken(event){
    event.preventDefault();
    event.stopPropagation();
    //any check would be process at higher level
    this.props._submit_taking(this.props.displayingNode);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  _render_nodeLink(){
    const nodeId = this.props.displayingNode;

    return (
      <div
        className={classnames(styles.boxNodeName, stylesMain.fontOption)}
        onMouseEnter={this._handleMouseOn_Node}
        onMouseLeave={this._handleMouseOn_Node}>
        {nodeId in this.props.nounsBasic ? (
          this.props.nounsBasic[nodeId].name) : (
            null
          )}
      </div>
    )
  }

  render(){
    return(
      <div
        className={classnames()}>
        {this._render_nodeLink()}
        {
          this.state.onNode &&
          <div
            className={classnames()}
            onClick={this._handleClick_nodeTaken}>
            <span
              className={classnames()}
              onMouseEnter={this._handleMouseOn_NodeText}
              onMouseLeave={this._handleMouseOn_NodeText}>
              {'take'}</span>
          </div>
        }
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
)(DemandNode));
