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

class ItemNodeLink extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onbtnLink: false
    };
    this._handleClick_filterNode = this._handleClick_filterNode.bind(this);
    this._handleClick_switcNextLayer = this._handleClick_switcNextLayer.bind(this);
    this._handleEnter_Link = this._handleEnter_Link.bind(this);
    this._handleLeave_Link = this._handleLeave_Link.bind(this);
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
        className={classnames(styles.boxNodeItem)}
        style={{alignSelf: "flex-start"}}>
        <Link
          to={this.props.linkObj}
          className={classnames(
            'plainLinkButton', styles.boxNodeItemLink)}
            onClick={this._handleClick_filterNode}
            onMouseEnter={this._handleEnter_Link}
            onMouseLeave={this._handleLeave_Link}>
            <div
              className={classnames(styles.boxItemNoImgTitle)}>
              {
                (nodeId in this.props.nounsBasic) &&
                <div
                  className={classnames(
                    styles.boxTitleText,
                    {[styles.boxTitleTextMouseon]: this.state.onbtnLink},
                    {[styles.boxTitleTextNoChild]: ((this.props.startListify && this.props.atStartListify) || !this.props.nounsBasic[nodeId].parentify)}
                  )}>
                  <span
                    className={classnames("fontSubtitle_h5", "colorDarkGrey")}>
                    {this.props.nounsBasic[nodeId].name}
                  </span>
                  {
                    (this.props.nounsBasic[nodeId].prefix.length > 0) &&
                    <span
                      className={classnames("fontSubtitle_h5", "colorDarkGrey")}>
                      {", "}
                    </span>
                  }
                  {
                    (this.props.nounsBasic[nodeId].prefix.length > 0) &&
                    <div>
                      <span
                        className={classnames("fontContent", "colorDarkGrey")}>
                        {this.props.nounsBasic[nodeId].prefix}
                      </span>
                    </div>
                  }
                </div>
              }
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
          </Link>
        </div>
      )
    }

    _handleEnter_Link(e) {
      this.setState({ onbtnLink: true })
    }

    _handleLeave_Link(e) {
      this.setState({ onbtnLink: false })
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
)(ItemNodeLink));
