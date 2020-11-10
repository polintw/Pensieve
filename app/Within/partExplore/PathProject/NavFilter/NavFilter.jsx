import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import {SvgArrowToTop} from '../../../../Components/Svg/SvgArrow.jsx';

class NavFilter extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onArrow: false
    };
    this._handleClick_filter = this._handleClick_filter.bind(this);
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
          className={classnames(styles.boxLowerRow)}>
          <div
            className={classnames(styles.boxProjectInfo)}>
            {
              !this.props.viewFilter ?
              (
                !!this.filterNode ? (
                  <div>
                    <span
                      className={classnames("fontSubtitle", "weightBold", "lineHeight15", "colorEditBlack")}>
                      {"X "}
                    </span>
                    <span
                      className={classnames("fontSubtitle", "weightBold", "colorEditBlack")}>
                      {this.filterNode in this.props.nounsBasic ? (this.props.nounsBasic[this.filterNode].name) : null}
                    </span>
                  </div>
                ):(
                  ("description" in this.props.projectInfo) &&
                  <span
                    className={classnames("fontContentPlain", "colorEditLightBlack")}>
                    {this.props.projectInfo.description}
                  </span>
                )
              ): (
                <div>
                  <span
                    className={classnames(
                      styles.spanFilterCross,
                      "fontSubtitle", "weightBold", "lineHeight15", "colorEditBlack")}>
                    {"X "}
                  </span>
                  <div
                    className={classnames(
                      styles.boxInputLine,
                      "fontSubtitle", "colorEditBlack")}/>
                </div>
              )
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
                      customStyles={{fillColorMouseOn: '#545454', fillColor: 'rgb(69, 135, 160)'}}/>
                  </div>
                }
              </div>
            }
            {
              !this.props.viewFilter &&
              <div>
                {
                  !!this.filterNode &&
                  this._render_resetLink()
                }
                <div
                  onClick={this._handleClick_filter}>
                  {"Filter"}
                </div>
              </div>
            }
          </div>
        </div>
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
