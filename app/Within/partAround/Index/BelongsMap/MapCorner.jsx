import React from 'react';
import {
  Link,
  withRouter,
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import {
  _axios_GET_usersCount
} from '../../../utils.js';
import SvgPin from '../../../../Components/Svg/SvgPin.jsx';
import SvgAvetarNoEye from "../../../../Components/Svg/SvgAvetarNoEye.jsx";

class MapCorner extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      usersCount: null,
      onNodeLink: false
    };
    this.axiosSource = axios.CancelToken.source();
    this._set_usersCount = this._set_usersCount.bind(this);
    this._render_nodeLink = this._render_nodeLink.bind(this);
    this._handleEnter_NodeLink = this._handleEnter_NodeLink.bind(this);
    this._handleLeave_NodeLink = this._handleLeave_NodeLink.bind(this);
  }

  _set_usersCount(){
    const self = this;
    this.setState({axios: true});
    let queryObj={
      limitCorner: this.props.typeNodeId,
      countCat: [this.props.typeReverse]
    };

    _axios_GET_usersCount(
      this.axiosSource.cancelToken,
      this.props.nodeId,
      queryObj
    )
    .then((resObj) => {
      self.setState((prevState, props)=>{
        return {
          axios: false,
          usersCount: resObj.main.countsByTypes[this.props.typeReverse] //the count going to display is the one reverse to the 'view tab type'
        }
      });
    }).catch(function (thrown) {
      self.setState({axios: false});
      if (axios.isCancel(thrown)) {
        cancelErr(thrown);
      } else {
        let message = uncertainErr(thrown);
        if(message) alert(message);
      }
    });
  }


  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {
    this._set_usersCount();
  }

  componentWillUnmount() {

  }

  _render_nodeLink(){
    const nodeId = this.props.nodeId;

    return (
      <Link
        key={"key_MapCornerNode_"+nodeId}
        to={"/cosmic/explore/node?nodeid="+nodeId}
        className={classnames( 'plainLinkButton', styles.boxNode)}>
        <span
          className={classnames(
            styles.spanMapNode,
            "fontNodesEqual", "weightBold", "colorEditBlack",
            {[styles.spanMapNodeMouseOn]: this.state.onNodeLink}
          )}
          onMouseEnter={this._handleEnter_NodeLink}
          onMouseLeave={this._handleLeave_NodeLink}>
          {nodeId in this.props.nounsBasic ? (
            this.props.nounsBasic[nodeId].name) : (
              null
            )}
        </span>
      </Link>
    )
  }

  render(){

    return(
      <div
        className={classnames(
          styles.comMapCorner,
          {[styles.comMapCornerNodeMouse]: this.state.onNodeLink}
        )}>
        <div
          className={classnames(styles.boxStatics)}>
          <div
            className={classnames(styles.boxNodeSub)}>
            <span className={classnames(styles.spanMapNodeSub, 'fontContent', 'colorStandard')}>
              {
                (this.props.currentType =="homeland") ?
                this.props.i18nUIString.catalog["category__Belong_usersCount"][0] :
                this.props.i18nUIString.catalog["category__Belong_usersCount"][1]
              }
            </span>
          </div>
          {this._render_nodeLink()}
        </div>
        <div
          className={classnames(styles.boxMapCount)}>
          <div
            className={classnames(styles.boxNodePin)}>
            <div
              style={{width: "30px", height: "45px"}}>
              <SvgAvetarNoEye/>
            </div>
          </div>
          <div
            className={classnames(styles.boxMapCountNum)}>
            <span
              className={classnames(styles.spanMapCount, 'fontTitleHuge', 'weightBold', 'colorEditBlack')}>
              {this.state.usersCount}
            </span>
          </div>
        </div>
      </div>
    )
  }

  _handleEnter_NodeLink(e){
    this.setState({onNodeLink: true})
  }

  _handleLeave_NodeLink(e){
    this.setState({onNodeLink: false})
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
)(MapCorner));
