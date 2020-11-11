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

class NavFilter extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onArrow: false,
      onFilterNode: false
    };
    this._handleClick_filter = this._handleClick_filter.bind(this);
    this._handleLeave_FilterNode = this._handleLeave_FilterNode.bind(this);
    this._handleEnter_FilterNode = this._handleEnter_FilterNode.bind(this);
    this._handleLeave_CloseArrow = this._handleLeave_CloseArrow.bind(this);
    this._handleEnter_CloseArrow = this._handleEnter_CloseArrow.bind(this);
    this._handleClick_filterClose = this._handleClick_filterClose.bind(this);
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
      search: '',
      state: {from: this.props.location}
    };

    return (
      <Link
        to={linkObj}
        className={classnames(
          'plainLinkButton')}>
        {"Main"}
      </Link>
    );
  }

  render(){
    let urlParams = new URLSearchParams(this.props.location.search); //we need value in URL query
    if(urlParams.has('filterNode')){
      this.filterNode = urlParams.get('filterNode');
    } else this.filterNode = null;

    return (
      <div className={styles.comNavFilter}>
        <div
          className={classnames(styles.boxRowInfo)}>
          <div
            className={classnames(styles.boxProjectInfo)}>
            {
              ("description" in this.props.projectInfo) &&
              <span
                className={classnames("fontContentPlain", "colorEditLightBlack")}>
                {this.props.projectInfo.description}
              </span>

            }
          </div>
          <div
            className={classnames(styles.boxFilter)}>
            {
              this.props.viewFilter &&
              <div
                onClick={this._handleClick_filterClose}>
                {
                  <div
                    className={classnames(styles.boxSvgArrow)}
                    onMouseEnter={this._handleEnter_CloseArrow}
                    onMouseLeave={this._handleLeave_CloseArrow}>
                    <SvgArrowToTop
                      mouseOn={this.state.onArrow}
                      customStyles={{fillColorMouseOn: '#ff8168', fillColor: 'rgb(69, 135, 160)'}}/>
                  </div>
                }
              </div>
            }
            {
              !this.props.viewFilter &&
              <div
                className={classnames(styles.boxIconsFilter)}>
                {
                  !!this.filterNode &&
                  this._render_resetLink()
                }
                <div
                  className={classnames(styles.boxIconFilterNode)}
                  onClick={this._handleClick_filter}
                  onMouseEnter={this._handleEnter_FilterNode}
                  onMouseLeave={this._handleLeave_FilterNode}>
                  <SvgFilterNode
                    customstyle={this.state.onFilterNode ? "{fill: rgb(69, 135, 160);}" : "{fill: #757575;}"}/>
                </div>
              </div>
            }
          </div>
        </div>
        {
          !!this.filterNode ? (
            <div
              className={classnames(styles.boxRowFilterNode)}>
              <span
                className={classnames(
                  styles.spanFilterCross,
                  "fontContent", "weightBold", "lineHeight15", "colorEditBlack")}>
                {"X "}
              </span>
              <span
                className={classnames("fontNodesEqual", "weightBold", "lineHeight15", "colorEditBlack")}>
                {this.filterNode in this.props.nounsBasic ? (this.props.nounsBasic[this.filterNode].name) : null}
              </span>
            </div>
          ) : (
            this.props.viewFilter &&
            <div
              className={classnames(styles.boxRowFilterNode)}>
              <span
                className={classnames(
                  styles.spanFilterCross,
                  "fontContent", "weightBold", "lineHeight15", "colorEditBlack")}>
                  {"X "}
              </span>
              <div
                className={classnames(
                  styles.boxInputLine,
                  "fontContent", "lineHeight15", "colorWhiteGrey")}>
                <span>{this.props.i18nUIString.catalog['hint_PathProject_FilterNode']}</span>
              </div>
            </div>
          )
        }
      </div>
    )
  }

  _handleClick_filter(event){
    event.preventDefault();
    event.stopPropagation();
    this.props._set_viewFilter('filter')
  }

  _handleClick_filterClose(event){
    event.preventDefault();
    event.stopPropagation();
    this.props._set_viewFilter(null)
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
)(NavFilter));
