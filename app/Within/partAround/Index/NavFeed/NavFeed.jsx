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
    let sidePropsStyle = {
      opacity: this.props.sideOpacityParam}
    let centerPropsStyle = { opacity: 1 - this.props.sideOpacityParam };

    return(
      <div
        className={classnames(styles.comNavFeed, styles.boxTitle)}>
        <div
          className={classnames(styles.boxLinks)}>
          <div
            className={classnames(styles.boxLinksToPersonal)}>
            <Link
              to={ "/self/shareds" }
              topath={"personal"}
              className={classnames('plainLinkButton')}
              onTouchStart={this._handleEnter_link}
              onTouchEnd={this._handleLeave_link}
              onMouseUp={this._handleLeave_link}
              onMouseEnter={this._handleEnter_link}
              onMouseLeave={this._handleLeave_link}
              style={ sidePropsStyle }>
              <span
                className={classnames(
                  "fontSubtitle",
                  {
                    [styles.spanLinkMouse]: (this.state.onNavLink == 'personal'),
                    ["colorLightGrey"]: (this.state.onNavLink != 'personal'),
                    ["colorEditBlack"]: (this.state.onNavLink == 'personal'),
                    ["weightBold"]: (this.state.onNavLink == 'personal')
                  }
                )}>
                {this.props.i18nUIString.catalog["title_Index_NavFeed_"][0] }
              </span>
            </Link>
            <Link
              to={ "/self/shareds?tab=nodes" }
              topath={"selfNodes"}
              className={classnames('plainLinkButton')}
              onTouchStart={this._handleEnter_link}
              onTouchEnd={this._handleLeave_link}
              onMouseUp={this._handleLeave_link}
              onMouseEnter={this._handleEnter_link}
              onMouseLeave={this._handleLeave_link}
              style={ sidePropsStyle }>
              <span
                className={classnames(
                  "fontSubtitle",
                  {
                    [styles.spanLinkMouse]: (this.state.onNavLink == 'selfNodes'),
                    ["colorLightGrey"]: (this.state.onNavLink != 'selfNodes'),
                    ["colorEditBlack"]: (this.state.onNavLink == 'selfNodes'),
                    ["weightBold"]: (this.state.onNavLink == 'selfNodes')
                  }
                )}>
                {this.props.i18nUIString.catalog["title_Index_NavFeed_"][2] }
              </span>
            </Link>
            <Link
              to={ "/self/shareds?tab=map" }
              topath={"selfMap"}
              className={classnames('plainLinkButton')}
              onTouchStart={this._handleEnter_link}
              onTouchEnd={this._handleLeave_link}
              onMouseUp={this._handleLeave_link}
              onMouseEnter={this._handleEnter_link}
              onMouseLeave={this._handleLeave_link}
              style={ sidePropsStyle }>
              <span
                className={classnames(
                  "fontSubtitle",
                  {
                    [styles.spanLinkMouse]: (this.state.onNavLink == 'selfMap'),
                    ["colorLightGrey"]: (this.state.onNavLink != 'selfMap'),
                    ["colorEditBlack"]: (this.state.onNavLink == 'selfMap'),
                    ["weightBold"]: (this.state.onNavLink == 'selfMap')
                  }
                )}>
                {"\xa0" + this.props.i18nUIString.catalog["title_Index_NavFeed_"][1] + "\xa0"}
              </span>
            </Link>
          </div>
          <div
            className={classnames(styles.boxDecoLine)}
            style={ Object.assign({}, sidePropsStyle)}>
            <svg viewBox="0 0 20 20"
              style={Object.assign({}, {
                height: '100%',
                maxWidth: '100%',
                position: 'relative',
                boxSizing: 'border-box'
              })}>
              <circle fill="#b8b8b8" cx="10" cy="10" r="10"></circle>
            </svg>
            <a id={"topFeed"} style={{opacity: '0'}}/>
          </div>
          <div
            className={classnames(styles.boxLinksExplore)}>
            <a
              href={"#topFeed"}
              topath={"int_feedAssigned"}
              className={classnames(
                'plainLinkButton', 
              )}
              onTouchStart={this._handleEnter_link}
              onTouchEnd={this._handleLeave_link}
              onMouseUp={this._handleLeave_link}
              onMouseEnter={this._handleEnter_link}
              onMouseLeave={this._handleLeave_link}
              style={Object.assign({}, { margin: '0px 16px' }, centerPropsStyle)}>
              <span
                className={classnames(
                  "fontSubtitle", "colorAssistGold", "weightBold",
                  { [styles.spanLinkMouse]: (this.state.onNavLink == 'int_feedAssigned') }
                )}>
                {this.props.i18nUIString.catalog["title_Index_NavFeed_"][3]}
              </span>
            </a>
            <Link
              to={"/cosmic/nodes"}
              topath={"cosmic_nodes"}
              className={classnames(
                'plainLinkButton',
                { // to control together by style
                  ["colorLightGrey"]: (this.state.onNavLink != 'cosmic_nodes'),
                  ["colorEditBlack"]: (this.state.onNavLink == 'cosmic_nodes'),
                  ["weightBold"]: (this.state.onNavLink == 'cosmic_nodes')
                }
              )}
              onTouchStart={this._handleEnter_link}
              onTouchEnd={this._handleLeave_link}
              onMouseUp={this._handleLeave_link}
              onMouseEnter={this._handleEnter_link}
              onMouseLeave={this._handleLeave_link}
              style={Object.assign({}, { margin: '0px 16px' }, centerPropsStyle)}>
              <span
                className={classnames(
                  "fontSubtitle",
                  { [styles.spanLinkMouse]: (this.state.onNavLink == 'cosmic_nodes') }
                )}>
                {this.props.i18nUIString.catalog["tab_Nodes"]}
              </span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  _handleEnter_link(e){
    let linkTo = e.currentTarget.getAttribute('topath');
    this.setState({onNavLink: linkTo});
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
