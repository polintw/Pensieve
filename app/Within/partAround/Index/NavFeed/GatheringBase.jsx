import React from 'react';
import {
  Link,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";

class GatheringBase extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onNodeLink: false
    };
    this._render_belongedNodes = this._render_belongedNodes.bind(this);
    this._handleEnter_NodeLink = this._handleEnter_NodeLink.bind(this);
    this._handleLeave_NodeLink = this._handleLeave_NodeLink.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  _render_belongedNodes(){
    let belongedNodes = this.props.belongsByType.setTypesList.map((type, index)=>{
      let nodeId = this.props.belongsByType[type];
      return (
        <Link
          key={'key_NavBelongSeries_' + type +"_"+ nodeId}
          belongtype={type}
          to={"/cosmic/explore/node?nodeid="+nodeId}
          className={classnames( 'plainLinkButton')}
          style={{display: 'inline-block', padding: '0 5px'}}
          onMouseEnter={this._handleEnter_NodeLink}
          onMouseLeave={this._handleLeave_NodeLink}>
          {(nodeId in this.props.nounsBasic) &&
            <span
              className={classnames(
                "fontContentPlain", "weightBold", "colorEditBlack",
                styles.spanBaseNode,
                {[styles.spanBaseNodeMouse]: this.state.onNodeLink == type}
              )}>
              {this.props.nounsBasic[nodeId].name}</span>
          }
        </Link>
      );
    });

    return belongedNodes;
  }


  render(){
    return(
      <div>
        <div>
          <span
            className={classnames('colorEditLightBlack', 'fontContent')}
            style={{padding: '0 5px'}}>
            {this.props.i18nUIString.catalog["hint_FeedAssigned_belongedBase"]}
          </span>
        </div>
        <div
          className={classnames(styles.boxBasedNodes)}>
          {this._render_belongedNodes()}
        </div>
      </div>
    )
  }

  _handleEnter_NodeLink(e){
    let targetNode= e.currentTarget.getAttribute('belongtype');
    this.setState({onNodeLink: targetNode})
  }

  _handleLeave_NodeLink(e){
    this.setState({onNodeLink: false})
  }

}

const mapStateToProps = (state)=>{
  return {
    i18nUIString: state.i18nUIString,
    belongsByType: state.belongsByType,
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
)(GatheringBase));
