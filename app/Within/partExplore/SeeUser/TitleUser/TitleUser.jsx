import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import AccountPalette from '../../../../Components/AccountPalette.jsx';

class TitleUser extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onLinkExpand: false
    };
    this._handleEnter_LinkExpand = this._handleEnter_LinkExpand.bind(this);
    this._handleLeave_LinkExpand = this._handleLeave_LinkExpand.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  render(){
    return (
      <div className={styles.comTitleUser}>
        <div
          className={classnames(styles.boxTitle)}
          style={{width: '100%',position: 'relative', textAlign: 'center'}}>
          {
            (this.props.userId == this.props.userInfo.id) &&
            <div
              className={classnames(styles.boxTitlePersonal)}>
              <div style={{fontSize: '2.4rem', lineHeight: '1.5'}}>{"\xa0"}</div>
              <div>
                <span
                  className={classnames(
                    "fontContent", 'colorEditBlack',
                    "smallDisplayNone"
                  )}>
                  {"|"}
                </span>
                <Link
                  to={"/self/shareds"}
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
                    {this.props.i18nUIString.catalog["link_ExpandPersonal"]}
                  </span>
                </Link>
              </div>
            </div>
          }
          <Link
            to={'/cosmic/explore/user?userId=' + this.props.userId }
            className={classnames('plainLinkButton', styles.linkTitleText)}>
            <AccountPalette
              size={"regularBold"}
              referLink={ false }
              styleFirst={{fontSize: '2.4rem'}}
              styleLast={{fontSize: '2.4rem'}}
              userId={this.props.userId}
              authorIdentity={"user"} />
          </Link>
          {
            (this.props.userId == this.props.userInfo.id) &&
            <div
              className={classnames(styles.smallLineExpand)}>{"\xa0"}</div>
          }
        </div>
        <div
          className={classnames(styles.boxTitle, styles.boxSubtitle)}>
          <div
            className={classnames(styles.boxSubtitleRow)}>
            <div
              className={classnames(styles.boxSubtitleLeft)}>
              <span
                className={classnames(
                  'fontContent', 'colorGrey',
                  styles.spanKey
                )}>
                {this.props.i18nUIString.catalog["title_Notes"]}
              </span>
              <span
                className={classnames("fontContent", "colorEditBlack", "weightBold")}>
                {this.props.userBasicInfo.countShareds}
              </span>
            </div>
            <div
              className={classnames(styles.boxSubtitleCenter)}>
              {"·"}
            </div>
            <div
              className={classnames(styles.boxSubtitleRight)}>
              <span
                className={classnames(
                  'fontContent', 'colorGrey',
                  styles.spanKey
                )}>
                {this.props.i18nUIString.catalog["text_since"]}
              </span>
              <span
                className={classnames("fontContent", "colorEditBlack", "weightBold")}>
                {this.props.userBasicInfo.timeCreate}
              </span>
            </div>
          </div>
          <div
            className={classnames(styles.boxSubtitleRow)}>
            <div
              className={classnames(styles.boxSubtitleLeft)}>
              <span
                className={classnames(
                  'fontContent', 'colorGrey',
                  styles.spanKey
                )}>
                {this.props.i18nUIString.catalog["text_peopleInspired"]}
              </span>
              <span
                className={classnames(
                  'fontContent', 'colorEditBlack', "weightBold",
                  styles.spanKey
                )}>
                {
                  this.props.userBasicInfo.inspiredCount == 0 ?
                  "--" :
                  this.props.userBasicInfo.inspiredCount
                }
              </span>
              {
                this.props.userBasicInfo.inspiredYou &&
                <div
                  className="plainBoxDisplay">
                  <span
                    className={classnames("fontContent", "colorGrey")}>
                    {this.props.i18nUIString.catalog["text_youInspired"][0]}
                  </span>
                  <span
                    className={classnames("fontContent", "colorAssistGold")}>
                    {this.props.i18nUIString.catalog["text_youInspired"][1]}
                  </span>
                  <span
                    className={classnames("fontContent", "colorGrey")}>
                    {this.props.i18nUIString.catalog["text_youInspired"][2]}
                  </span>
                </div>
              }
            </div>
          </div>
          <div
            className={classnames(styles.boxDecoLine)}/>
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
}


const mapStateToProps = (state)=>{
  return {
    tokenStatus: state.token,
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
)(TitleUser));
