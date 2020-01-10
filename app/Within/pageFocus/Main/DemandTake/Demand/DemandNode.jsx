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
    this._handleMouseOn_NodeText = ()=> this.setState((prevState,props)=>{return {onNodeText: prevState.onNodeText?false:true}});
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
        className={classnames(
          styles.boxNodeName,
          stylesMain.fontOption,
          stylesMain.colorFstAssist)}
        style={this.state.onNode? {color: 'rgba(196, 196, 196,0.9)'}:{}}>
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
        className={classnames(styles.boxNode)}
        onMouseEnter={this._handleMouseOn_Node}
        onMouseLeave={this._handleMouseOn_Node}>
        {this._render_nodeLink()}
        {
          this.state.onNode &&
          <div
            className={classnames(styles.boxNodeSubmit, stylesMain.fontSubmit)}
            style={{fontWeight: '700'}}
            onClick={this._handleClick_nodeTaken}>
            <span
              className={classnames(styles.spanNodeSubmit)}
              style={this.state.onNodeText? {color: '#ff7a5f'}: {}}
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
