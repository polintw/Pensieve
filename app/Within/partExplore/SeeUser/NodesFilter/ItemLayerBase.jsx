import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import ImgPreview from '../../../../Components/ImgPreview.jsx';
import {
  _axios_get_NodesLayer
} from './axios.js';
import {
  domain
} from '../../../../../config/services.js';

class ItemLayerBase extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      overbtnLink: false,
      overNodeLink: false,
    };
    this['filterNode' + this.props.nodeId] = React.createRef(); // make a ref for only this component
    this._handleClick_filterNode = this._handleClick_filterNode.bind(this);
    this._handleOver_Link = this._handleOver_Link.bind(this);
    this._handleOut_Link = this._handleOut_Link.bind(this);
    this._handleOver_NodeLink = this._handleOver_NodeLink.bind(this);
    this._handleOut_NodeLink = this._handleOut_NodeLink.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  render(){
    const nodeId = this.props.nodeId; // props.baseParent
    let imgSrcCover = domain.protocol+ '://'+domain.name+'/router/img/'
        + ((this.props.firstUnitSrc) ? this.props.firstUnitSrc: 'notyetprepared_inNodesFilter')
        +'?type=thumb';

    return (
      <div
        className={classnames(
          styles.boxNodeItem, styles.boxNodeItemLayerBase,
          {[styles.boxNodeItemNoImg]: !this.props.firstUnit}
        )}>
        <div
          className={classnames(
            styles.boxItemTitle, styles.boxItemTitleLayerBase,
            {[styles.boxItemNoImgTitle]: !this.props.firstUnit}
          )}>
          {
            (nodeId in this.props.nounsBasic) &&
            <Link
              to={{
                pathname: this.props.match.url,
                search: '?filterNode=' + nodeId,
                state: { from: this.props.location }
              }}
              ref={this["filterNode" + nodeId]}
              className={classnames(
                'plainLinkButton', styles.boxTitleText,
                { [styles.boxTitleTextMouseon]: this.state.overbtnLink },
                { [styles.boxTitleTextNoChild]: ((this.props.startListify && this.props.atStartListify) || !this.props.nounsBasic[nodeId].parentify) }
              )}
              onClick={this._handleClick_filterNode}
              onMouseOver={this._handleOver_Link}
              onMouseOut={this._handleOut_Link}>
              <div>
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
              </div>
              {
                (this.props.nounsBasic[nodeId].prefix.length > 0) &&
                <div>
                  <span
                    className={classnames(
                      "fontNodesEqual", "lineHeight15",
                      {
                        ["colorEditBlack"]: !this.state.overbtnLink,
                        ["colorDescripBlack"]: this.state.overbtnLink
                      }
                    )}>
                    {this.props.nounsBasic[nodeId].prefix}
                  </span>
                </div>
              }
            </Link>
          }
        </div>
        <div
          className={classnames(
            styles.boxItemImg,
            {
              [styles.boxItemImgNoCover]: !this.props.firstUnit,
              [styles.boxItemImgMouseon]: (this.state.overbtnLink && this.props.firstUnit)}
            )}
            style={{marginBottom: 'unset'}}>
          {
            this.props.firstUnit ? (
              <ImgPreview
                blockName={''}
                previewSrc={imgSrcCover}
                _handleClick_ImgPreview_preview={() => {  }} />
            ): (
              <div
                style={{marginBottom: 'unset', textAlign: 'center'}}>
                <span
                  className={classnames(
                    "fontContent", "colorDarkGrey")}
                    style={{display: 'block'}}>
                  {this.props.i18nUIString.catalog['hint_nodesFilter_nodeNotYet']}
                </span>
                {
                  (nodeId in this.props.nounsBasic) &&
                  !!this.props.nounsBasic[nodeId].accumulationsify && // probably false or 'undefined'
                  <Link
                    to={{
                      pathname: '/cosmic/explore/node' ,
                      search: '?nodeid='+ nodeId,
                      state: {from: this.props.location}
                    }}
                    className={classnames(
                      'plainLinkButton', styles.linkImgNodeText)}
                      onClick={this._handleClick_filterNode}
                      onMouseOver={this._handleOver_NodeLink}
                      onMouseOut={this._handleOut_NodeLink}>
                      <span
                        className={classnames(
                          "fontContent", "colorDarkGrey",
                          styles.spanLinkNode,
                        )}>
                        {"( "}
                      </span>
                      <span
                        className={classnames(
                          "fontContentPlain", "colorDarkGrey",
                          styles.spanLinkNode,
                          {
                            [styles.spanLinkNodeMouse]: this.state.overNodeLink,
                          }
                        )}>
                        {this.props.i18nUIString.catalog['hint_nodesFilter_nodeExplore']}
                      </span>
                      <span
                        className={classnames(
                          "fontContent", "colorDarkGrey",
                          styles.spanLinkNode,
                        )}>
                        {" )"}
                      </span>
                    </Link>
                }
              </div>
            )
          }
        </div>
      </div>
    )
  }

  _handleOver_NodeLink(e) {
    e.stopPropagation();
    this.setState({ overNodeLink: true })
  }

  _handleOut_NodeLink(e) {
    e.stopPropagation();
    this.setState({ overNodeLink: false })
  }

  _handleOver_Link(e) {
      this.setState({ overbtnLink: true })
    }

    _handleOut_Link(e) {
      this.setState({ overbtnLink: false })
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
)(ItemLayerBase));
