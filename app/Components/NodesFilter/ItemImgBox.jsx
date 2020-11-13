import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import ImgPreview from '../ImgPreview.jsx';
import {
  _axios_get_NodesLayer
} from './axios.js';
import {
  domain
} from '../../../config/services.js';

class NodesFilter extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this['filterNode' + this.props.nodeId] = React.createRef(); // make a ref for only this component
    this._handleClick_filterNode = this._handleClick_filterNode.bind(this);
    this._handleClick_switcNextLayer = this._handleClick_switcNextLayer.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  render(){
      const nodeId = this.props.nodeId;

      return (
          <div
              className={classnames(styles.boxNodeItem)}>
              <Link
                  to={this.props.linkObj}
                  ref={this["filterNode" + nodeId]}
                  className={classnames(
                      'plainLinkButton', styles.boxNodeItemLink)}
                  onClick={this._handleClick_filterNode}>
                  <div
                      className={styles.boxItemImg}>
                      <ImgPreview
                          blockName={''}
                          previewSrc={this.props.imgSrcCover}
                          _handleClick_ImgPreview_preview={() => { this["filterNode" + nodeId].current.click() }} />
                  </div>
                  <div
                      className={classnames(styles.boxItemTitle)}>
                      {
                          (nodeId in this.props.nounsBasic) &&
                          <div
                              className={classnames(styles.boxTitleText)}>
                              <span
                                  className={classnames("fontNodesEqual", "lineHeight15", "colorEditBlack")}>
                                  {this.props.nounsBasic[nodeId].name}
                              </span>
                              {
                                  (this.props.nounsBasic[nodeId].prefix.length > 0) &&
                                  <span
                                      className={classnames("fontNodesEqual", "lineHeight15", "colorEditBlack")}>
                                      {", "}
                                  </span>
                              }
                              {
                                  (this.props.nounsBasic[nodeId].prefix.length > 0) &&
                                  <div>
                                      <span
                                          className={classnames("fontNodesEqual", "lineHeight15", "colorEditBlack")}>
                                          {this.props.nounsBasic[nodeId].prefix}
                                      </span>
                                  </div>
                              }
                          </div>
                      }
                  </div>
              </Link>
              {
                  ((nodeId in this.props.nounsBasic) &&
                      !(this.props.startListify && this.props.atStartListify) &&
                      this.props.nounsBasic[nodeId].parentify) &&
                  <div
                      className={classnames(styles.boxBtnNextLayer)}
                      nodeid={nodeId}
                      onClick={this._handleClick_switcNextLayer}>
                      <span>
                          {"children"}
                      </span>
                  </div>
              }
          </div>
      )
    }


  _handleClick_switcNextLayer(event){
    event.preventDefault();
    event.stopPropagation();
    let targetNode = event.currentTarget.getAttribute('nodeid');
    // check if any child by nounsBasic
    if(!this.props.nounsBasic[targetNode].parentify) return;
    
    this.props._set_SwitchNextLayer(targetNode);
  }

  _handleClick_filterNode(event){
    // nor stopPropagation neither preventDefault here
    // to make the <Link> work as expect
    this.props._handleClick_filterNode();
  }
}


const mapStateToProps = (state)=>{
  return {
    tokenStatus: state.token,
    i18nUIString: state.i18nUIString,
    nounsBasic: state.nounsBasic
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(NodesFilter));
