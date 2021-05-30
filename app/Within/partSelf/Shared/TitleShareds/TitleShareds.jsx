import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import NavShareds from './NavShareds.jsx';

class TitleShareds extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onLink: false,
      onLinkExpand: false,
      onPrimerLine: false
    };
    this._render_Greet = this._render_Greet.bind(this);
    this._render_Title = this._render_Title.bind(this);
    this._handleEnter_LinkExpand = this._handleEnter_LinkExpand.bind(this);
    this._handleLeave_LinkExpand = this._handleLeave_LinkExpand.bind(this);
    this._handleEnter_primerLine = this._handleEnter_primerLine.bind(this);
    this._handleLeave_primerLine = this._handleLeave_primerLine.bind(this);
    this._handleEnter_linkNavFeed = this._handleEnter_linkNavFeed.bind(this);
    this._handleLeave_linkNavFeed = this._handleLeave_linkNavFeed.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  _render_nav(){
    let tabs = ["publications", "inspired", "map", "nodes"]
    let tabsi18nName = ["title_Publications", "title_Inspired", "tab_Map", "tab_Nodes"];

    let navDOM = tabs.map((tab, index)=>{
      let linkObj = {
        pathname: this.props.location.pathname,
        search: '?tab='+ tab,
        state: {from: this.props.location}
      };
      return (
        <Link
          key={"key_pathNavFeed_tab_"+tab}
          to={linkObj}
          link={tab}
          className={classnames(
            'plainLinkButton', styles.linkNavFeed,
          )}
          onTouchStart={this._handleEnter_linkNavFeed}
          onTouchEnd={this._handleLeave_linkNavFeed}
          onMouseEnter={this._handleEnter_linkNavFeed}
          onMouseLeave={this._handleLeave_linkNavFeed}>
          <span
            className={classnames(
              "fontContentPlain", "weightBold",
              {
                ["colorWhiteGrey"]: (this.state.onLink !=  tab),
                ["colorEditBlack"]: (this.state.onLink ==  tab),
                [styles.spanLink]: this.state.onLink !=  tab,
                [styles.spanLinkMouseOn]: (this.state.onLink ==  tab),
              }
            )}>
            { this.props.i18nUIString.catalog[tabsi18nName[index]] }
          </span>
        </Link>
      )
    });
    if( !this.currentTab){ //'undefined'
      navDOM[0] = (
        <span
          key={"key_pathNavFeed_tab_greet"}
          className={classnames("fontContentPlain", "colorEditBlack")}>
          {this._render_Greet()}
        </span>
      )
    }

    return navDOM;
  }

  _render_Greet(){
    let d = new Date();
    let currentHour = d.getHours();

    if(currentHour > 6 && currentHour < 12){
      return this.props.i18nUIString.catalog['message_SelfShareds_greet'][0]
    }
    else if(currentHour >= 12 && currentHour < 19){
      return this.props.i18nUIString.catalog['message_SelfShareds_greet'][1]
    }
    else if(currentHour >= 19 || currentHour < 2){
      return this.props.i18nUIString.catalog['message_SelfShareds_greet'][2]
    }
    else if(currentHour >= 2 && currentHour < 6){
      return this.props.i18nUIString.catalog['message_SelfShareds_greet'][3]
    };
  }

  _render_Title(){
    switch (this.currentTab) {
      case "inspired":
        return
        break;
      case "map":
        return
        break;
      case "nodes":
        return
        break;
      default: // 'undefined' currentTab
        return (this.props.i18nUIString.catalog['title_yourShareds'])
    }
  }

  render(){
    let urlParams = new URLSearchParams(this.props.location.search); //we need value in URL query
    this.currentTab = urlParams.get('tab'); // could be 'undefined'
    let pathProjectify = this.props.location.pathname.includes('/pathProject');

    return (
      <div className={styles.comTitleShareds}>
        <div
          className={classnames(styles.boxUpperRow)}>
          <div
            className={classnames(styles.rowTitleText)}>
            <span
              className={classnames("fontTitle", "colorEditBlack", "weightBold")}>
              {this._render_Title()}
            </span>
          </div>
          <div>
            {
              !!this.props.userInfo.pathName &&
              <NavShareds {...this.props}/>
            }
            <div>
              <span
                className={classnames(
                  "fontContent",
                  {
                    ['colorWhiteGrey']: !pathProjectify,
                    ['colorAssistOcean']: pathProjectify,
                  }
                )}>
                {"|"}
              </span>
              {
                pathProjectify ? (
                  <a
                    href={'/cosmic/explore/path/'+ this.props.userInfo.pathName}
                    className={classnames('plainLinkButton', styles.boxLinkExpand)}
                    onTouchStart={this._handleEnter_primerLine}
                    onTouchEnd={this._handleLeave_primerLine}
                    onMouseEnter={this._handleEnter_primerLine}
                    onMouseLeave={this._handleLeave_primerLine}>
                    <span
                      className={classnames(
                        "fontContent", "colorAssistOcean", styles.spanBaseNode,
                        {[styles.spanBaseNodeMouse]: this.state.onPrimerLine}
                      )}>
                      {this.props.userInfo.pathProject}
                    </span>
                  </a>
                ):(
                  <Link
                    to={"/cosmic/explore/user?userId=" + this.props.userInfo.id}
                    className={classnames(
                      'plainLinkButton', styles.boxLinkExpand)}
                      onTouchStart={this._handleEnter_LinkExpand}
                      onTouchEnd={this._handleLeave_LinkExpand}
                      onMouseEnter={this._handleEnter_LinkExpand}
                      onMouseLeave={this._handleLeave_LinkExpand}>
                      <span
                        className={classnames(
                          "fontContent", styles.spanBaseNode,
                          {
                            ["colorWhiteGrey"]: !this.state.onLinkExpand,
                            ['colorEditBlack']: this.state.onLinkExpand,
                            [styles.spanBaseNodeMouse]: this.state.onLinkExpand
                          }
                        )}>
                        {this.props.i18nUIString.catalog["link_PublicExpand"]}
                      </span>
                    </Link>
                )
              }
            </div>
          </div>
        </div>
        <div
          className={classnames(styles.boxBottomRow)}>
          { this._render_nav()}
        </div>
      </div>
    )
  }

  _handleEnter_LinkExpand(event) {
    this.setState({ onLinkExpand: true });
  }

  _handleLeave_LinkExpand(event){
    this.setState({onLinkExpand: false});
  }

  _handleEnter_primerLine(e){
    this.setState({onPrimerLine: true})
  }

  _handleLeave_primerLine(e){
    this.setState({onPrimerLine: false})
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
)(TitleShareds));
