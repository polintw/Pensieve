import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import {SvgArrowToTop} from '../../../../Components/Svg/SvgArrow.jsx';
import SvgFilterNode from '../../../../Components/Svg/SvgFilter_Node.jsx';
import SvgArrowStick from '../../../../Components/Svg/SvgArrowStick.jsx';

class Nav extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onArrow: false,
      onFilterNode: false,
      onNodeLink: false,
    };
    this._edit_linkFilterOpen = this._edit_linkFilterOpen.bind(this);
    this._edit_linkFilterClose = this._edit_linkFilterClose.bind(this);
    this._handleEnter_NodeLink = this._handleEnter_NodeLink.bind(this);
    this._handleLeave_NodeLink = this._handleLeave_NodeLink.bind(this);
    this._handleLeave_FilterNode = this._handleLeave_FilterNode.bind(this);
    this._handleEnter_FilterNode = this._handleEnter_FilterNode.bind(this);
    this._handleLeave_CloseArrow = this._handleLeave_CloseArrow.bind(this);
    this._handleEnter_CloseArrow = this._handleEnter_CloseArrow.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  _render_resetLink(){
    let linkObj = {
      pathname: this.props.location.pathname,
      search: '?userId=' + this.props.userId,
      state: {from: this.props.location}
    };

    return (
      <Link
        to={linkObj}
        className={classnames(
          'plainLinkButton', styles.linkBlock,
           styles.boxSvgArrow)}
        onTouchStart={this._handleEnter_CloseArrow}
        onTouchEnd={this._handleLeave_CloseArrow}
        onMouseEnter={this._handleEnter_CloseArrow}
        onMouseLeave={this._handleLeave_CloseArrow}>
        <SvgArrowToTop
          mouseOn={this.state.onArrow}
          customStyles={{fillColorMouseOn: '#ff8168', fillColor: '#a3a3a3'}}/>
      </Link>
    );
  }

  render(){
    let urlParams = new URLSearchParams(this.props.location.search); //we need value in URL query
    let contentView = urlParams.has("content") ? this.urlParams.get('content') : '';
    if(urlParams.has('filterNode') && (contentView.length == 0) /* like contentView above */){
      this.filterNode = urlParams.get('filterNode');
    } else this.filterNode = null;
    if(urlParams.has('_filter_nodes') && (contentView.length == 0) /* like contentView above */){
      this.viewFilter = true;
    } else this.viewFilter = false;

    return (
      <div className={styles.comNav}>
        <div
          className={classnames(
            styles.boxRowInfo)}>
          <div
            className={classnames(styles.boxProjectInfo)}>
            <div
              className={classnames(styles.boxTitle)}>
              <div>
                <span
                  className={classnames(
                    "fontContentPlain", "weightBold", "colorAssistGold")}>
                  { this.props.i18nUIString.catalog["title_NavAtNode_"] }
                </span>
              </div>
            </div>
          </div>
          <div
            className={classnames(styles.boxFilter)}>
            {
              this.viewFilter ? (
                <Link
                  to={ this._edit_linkFilterClose()}
                  className={classnames('plainLinkButton')}
                  style={{display: 'block'}}>
                  {
                    <div
                      className={classnames(styles.boxSvgArrowStick)}
                      onTouchStart={this._handleEnter_FilterNode}
                      onTouchEnd={this._handleLeave_FilterNode}
                      onMouseEnter={this._handleEnter_FilterNode}
                      onMouseLeave={this._handleLeave_FilterNode}>
                      <SvgArrowStick
                        customstyle={this.state.onFilterNode ? (
                          {
                            cls1: "{fill:none;stroke:#ff8168;stroke-linecap:round;stroke-linejoin:round;stroke-width:18px;}",
                            cls2: "{fill:#ff8168}"
                          }
                        ): (
                          {
                            cls1: "{fill:none;stroke:rgb(69, 135, 160);stroke-linecap:round;stroke-linejoin:round;stroke-width:18px;}",
                            cls2: "{fill:rgb(69, 135, 160)}"
                          }
                        )}/>
                      </div>
                    }
                  </Link>
              ): (
                <Link
                  to={ this._edit_linkFilterOpen()}
                  className={classnames(
                    'plainLinkButton', styles.boxIconsFilter)}>
                    <div
                      className={classnames(styles.boxIconFilterNode)}
                      onTouchStart={this._handleEnter_FilterNode}
                      onTouchEnd={this._handleLeave_FilterNode}
                      onMouseEnter={this._handleEnter_FilterNode}
                      onMouseLeave={this._handleLeave_FilterNode}>
                      <SvgFilterNode
                        customstyle={this.state.onFilterNode ? "{fill: #ff8168;}" : "{fill: rgb(69, 135, 160);}"}/>
                    </div>
                  </Link>
              )
            }
          </div>
        </div>
        {
          (!!this.filterNode && !this.viewFilter) &&
            <div
              className={classnames(
                styles.boxRowFilterMargin, styles.boxRowFilterNodeFlex)}>
              <div>
                <span
                  className={classnames(
                    styles.spanFilterCross,
                    "fontContent", "weightBold", "lineHeight15", "colorAssistGold")}>
                    {"X "}
                  </span>
                <Link
                  nodeid={this.filterNode}
                  to={"/cosmic/explore/node?nodeid=" + this.filterNode}
                  className={classnames('plainLinkButton')}
                  style={{ display: 'inline-block' }}
                  onTouchStart={this._handleEnter_NodeLink}
                  onTouchEnd={this._handleLeave_NodeLink}
                  onMouseEnter={this._handleEnter_NodeLink}
                  onMouseLeave={this._handleLeave_NodeLink}>
                  {(this.filterNode in this.props.nounsBasic) &&
                    <span
                      className={classnames(
                        "fontNodesEqual", "weightBold", "colorEditBlack",
                        styles.spanLinkNode,
                        { [styles.spanLinkNodeMouse]: this.state.onNodeLink == this.filterNode }
                      )}>
                    {this.props.nounsBasic[this.filterNode].name}</span>
                  }
                </Link>
              </div>
              {this._render_resetLink()}
            </div>
        }
      </div>
    )
  }

  _edit_linkFilterClose(){
    let nextSearch = new URLSearchParams(this.props.location.search);
    nextSearch.delete("_filter_nodes");
    return (
      {
        pathname: this.props.match.url ,
        search: nextSearch.toString(),
        state: {from: this.props.location}
      }
    );
  }

  _edit_linkFilterOpen(){
    let nextSearch = new URLSearchParams(this.props.location.search);
    nextSearch.append("_filter_nodes", true);
    return (
      {
        pathname: this.props.match.url ,
        search: nextSearch.toString(),
        state: {from: this.props.location}
      }
    );
  }

  _handleEnter_CloseArrow(e){
    this.setState((prevState, props)=>{
      return {
        onArrow: true
      }
    })
  }

  _handleLeave_CloseArrow(e){
    this.setState((prevState, props)=>{
      return {
        onArrow: false
      }
    })
  }

  _handleEnter_FilterNode(e){
    this.setState((prevState, props)=>{
      return {
        onFilterNode: true
      }
    })
  }

  _handleLeave_FilterNode(e){
    this.setState((prevState, props)=>{
      return {
        onFilterNode: false
      }
    })
  }

  _handleEnter_NodeLink(e) {
    let targetNode = e.currentTarget.getAttribute('nodeid');
    this.setState({ onNodeLink: targetNode })
  }

  _handleLeave_NodeLink(e) {
    this.setState({ onNodeLink: false })
  }
}


const mapStateToProps = (state)=>{
  return {
    tokenStatus: state.token,
    userInfo: state.userInfo,
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
)(Nav));
