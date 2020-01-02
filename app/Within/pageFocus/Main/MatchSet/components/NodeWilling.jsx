import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import stylesMatch from '../styles.module.css';
import stylesMain from "../../styles.module.css"; //Notice, we use shared css file here for easier control


class NodeWilling extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onNode: false,
    };
    this._render_nodeLink = this._render_nodeLink.bind(this);
    this._handleClick_nodeTaken = this._handleClick_nodeTaken.bind(this);
    this._handleClick_willing_delete = this._handleClick_willing_delete.bind(this);
    this._handleMouseOn_Node = ()=> this.setState((prevState,props)=>{return {onNode: prevState.onNode?false:true}});
    this.style={

    }
  }

  _handleClick_nodeTaken(event){
    event.preventDefault();
    event.stopPropagation();
    //any check would be process at higher level
    this.props._submit_taking(this.props.displayingNode);
  }

  _handleClick_willing_delete(event){
    event.preventDefault();
    event.stopPropagation();
    if(!this.props.axios) this.props._submit_remove(this.props.displayingNode);
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
        <div
          className={classnames(stylesMatch.boxNodeSubmit)}>
          <div
            className={classnames(stylesMain.fontSubmit)}
            onClick={this._handleClick_willing_delete}>
            <span>
              {this.props.i18nUIString.catalog["submit_remove"]}
            </span>
          </div>
          {
            this.props.demandStatus &&
            <div
              className={classnames(stylesMain.fontSubmit)}
              onClick={this._handleClick_nodeTaken}>
              <span>{'take'}</span>
            </div>
          }
        </div>

      </div>
    )
  }

  render(){
    return(
      <div
        className={classnames(stylesMatch.boxNodeWilling)}>
        {
          this.props.displayingNode && //we skip render if the node was 'undefined' or 'null', both meaning empty list
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
)(NodeWilling));
