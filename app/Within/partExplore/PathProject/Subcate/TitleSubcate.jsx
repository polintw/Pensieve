import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";

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
    this._render_resetLink = this._render_resetLink.bind(this);
    this._handleClick_resetLink = this._handleClick_resetLink.bind(this);
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
          'plainLinkButton', styles.linkBlock,
           styles.boxSubcateClose)}
        onClick={this._handleClick_resetLink}
        onTouchStart={this._handleEnter_CloseArrow}
        onTouchEnd={this._handleLeave_CloseArrow}
        onMouseEnter={this._handleEnter_CloseArrow}
        onMouseLeave={this._handleLeave_CloseArrow}>
        <span
          className={classnames(
            "fontContent", "weightBold", "lineHeight15",
            {
              ["colorStandard"]: this.state.onClose,
              ["colorGrey"]: !this.state.onClose
            })}>
            {"X"}
        </span>
      </Link>
    );
  }

  render(){
    let urlParams = new URLSearchParams(this.props.location.search); //we need value in URL query
    if(urlParams.has('subCate')){
      this.currentSubCate = urlParams.get('subCate');
    } else this.currentSubCate = null;

    return (
      <div
        className={classnames(styles.comTitleSubcate)}>
        <Link
          subcateid={this.currentSubCate}
          to={this.props.location}
          className={classnames('plainLinkButton')}
          style={{ display: 'inline-block' }}
          onMouseEnter={this._handleEnter_link}
          onMouseLeave={this._handleLeave_link}>
          {
            (this.currentSubCate in this.props.subCatesInfo.subCatesObj) &&
            <span
              className={classnames(
                "fontNodesEqual", "weightBold", "colorEditBlack",
                styles.spanLinkNode,
                { [styles.spanLinkNodeMouse]: this.state.onBtnSubcate == this.currentSubCate }
              )}>
              {"@" + this.props.subCatesInfo.subCatesObj[this.currentSubCate].name}
            </span>
          }
        </Link>
        {this._render_resetLink()}
      </div>
    )
  }

  _handleClick_resetLink(event){
    // a <Link> comp, keep it act as default
    event.stopPropagation();
    // we are here to reset mouse state
    this.setState({
      onClose: false
    })
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
    let subCateId = event.currentTarget.getAttribute('subcateid');
    this.setState({ onBtnSubcate: subCateId })
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
