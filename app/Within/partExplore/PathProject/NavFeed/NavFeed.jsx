import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";

class NavFeed extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onLink: false
    };
    this._render_navTab = this._render_navTab.bind(this);
    this._handleEnter_linkNavFeed = this._handleEnter_linkNavFeed.bind(this);
    this._handleLeave_linkNavFeed = this._handleLeave_linkNavFeed.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  _render_navTab(){
    let tabsi18nName = ["title_NavAtNode_", "tab_Steps", "tab_Routes"];
    let goldColorTab = '';
    // which tab we are now on
    switch (this.currentTab) { // refer to tabsi18nName
      case "routes":
        goldColorTab = 'tab_Routes';
        break;
      case "steps":
        goldColorTab = 'tab_Steps';
        break;
      default: // usually 'undefined'
        goldColorTab = 'title_NavAtNode_';
    };

    let tabDOM = tabsi18nName.map((i18nKey, index)=>{
      let currentOn = (i18nKey == goldColorTab) ? true : false;
      // edit the link each tab going to have
      let linkSearch = '';
      switch (i18nKey) {
        case 'title_NavAtNode_':
          linkSearch = '';
          break;
        case 'tab_Routes':
          linkSearch = '?tab=routes';
          break;
        case 'tab_Steps':
          linkSearch = '?tab=steps&_filter_nodes=true';
          break;
        default:
          // do nothing, keep linkSearch as origin
      };
      let linkObj = {
        pathname: this.props.location.pathname,
        search: linkSearch,
        state: {from: this.props.location}
      };
      return (
        <Link
          key={"key_pathNavFeed_tab_"+i18nKey}
          to={linkObj}
          className={classnames(
            'plainLinkButton', styles.linkNavFeed,
            {
              [styles.linkNavFeedSide]: (i18nKey == 'tab_Steps'),
              [styles.linkNavFeedTabOn]: currentOn
            }
          )}>
          <span
            link={i18nKey}
            className={classnames(
              "fontContentPlain", "weightBold",
              {
                ["colorAssistGold"]: currentOn,
                ["colorWhiteGrey"]: (!currentOn && (this.state.onLink !=  i18nKey)),
                ["colorEditBlack"]: (!currentOn && (this.state.onLink ==  i18nKey)),
                [styles.spanLink]: this.state.onLink !=  i18nKey,
                [styles.spanLinkMouseOn]: (!currentOn && (this.state.onLink ==  i18nKey)),
              }
            )}
            onTouchStart={this._handleEnter_linkNavFeed}
            onTouchEnd={this._handleLeave_linkNavFeed}
            onMouseEnter={this._handleEnter_linkNavFeed}
            onMouseLeave={this._handleLeave_linkNavFeed}>
            { this.props.i18nUIString.catalog[i18nKey] }
          </span>
        </Link>
      )
    })

    return tabDOM;
  }

  render(){
    let urlParams = new URLSearchParams(this.props.location.search); //we need value in URL query
    this.currentTab = urlParams.get('tab'); // could be "undefined"

    return(
      <div
        className={classnames(styles.comNavFeed)}>
        {
          this._render_navTab()
        }
      </div>
    )
  }

  _handleEnter_linkNavFeed(e){
    let currentLink = e.currentTarget.getAttribute('link');
    this.setState((prevState, props)=>{
      return {
        onLink: currentLink
      }
    })
  }

  _handleLeave_linkNavFeed(e){
    this.setState((prevState, props)=>{
      return {
        onLink: false
      }
    })
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
