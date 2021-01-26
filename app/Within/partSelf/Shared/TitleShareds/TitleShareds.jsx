import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import NavShareds from './NavShareds.jsx';
import NavBtnRow from '../../../../Components/NavFilter/NavBtnRow.jsx';

class TitleShareds extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onLinkExpand: false,
      onPrimerLine: false
    };
    this._render_Greet = this._render_Greet.bind(this);
    this._handleEnter_LinkExpand = this._handleEnter_LinkExpand.bind(this);
    this._handleLeave_LinkExpand = this._handleLeave_LinkExpand.bind(this);
    this._handleEnter_primerLine = this._handleEnter_primerLine.bind(this);
    this._handleLeave_primerLine = this._handleLeave_primerLine.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){

  }

  componentWillUnmount(){

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

  render(){
    let pathProjectify = this.props.location.pathname.includes('/pathProject');
    let urlParams = new URLSearchParams(this.props.location.search); //we need value in URL query
    if(urlParams.has('filterNode')){
      this.filterNode = urlParams.get('filterNode');
    } else this.filterNode = false;

    return (
      <div className={styles.comTitleShareds}>
        <div
          className={classnames(styles.boxUpperRow)}>
          <div
            className={classnames(styles.rowTitleText)}>
            <span
              className={classnames("fontTitle", "colorEditBlack", "weightBold")}>
              {this.props.i18nUIString.catalog['title_yourShareds']}
            </span>
            <div style={{marginLeft: '3px'}}>
              {
                (!!this.props.userInfo.pathName && pathProjectify) &&
                <div
                  className={classnames("fontContentPlain", "colorGrey")}>
                  <span style={{cursor: 'default'}}>{"/ "}</span>
                  <a
                    href={'/cosmic/explore/path/'+ this.props.userInfo.pathName}
                    className={classnames('plainLinkButton', "colorAssistOcean")}
                    style={{
                      display: 'inline-block',
                      textDecoration: this.state.onPrimerLine? "underline": "none"
                    }}
                    onMouseEnter={this._handleEnter_primerLine}
                    onMouseLeave={this._handleLeave_primerLine}>
                    <span>
                      {this.props.userInfo.pathProject}
                    </span>
                  </a>
                </div>
              }
            </div>
          </div>
          <span
            className={classnames("fontContent", "colorEditBlack")}>
            {
              !pathProjectify &&
              this._render_Greet()}
          </span>
        </div>
        <div
          className={classnames(styles.boxBottomRow)}>
          <div>
            {
              !pathProjectify &&
              <div>
                <span
                  className={classnames(
                    "fontContent", 'colorGrey',
                    styles.smallDisplayInline
                  )}>
                  {"|"}
                </span>
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
                  {
                    !!this.props.userInfo.pathName &&
                    <span
                      className={classnames(
                        "fontContent", 'colorGrey',
                        styles.smallDisplayNone
                      )}>
                      {"\xa0" + "．" + "\xa0"}
                    </span>
                  }
                </div>
              }
          </div>
          {
            !!this.props.userInfo.pathName &&
            <NavShareds {...this.props}/>
          }
          <div>
            <NavBtnRow
              {...this.props}
              viewFilter={this.props.viewFilter}
              _set_viewFilter={this.props._set_viewFilter}/>
          </div>
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
