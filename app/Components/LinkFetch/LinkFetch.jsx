import React from 'react';
import {
  Link,
  withRouter,
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import { _axios_postLinkMeta} from './utils.js';
import {
  cancelErr,
  uncertainErr
} from '../../utils/errHandlers.js';

class LinkFetch extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      metaTitle:'',
      onSpanOutbound: false
    };
    this.axiosSource = axios.CancelToken.source();
    this._set_clientUrlMetaData = this._set_clientUrlMetaData.bind(this);
    this._handleEnter_spanOutbound = this._handleEnter_spanOutbound.bind(this);
    this._handleLeave_spanOutbound = this._handleLeave_spanOutbound.bind(this);
}

  componentDidUpdate(prevProps, prevState, snapshot){
    if(prevProps.outboundLink != this.props.outboundLink){
      this._set_clientUrlMetaData();
    }
  }

  componentDidMount(){
    this._set_clientUrlMetaData();
  }

  componentWillUnmount(){
    if (this.state.axios) {
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    return this.props.tagA ? (
        <a
            href={this.props.outboundLink}
            target={"_blank"}
            className={classnames('plainLinkButton', styles.linkOutbound)}>
            {
              this.props.quotationify &&
              <span
                className={classnames(
                  'fontContentPlain', "colorEditBlack", styles.spanOutbound)}
                  style={
                    !!this.props.customStyle ? this.props.customStyle["common"] :{}}>
                    {!!this.props.dashify ? "- «" : "«"}
                  </span>
            }
            <span
                className={classnames(
                    'fontContentPlain', "colorEditBlack", styles.spanOutbound,
                    {
                        [styles.spanOutboundActiv]: this.state.onSpanOutbound,
                    }
                )}
                onMouseEnter={this._handleEnter_spanOutbound}
                onMouseLeave={this._handleLeave_spanOutbound}
                style={
                  !!this.props.customStyle ?
                  (this.state.onSpanOutbound ? this.props.customStyle["mouseOn"] : this.props.customStyle["common"] ):{}}>
                {this.state.metaTitle}
            </span>
            {
              this.props.quotationify &&
              <span
                className={classnames(
                  'fontContentPlain', "colorEditBlack", styles.spanOutbound)}
                  style={
                    !!this.props.customStyle ? this.props.customStyle["common"] :{}}>
                  {"»"}
                  </span>
            }
        </a>
    ): (
      <div
        className={classnames(styles.linkOutbound)}>
        {
          this.props.quotationify &&
          <span
            className={classnames(
              'fontContentPlain', "colorEditBlack", styles.spanOutbound)}
              style={
                Object.assign({paddingRight: "3px"}, !!this.props.customStyle ? this.props.customStyle["common"] :{})}>
                {!!this.props.dashify ? " －《"　: "《"}
              </span>
        }
        <span
          className={classnames(
            'fontContentPlain', "colorEditBlack", styles.spanOutbound
          )}
          style={
            !!this.props.customStyle ?
            this.state.onSpanOutbound ? this.props.customStyle["mouseOn"] : this.props.customStyle["common"] :{}}>
            {this.state.metaTitle}
          </span>
          {
            this.props.quotationify &&
            <span
              className={classnames(
                'fontContentPlain', "colorEditBlack", styles.spanOutbound)}
                style={
                  !!this.props.customStyle ? this.props.customStyle["common"] :{}}>
                  {"》"}
                </span>
          }
      </div>
    )
  }

  _set_clientUrlMetaData(){
    const self = this;
    this.setState({ axios: true });

    _axios_postLinkMeta(this.axiosSource.token, this.props.outboundLink)
    .then((resObj)=>{
      this.setState((prevState, props)=>{
        let metaTitle = '';
        if ("metaTitle" in resObj.main.metadata){
          metaTitle = resObj.main.metadata.metaTitle;
        } else { metaTitle = self.props.outboundLink};
        return {metaTitle: metaTitle};
      });
      if ( ("metaTitle" in resObj.main.metadata) && ("_set_metaData" in self.props)){
        self.props._set_metaData({metaTitle: resObj.main.metadata.metaTitle});
      };
    })
    .catch(function (thrown) {
      self.setState({ axios: false });
      if (axios.isCancel(thrown)) {
        cancelErr(thrown);
      } else {
        let message = uncertainErr(thrown);
        if (message) alert(message);
      }
    });
  }

  _handleEnter_spanOutbound(e) {
    this.setState({ onSpanOutbound: true })
  }

  _handleLeave_spanOutbound(e) {
    this.setState({ onSpanOutbound: false })
  }


}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(LinkFetch));
