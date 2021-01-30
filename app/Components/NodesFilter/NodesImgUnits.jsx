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
      onUnitImg: false
    };
    this._handleClick_filterNode = this._handleClick_filterNode.bind(this);
    this._handleOver_Link = this._handleOver_Link.bind(this);
    this._handleOut_Link = this._handleOut_Link.bind(this);
    this._handleEnter_UnitImg = this._handleEnter_UnitImg.bind(this);
    this._handleLeave_UnitImg = this._handleLeave_UnitImg.bind(this);
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
      let linkSearch = this.props.location.search + '&' + 'unitId='+unitId+'&unitView=theater';

      return (
        <Link
          key={"key_filterImgUnits_node"+this.props.nodeId+"_"+index}
          unitid={unitId}
          to={{
            pathname: this.props.location.pathname + ((this.props.location.pathname == '/') ? 'unit' : '/unit'),
            search: linkSearch,
            state: {from: this.props.location}
          }}
          className={classnames(
            'plainLinkButton',styles.boxUnitImg)}
          onMouseEnter={this._handleEnter_UnitImg}
          onMouseLeave={this._handleLeave_UnitImg}>
          <div
            className={classnames(styles.boxUnitImgMouseOff)}>
            <ImgPreview
              blockName={''}
              previewSrc={imgSrcCover}
              _handleClick_ImgPreview_preview={() => {  }} />
          </div>
          {
            (this.state.onUnitImg == unitId) &&
            <div
              className={classnames(styles.boxUnitImgMouseOn)}>
              <ImgPreview
                blockName={''}
                previewSrc={ imgSrcCover }
                _handleClick_ImgPreview_preview={()=>{}}/>
            </div>
          }
        </Link>
      );
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
        className={classnames(styles.comNodesImgs)}>
        <Link
          to={nodeLink}
          className={classnames(
            'plainLinkButton', styles.boxNode,
            {[styles.boxNodeMouseon]: this.state.overbtnLink}
          )}
          onClick={this._handleClick_filterNode}
          onTouchStart={this._handleOver_Link}
          onTouchEnd={this._handleOut_Link}
          onMouseOver={this._handleOver_Link}
          onMouseOut={this._handleOut_Link}>
          <div
            className={classnames(styles.boxItemTitle)}>
            {
              (nodeId in this.props.nounsBasic) &&
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
        <div
          className={classnames(styles.boxUnits)}>
          {this._render_units()}
        </div>
      </div>
    )
  }

  _handleOver_Link(e) {
    this.setState({ overbtnLink: true })
  }

  _handleOut_Link(e) {
    this.setState({ overbtnLink: false })
  }

  _handleEnter_UnitImg(e) {
    let unitId = e.currentTarget.getAttribute('unitid');
    this.setState({ onUnitImg: unitId });
  }

  _handleLeave_UnitImg(e) {
    this.setState({ onUnitImg: false })
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
