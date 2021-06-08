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
      onCreate: false
    };
    this.refMainContent = React.createRef();
    this.wrapperAround = React.createRef();
    this._handleScroll_MainContent = this._handleScroll_MainContent.bind(this);
    this._handleEnter_Upload = this._handleEnter_Upload.bind(this);
    this._handleLeave_Upload = this._handleLeave_Upload.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    // the 'top' value state was static after mount
    // we have to modify it manually if the 'screen' size was change
    let newViewportHeight = window.innerHeight;
    let newViewportWidth = window.innerWidth;
    if(
      prevState.viewportHeight != newViewportHeight &&
      prevState.viewportWidth != newViewportWidth
    ){
      let mainContentOffset = this.refMainContent.current.getBoundingClientRect();
      this.setState({
        mainContentFixedTop: mainContentOffset.top,
        viewportHeight: newViewportHeight,
        viewportWidth: newViewportWidth
      });
    };
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
                  className={classnames(styles.boxIndexShare)}>
                  <div
                    className={classnames(
                      styles.comBtnUpload,styles.btnBorder,
                      {[styles.comMouseEnter]: (this.state.onCreate) }
                    )}
                    onTouchStart={this._handleEnter_Upload}
                    onTouchEnd={this._handleLeave_Upload}
                    onMouseEnter={this._handleEnter_Upload}
                    onMouseLeave={this._handleLeave_Upload}>
                    <span
                      className={classnames(
                        styles.spanWriter, 'lineHeight15', "fontNodesEqual", "weightBold",
                        {
                          ['colorStandard']: (this.state.onCreate),
                          ['colorGrey']: (!this.state.onCreate),
                        }
                      )}>
                      {this.props.i18nUIString.catalog['submit_nav_Signup'] }
                    </span>
                  </div>
                </div>
              </div>
              <div
                className={classnames(styles.boxRow, styles.boxNavContent)}>
                <div
                  className={classnames(styles.boxNavFeed)}>
                  <NavFeed
                    {...this.props}
                    sideOpacityParam={this.state.opacityParam}/>
                </div>
                <div
                  className={classnames(styles.boxFeed)}
                  style={todayNodesStyle}>
                  <FeedUnsign
                    {...this.props}
                    _refer_von_cosmic={this.props._refer_von_cosmic} />
                </div>
              </div>
            </div>

        <Route
          path={((this.props.location.pathname =="/") ? '' : this.props.location.pathname.slice(0, -5))+ '/unit' }
          render={(props)=> {
            return (
              <UnitUnsign
                {...props}
                _refer_von_unit={this.props._refer_von_cosmic}/>
            )
          }
        }/>
      </div>
    )
  }

  _handleScroll_MainContent(event){
    // keep "default"
    event.stopPropagation();
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

  _handleEnter_Upload(e){
    this.setState({onCreate: true})
  }

  _handleLeave_Upload(e){
    this.setState({
      onCreate: false})
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
