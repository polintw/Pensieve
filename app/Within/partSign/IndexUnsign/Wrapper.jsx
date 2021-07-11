import React from 'react';
import {
  Link,
  Switch,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import FeedUnsign from './FeedUnsign/FeedUnsign.jsx';
import NavFeed from "./NavFeed/NavFeed.jsx";
import SetBtnSign from '../components/SetBtnSign/SetBtnSign.jsx';
import UnitUnsign from '../../../Unit/UnitUnsign/UnitUnsign.jsx';

class Wrapper extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      mainContentFixedTop: null,
      viewportHeight: window.innerHeight, // init static
      viewportWidth: window.innerWidth,
      opacityParam: 1,
      savedPosition: null,
    };
    this.refMainContent = React.createRef();
    this.wrapperAround = React.createRef();
    this._handleScroll_MainContent = this._handleScroll_MainContent.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    // and the way to 'hide' Feed when the Unit was opened
    let urlParams = new URLSearchParams(this.props.location.search); //we need value in URL query
    let prevUrlParmas = new URLSearchParams(prevProps.location.search);
    if(
      (this.props.location.pathname != prevProps.location.pathname && this.props.location.pathname.includes('/unit')) ||
      (urlParams.has('creating') && !prevUrlParmas.has("creating"))
    ){
      let savedPosition = window.scrollY;
      this.setState((prevState, props)=>{
        return {
          savedPosition: savedPosition
        };
      }, ()=>{
        this.wrapperAround.current.style.display='none';
      });
    }
    else if(
      (this.props.location.pathname != prevProps.location.pathname &&
      prevProps.location.pathname.includes('/unit') &&
      !this.props.location.pathname.includes('/unit') )||
      (!urlParams.has('creating') && prevUrlParmas.has("creating"))
    ){
      this.wrapperAround.current.style={};
      window.scroll(0, prevState.savedPosition);
      this.setState({
        savedPosition: null
      });
    };
  }

  componentDidMount(){
    // we keep the 'top' value of the content box into state after the comps. mount
    let mainContentOffset = this.refMainContent.current.getBoundingClientRect();
    this.setState({
      mainContentFixedTop: mainContentOffset.top
    });
    window.addEventListener('scroll', this._handleScroll_MainContent, {passive: false});
    //because the modern browser set the 'passive' property of addEventListener default to true,
    //it would block the e.preventDefault() useage
    //so we could only add listener manually like this way
  }

  componentWillUnmount(){
    //and don't forget to move any exist evetListener
    window.removeEventListener('scroll',this._handleScroll_MainContent);
  }

  render(){
    let mainBoxStyle = {
      top: !!this.state.mainContentFixedTop ? (this.state.mainContentFixedTop.toString() + "px") : "unset",
      opacity: this.state.opacityParam
    };
    let todayNodesStyle = {
      opacity: 1 - this.state.opacityParam
    };
    return(
      <div>
        <div
          ref={this.wrapperAround}
          className={classnames(styles.comAroundWrapper)}>
          <div
            ref={this.refMainContent}
            className={classnames(
              styles.boxRow, styles.boxMainContent)}
            style={mainBoxStyle}>
            <div
              className={classnames(styles.boxIndexTitle)}>
              <span
                className={classnames(
                  "fontTitleBig", "colorSignBlack", "weightBold")}>
                {this.props.i18nUIString.catalog['title_AroundIndex_']}
              </span>
            </div>
            <div
              className={classnames(styles.boxSetBtnSign)}>
              <SetBtnSign
                {...this.props}/>
            </div>
          </div>
          <div
            className={classnames(styles.boxRow, styles.boxNavContent)}>
            <a id={"topFeed"} style={{opacity: '0'}}/>
            <div
              className={classnames(styles.boxNavFeed)}>
              <NavFeed
                {...this.props}
                sideOpacityParam={this.state.opacityParam}/>
            </div>
            <div
              className={classnames(styles.boxIntro)}
              style={todayNodesStyle}>
              <span
                className={classnames("colorSignBlack", "fontTitle")}
                style={{display: 'inline-block'}}>
                {this.props.i18nUIString.catalog["guiding_IndexUnsign_FeedBrowse"]}
              </span>
            </div>
            <div
              className={classnames(styles.boxFeed)}
              style={todayNodesStyle}>
              <FeedUnsign
                {...this.props}
                _refer_von_cosmic={this.props._refer_von_Sign} />
            </div>
            <div
              className={classnames(styles.boxIntroSet)}
              style={todayNodesStyle}>
              <div
                className={classnames(styles.boxTitle)}
                style={{textAlign: 'center'}}>
                <span
                  className={classnames("fontSubtitle", "colorAssistGold", "weightBold")}>
                  {this.props.i18nUIString.catalog["title_IndexUnsign_introAbout"] }
                </span>
              </div>
              <div
                className={classnames(styles.boxIntro)}
                style={{alignSelf: 'flex-end', textAlign: 'right', height: 'unset', margin: '8px 0'}}>
                <span
                  className={classnames("colorSignBlack", "fontTitle")}
                  style={{display: 'inline-block'}}>
                  {this.props.i18nUIString.catalog["guiding_IndexUnsign_introAbout"]}
                </span>
              </div>
            </div>
            <div
              className={classnames(styles.boxRow, styles.boxFooter)}
              style={todayNodesStyle}>
              <div
                className={classnames(styles.boxFooterBtn)}>
                <span
                  className={classnames(styles.boxTitle, "colorSignBlack", "fontTitle")}>
                  {this.props.i18nUIString.catalog["guiding_IndexUnsign_FooterInvite"]}
                </span>
                <div
                  className={classnames(styles.boxSetBtnSign)}>
                  <SetBtnSign
                    {...this.props}/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Route
          path={((this.props.location.pathname =="/") ? '' : this.props.location.pathname.slice(0, -5))+ '/unit' }
          render={(props)=> {
            return (
              <UnitUnsign
                {...props}
                _refer_von_unit={this.props._refer_von_Sign}/>
            )
          }
        }/>
      </div>
    )
  }

  _handleScroll_MainContent(event){
    // keep "default"
    event.stopPropagation();
    if(this.props.location.pathname.includes('/unit')) return; // Important! Stop updating the state if Unit was opened. it would cause CSS render problem on iPhone(infinite loop maybe)
    let viewportHeight = window.innerHeight;
    let scrollTop = window.scrollY;
    let opacityParam = 1;
    if(scrollTop == 0){
      this.setState({
        opacityParam: 1
      })
    }
    else if(scrollTop != 0 && scrollTop < (viewportHeight*2/5) ){
      opacityParam = (((viewportHeight*2/5) - scrollTop)/(viewportHeight*2/5)) * 0.8;
      this.setState({
        opacityParam: opacityParam
      });
    }
    else if(
      scrollTop != 0 && scrollTop > (viewportHeight*2/5) &&
      this.state.opacityParam // not '0'
    ){
      this.setState({
        opacityParam: 0
      })
    }
    else return ;
  }

}


const mapStateToProps = (state)=>{
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
)(Wrapper));
