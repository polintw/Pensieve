import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import stylesFont from "../../stylesFont.module.css";

class NavFeed extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onNavLink: false
    };
    this._handleEnter_link = this._handleEnter_link.bind(this);
    this._handleLeave_link = this._handleLeave_link.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    return(
      <div
        className={classnames(styles.boxTitle)}
        style={{display:'flex',justifyContent: 'space-between', paddingTop: '24px'}}>
        <div
          className={classnames( styles.boxLinkLeft)}
          style={{display: 'unset'}}>
          <span
            className={classnames(
              stylesFont.fontHint, stylesFont.weightBold,
              stylesFont.colorAssistGold)}>
            {
              this.props.location.pathname.includes('gathering') ?
              this.props.i18nUIString.catalog["title_FeedAssigned_"] : this.props.i18nUIString.catalog["link_Fellows"]
            }
          </span>
        </div>
        <Link
          to={ this.props.location.pathname.includes('gathering') ? "/" :"/gathering" }
          className={classnames('plainLinkButton', styles.boxLinkRight)}
          onMouseEnter={this._handleEnter_link}
          onMouseLeave={this._handleLeave_link}>
          <span
            className={classnames(
              styles.spanLink,
              stylesFont.fontHint, stylesFont.weightBold, "colorLightGrey",
              {[styles.spanLinkMouse]: this.state.onNavLink}
            )}>
              {
                this.props.location.pathname.includes('gathering') ?
                this.props.i18nUIString.catalog["link_Fellows"] : this.props.i18nUIString.catalog["title_FeedAssigned_"]
              }
          </span>
        </Link>

      </div>
    )
  }

  _handleEnter_link(e){
    this.setState({onNavLink: true})
  }

  _handleLeave_link(e){
    this.setState({onNavLink: false})
  }

}

const mapStateToProps = (state)=>{
  return {
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
)(NavFeed));
