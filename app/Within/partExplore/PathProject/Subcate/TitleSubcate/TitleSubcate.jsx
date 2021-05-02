import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import SvgArrowStick from '../../../../../Components/Svg/SvgArrowStick.jsx';
import {SvgArrowToLeft} from '../../../../../Components/Svg/SvgArrow.jsx';

class TitleSubcate extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onBtnSubcate: false,
      onClose: false
    };
    this._handleLeave_link = this._handleLeave_link.bind(this);
    this._handleEnter_link = this._handleEnter_link.bind(this);
    this._handleEnter_CloseArrow = this._handleEnter_CloseArrow.bind(this);
    this._handleLeave_CloseArrow = this._handleLeave_CloseArrow.bind(this);
    this._render_resetWithTitle = this._render_resetWithTitle.bind(this);
    this._render_resetLink = this._render_resetLink.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  _render_resetWithTitle(){
    let toSearch = new URLSearchParams(this.props.location.search); //we need value in URL query
    toSearch.delete("_filter_map");
    toSearch.delete("filterNode");
    let linkObj = {
      pathname: this.props.location.pathname,
      search: toSearch.toString(),
      state: {from: this.props.location}
    };

    return (
      <div
        className={classnames(styles.rowWithTitle)}>
        <Link
          to={linkObj}
          className={classnames('plainLinkButton')}
          style={{ display: 'inline-block' }}
          onMouseEnter={this._handleEnter_link}
          onMouseLeave={this._handleLeave_link}>
          <span
            className={classnames(
              "fontNodesEqual", "weightBold", "colorEditBlack",
              styles.spanLinkNode,
              { [styles.spanLinkNodeMouse]: this.state.onBtnSubcate }
            )}>
            {"@" + this.props.subCatesObj[this.currentSubCate].name}
          </span>
        </Link>
        <Link
          to={linkObj}
          className={classnames(
            'plainLinkButton', styles.linkBlock,
             styles.boxSvgArrow)}
          onTouchStart={this._handleEnter_CloseArrow}
          onTouchEnd={this._handleLeave_CloseArrow}
          onMouseEnter={this._handleEnter_CloseArrow}
          onMouseLeave={this._handleLeave_CloseArrow}>
          <SvgArrowToLeft
            mouseOn={this.state.onClose}
            customStyles={{fillColorMouseOn: '#ff8168', fillColor: '#a3a3a3'}}/>
        </Link>
      </div>
    )
  }

  _render_resetLink(){
    let toSearch = new URLSearchParams(this.props.location.search); //we need value in URL query
    toSearch.delete("subCate");
    toSearch.delete("unitId");
    toSearch.delete("unitView");
    let linkObj = {
      pathname: this.props.location.pathname,
      search: toSearch.toString(),
      state: {from: this.props.location}
    };

    return (
      <Link
        to={linkObj}
        className={classnames('plainLinkButton', styles.boxIconFilterNode)}
        style={{width: "18px"}}
        onTouchStart={this._handleEnter_CloseArrow}
        onTouchEnd={this._handleLeave_CloseArrow}
        onMouseEnter={this._handleEnter_CloseArrow}
        onMouseLeave={this._handleLeave_CloseArrow}>
        <SvgArrowStick
          customstyle={this.state.onClose ? (
            {
              cls1: "{fill:none;stroke:#ff8168;stroke-linecap:round;stroke-linejoin:round;stroke-width:18px;}",
              cls2: "{fill:#ff8168}"
            }
          ) : (
            {
              cls1: "{fill:none;stroke:rgb(69, 135, 160);stroke-linecap:round;stroke-linejoin:round;stroke-width:18px;}",
              cls2: "{fill:rgb(69, 135, 160)}"
            }
          )} />
        </Link>

    );
  }

  render(){
    let urlParams = new URLSearchParams(this.props.location.search); //we need value in URL query
    if(urlParams.has('_filter_map')){
      this.viewFilter = true;
    } else this.viewFilter = false;
    if(urlParams.has('subCate')){
      this.currentSubCate = urlParams.get('subCate');
    } else this.currentSubCate = false;

    return (
      <div
        className={classnames(styles.comTitleSubcate)}>
        {
          this.viewFilter ? (
            <div>
              {this._render_resetWithTitle()}
            </div>
          ): (
            <div
              className={classnames(styles.boxResetLink)}>
              {this._render_resetLink()}
            </div>
          )
        }
      </div>
    )
  }

  _handleEnter_CloseArrow(e){
    this.setState((prevState, props)=>{
      return {
        onClose: true
      }
    })
  }

  _handleLeave_CloseArrow(e){
    this.setState((prevState, props)=>{
      return {
        onClose: false
      }
    })
  }

  _handleEnter_link(event) {
    this.setState({ onBtnSubcate: true })
  }

  _handleLeave_link(event) {
    this.setState({ onBtnSubcate: false })
  }
}


const mapStateToProps = (state)=>{
  return {
    tokenStatus: state.token,
    i18nUIString: state.i18nUIString,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(TitleSubcate));
