import React from 'react';
import {
  withRouter,
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import SvgEditLink from '../../../Components/Svg/SvgIcon_EditLink.jsx';

class BtnLinkEdit extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._handleEnter_svgBtn = this._handleEnter_svgBtn.bind(this);
    this._handleLeave_svgBtn = this._handleLeave_svgBtn.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    return (
      <div
        className={classnames(styles.comBtnLinkEdit)}>
        <div
          className={classnames(styles.boxSvgEditLink)}
          onMouseEnter={this._handleEnter_svgBtn}
          onMouseLeave={this._handleLeave_svgBtn}
          onClick={(e)=>{
            e.preventDefault(); e.stopPropagation();
            this.props._set_nodesEditView("outboundLink");
          }}>
          <SvgEditLink
            customStyle={
              this.state.onBtnSvg ? {"cls-1": {stroke: "#545454"}, "cls-2": {fill: "#545454"}}:
              {"cls-1": {stroke: "#a3a3a3"}, "cls-2": {fill: "#a3a3a3"}}}/>
          </div>
        {
          ("urlString" in this.props.outboundLinkObj &&
          this.props.outboundLinkObj["urlString"].length > 0 ) &&
            <div style={{margin: '0 0 0 6px'}}>
              <span
                className={classnames(
                  'fontContentPlain', "colorEditBlack", styles.spanOutbound
                )}>
                {
                  "metaTitle" in this.props.outboundLinkObj ?
                  this.props.outboundLinkObj["metaTitle"] :
                  this.props.outboundLinkObj["urlString"]
                }
              </span>
            </div>
        }
      </div>
    )
  }

  _handleEnter_svgBtn(e) {
    this.setState({
      onBtnSvg: true
    })
  }

  _handleLeave_svgBtn(e) {
    this.setState({
      onBtnSvg: false
    })
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.userInfo,
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
)(BtnLinkEdit));
