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
  domain
} from '../../../config/services.js';

class NodesImgUnits extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      overbtnLink: false,
    };
    this._handleClick_filterNode = this._handleClick_filterNode.bind(this);
    this._handleOver_Link = this._handleOver_Link.bind(this);
    this._handleOut_Link = this._handleOut_Link.bind(this);
    this._render_units = this._render_units.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  _render_units(){
    // first, the props.nodesUnits was fetched 'after' the props.nodeId, return if not yet ready.
    if(!(this.props.nodeId in this.props.nodesUnits)) return null;

    let unitsList = this.props.nodesUnits[this.props.nodeId];
    let unitsDOM = unitsList.map((unitId, index)=>{
      let imgSrcCover = domain.protocol+ '://'+domain.name+'/router/img/'
      + ((unitId in this.props.unitsBasic) ? this.props.unitsBasic[unitId].pic_layer0: 'notyetprepared_inNodesFilter')
      +'?type=thumb';

      return (
        <div
          key={"key_filterImgUnits_node"+this.props.nodeId+"_"+index}>
            <ImgPreview
              blockName={''}
              previewSrc={imgSrcCover}
              _handleClick_ImgPreview_preview={() => {  }} />
          </div>
        )
    });

    return unitsDOM;
  }

  render(){
    const nodeId = this.props.nodeId;
    // know first if this node has used.
    let nodeLink = {
        pathname: this.props.match.url,
        search: this.props.searchStr + '&filterNode=' + nodeId,
        state: { from: this.props.location }
      };

    return (
      <div
        className={classnames(styles.boxNodeItem)}>
        <Link
          to={nodeLink}
          className={classnames(
            'plainLinkButton', styles.boxNodeItemLink)}
            onClick={this._handleClick_filterNode}
            onMouseOver={this._handleOver_Link}
            onMouseOut={this._handleOut_Link}>
            <div
              className={classnames(styles.boxItemTitle)}>
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
          {this._render_units()}
        </div>
      )
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
)(NodesImgUnits));
