import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import ImgPreview from '../../../../Components/ImgPreview.jsx';
import SvgIconNextLayer from '../../../../Components/Svg/SvgIcon_NextLayer.jsx';
import {
  _axios_get_NodesLayer
} from './axios.js';
import {
  domain
} from '../../../../../config/services.js';

class ItemImgBox extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      overbtnLink: false,
      overbtnNextLayer: false
    };
    this['filterNode' + this.props.nodeId] = React.createRef(); // make a ref for only this component
    this._handleClick_filterNode = this._handleClick_filterNode.bind(this);
    this._handleClick_switcNextLayer = this._handleClick_switcNextLayer.bind(this);
    this._handleOver_Link = this._handleOver_Link.bind(this);
    this._handleOut_Link = this._handleOut_Link.bind(this);
    this._handleOver_NextLayer = this._handleOver_NextLayer.bind(this);
    this._handleOut_NextLayer = this._handleOut_NextLayer.bind(this);
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
            onClick={this._handleClick_filterNode}
            onMouseOver={this._handleOver_Link}
            onMouseOut={this._handleOut_Link}>
            <div
              className={classnames(
                styles.boxItemImg,
                {[styles.boxItemImgMouseon]: this.state.overbtnLink})}>
                  <ImgPreview
                    blockName={''}
                    previewSrc={this.props.imgSrcCover}
                    _handleClick_ImgPreview_preview={() => { this["filterNode" + nodeId].current.click() }} />
            </div>
            <div
              className={classnames(styles.boxItemTitle)}
              style={
                (this.props.startListify && this.props.atStartListify) ?
                {justifyContent: "flex-end"}: {}
              }>
              {
                ((nodeId in this.props.nounsBasic) &&
                !(this.props.startListify && this.props.atStartListify) &&
                this.props.nounsBasic[nodeId].parentify) &&
                <div
                  className={classnames(styles.boxBtnNextLayer)}>
                  <div
                    className={classnames(styles.svgBtnNextLayer)}
                    nodeid={nodeId}
                    onClick={this._handleClick_switcNextLayer}
                    onMouseOver={this._handleOver_NextLayer}
                    onMouseOut={this._handleOut_NextLayer}>
                    <SvgIconNextLayer
                      customstyle={this.state.overbtnNextLayer ? {
                        cls1: { stroke: '#444444' },
                        cls2: { fill: "rgb(69, 135, 160)" }
                      } : {
                        cls1: {},
                        cls2: { fill: "#545454" }
                      }} />
                  </div>
                </div>
              }

              {
                (nodeId in this.props.nounsBasic) &&
                <div
                  className={classnames(
                    styles.boxTitleText,
                    {[styles.boxTitleTextMouseon]: this.state.overbtnLink},
                    {[styles.boxTitleTextNoChild]: ((this.props.startListify && this.props.atStartListify) || !this.props.nounsBasic[nodeId].parentify)}
                  )}>
                  <span
                    className={classnames(
                      "fontNodesEqual", "lineHeight15",
                      {
                        ["colorEditBlack"]: !this.state.overbtnLink,
                        ["colorDescripBlack"]: this.state.overbtnLink
                      }
                    )}>
                    {this.props.nounsBasic[nodeId].name}
                  </span>
                  {
                    (this.props.nounsBasic[nodeId].prefix.length > 0) &&
                    <span
                      className={classnames(
                        "fontNodesEqual", "lineHeight15",
                        {
                          ["colorEditBlack"]: !this.state.overbtnLink,
                          ["colorDescripBlack"]: this.state.overbtnLink
                        }
                      )}>
                      {", "}
                    </span>
                  }
                  {
                    (this.props.nounsBasic[nodeId].prefix.length > 0) &&
                    <div>
                      <span
                        className={classnames(
                          "fontSubtitle_h5",
                          {
                            ["colorEditBlack"]: !this.state.overbtnLink,
                            ["colorDescripBlack"]: this.state.overbtnLink
                          }
                        )}>
                        {this.props.nounsBasic[nodeId].prefix}
                      </span>
                    </div>
                  }
                </div>
              }
            </div>
          </Link>
        </div>
      )
    }

    _handleOver_Link(e) {
      this.setState({ overbtnLink: true })
    }

    _handleOut_Link(e) {
      this.setState({ overbtnLink: false })
    }

    _handleOver_NextLayer(e) {
      e.stopPropagation(); // nextLayer is a comp 'inside' a NodeLink, need stopPropagation to keep effect only here
      this.setState({ overbtnNextLayer: true })
    }

    _handleOut_NextLayer(e) {
      e.stopPropagation(); // nextLayer is a comp 'inside' a NodeLink, need stopPropagation to keep effect only here
      this.setState({ overbtnNextLayer: false })
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
)(ItemImgBox));
