import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import stylesFont from "../../stylesFont.module.css";
import GatheringBase from './GatheringBase.jsx';

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
    let gatheringify = this.props.location.pathname.includes('fellows') ? false : true;

    return(
      <div
        className={classnames(styles.comNavFeed, styles.boxTitle)}>
        <div
          style={{display:'flex'}}>
          <Link
            to={ "/" }
            topath={"gathering"}
            className={
              // classnames('plainLinkButton', styles.boxLinkLeft)
              classnames('plainLinkButton')
            }
            style={{cursor: 'default'}}
            onClick={(e)=>{ if( gatheringify ) e.preventDefault(); }}
            onMouseEnter={this._handleEnter_link}
            onMouseLeave={this._handleLeave_link}>
            <span
              className={classnames(
                "fontContentPlain", "weightBold",
                {
                  [styles.spanLinkMouse]: (this.state.onNavLink == 'gathering' && !gatheringify),
                  ["colorLightGrey"]: !gatheringify,
                  ["colorAssistGold"]: gatheringify
                }
              )}>
              {this.props.i18nUIString.catalog["title_FeedAssigned_"] }
            </span>
          </Link>
          {
            /*
            to hide the link from client, we comment out this paragraph
            <Link
              to={ "/fellows" }
              topath={"fellows"}
              className={classnames('plainLinkButton', styles.boxLinkRight)}
              style={{cursor: 'default'}}
              onClick={(e)=>{ if( !gatheringify ) e.preventDefault(); }}
              onMouseEnter={this._handleEnter_link}
              onMouseLeave={this._handleLeave_link}>
              <span
                className={classnames(
                "fontContentPlain", "weightBold",
                  {
                    [styles.spanLinkMouse]: (this.state.onNavLink == 'fellows' && gatheringify),
                    ["colorLightGrey"]: gatheringify,
                    ["colorAssistGold"]: !gatheringify
                  }
                )}>
                {this.props.i18nUIString.catalog["link_Fellows"] }
              </span>
            </Link>
            */
          }
        </div>
        <div
          className={classnames(styles.boxGatheringBase)}>
          <GatheringBase/>
          <div>
            <span
              className={classnames('colorWhiteGrey', 'fontContentPlain', 'smallDisplayNone')}
              style={{ padding: '0 5px' }}>
              {"．"}
            </span>
            <Link
              to={"/cosmic/focus"}
              topath={"focus"}
              className={classnames('plainLinkButton')}
              onTouchStart={this._handleEnter_link}
              onTouchEnd={this._handleLeave_link}
              onMouseEnter={this._handleEnter_link}
              onMouseLeave={this._handleLeave_link}
              style={{ padding: '0 5px' }}>
              <span
                className={classnames(
                  "fontContentPlain", "weightBold", styles.spanBaseNode,
                  {
                    [styles.spanBaseNodeMouse]: (this.state.onNavLink == 'focus'),
                    ["colorWhiteGrey"]: (this.state.onNavLink != 'focus'),
                    ["colorEditBlack"]: (this.state.onNavLink == 'focus')
                  }
                )}>
                {this.props.i18nUIString.catalog['link_Focus']}</span>
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
