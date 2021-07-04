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
import {
  axios_visit_GET_last,
  axios_visit_Index
} from './utils.js';
// import BelongsSet from './BelongsSet/BelongsSet.jsx';
import FeedAssigned from './FeedAssigned/FeedAssigned.jsx';
import IndexShare from './IndexShare/IndexShare.jsx';
import NavFeed from "./NavFeed/NavFeed.jsx";
// import OnBoard from '../OnBoard/Wrapper.jsx';
// import GuideNails from '../OnBoard/GuideNails.jsx';
import UnitScreen from '../../../Unit/UnitScreen/UnitScreen.jsx';
import {
  cancelErr,
  uncertainErr
} from '../../../utils/errHandlers.js';

class Wrapper extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      lastVisit: false,
      mainContentFixedTop: null,
      viewportHeight: window.innerHeight, // init static
      viewportWidth: window.innerWidth,
      opacityParam: 1,
      savedPosition: null
    };
    this.axiosSource = axios.CancelToken.source();
    this.refMainContent = React.createRef();
    this.wrapperAround = React.createRef();
    this._construct_UnitInit = this._construct_UnitInit.bind(this);
    this._render_Newly = this._render_Newly.bind(this);
    this._createdRespond = this._createdRespond.bind(this);
    this._handleScroll_MainContent = this._handleScroll_MainContent.bind(this);
  }

  _construct_UnitInit(match, location){
    let unitInit= {marksify: false, initMark: "first", layer: 0};
    return unitInit;
  }

  _createdRespond(){

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

    const self = this;
    this.setState({axios: true});

    //get the last visit situation for child component
    axios_visit_GET_last(self.axiosSource.token)
    .then(function(lastVisitRes){
      self.setState({
        axios: false,
        lastVisit: lastVisitRes.main.lastTime
      });
      //now, after everything was mount, we update the visiting time to the server
      return axios_visit_Index(self.axiosSource.token);
    })
    .catch(function (thrown) {
      self.setState({axios: false});
      if (axios.isCancel(thrown)) {
        cancelErr(thrown);
      } else {
        let message = uncertainErr(thrown);
        if(message) alert(message);
      }
    });
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
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
        {
          /*(this.props.userInfo.accountStatus == "newly") ? //should knew before React mount
          (
            this._render_Newly()
          ):*/(
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
                  <IndexShare
                    {...this.props}/>
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
                  <FeedAssigned
                    {...this.props}
                    lastVisit={this.state.lastVisit}
                    _refer_von_cosmic={this.props._refer_von_cosmic} />
                </div>
              </div>
            </div>
          )
        }

        <Route
          path={((this.props.location.pathname =="/") ? '' : this.props.location.pathname.slice(0, -5))+ '/unit' }
          render={(props)=> {
            return (
              <UnitScreen
                {...props}
                _createdRespond= {this._createdRespond}
                _construct_UnitInit={this._construct_UnitInit}
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
    if(this.props.location.pathname.includes('/unit')) return; // Important! Stop updating the state if Unit was opened. it would cause CSS render problem on iPhone(infinite loop maybe)
    let viewportHeight = window.innerHeight;
    let scrollTop = window.scrollY;
    let opacityParam = 1;
    if (scrollTop < (viewportHeight *  1/5) ){
      this.setState({
        opacityParam: 1
      })
    }
    else if(
      scrollTop > (viewportHeight * 1 / 5) &&
      scrollTop < (viewportHeight * 3 / 5 ) ){
      opacityParam = (((viewportHeight * 3 / 5) - scrollTop) / (viewportHeight * 3 / 5));
      this.setState({
        opacityParam: opacityParam
      });
    }
    else if(
      scrollTop > (viewportHeight * 3 / 5) &&
      this.state.opacityParam // not '0'
    ){
      this.setState({
        opacityParam: 0
      })
    }
    else return ;
  }

  _render_Newly(){
    return this.props.belongsByType.fetched ? // already recieved the res of belonstype
    (
      ( (!("homeland" in this.props.belongsByType) || (!this.props.belongsByType['homeland'])) && //no set homeland
        (!("residence" in this.props.belongsByType) || (!this.props.belongsByType["residence"])) // no set residence
      ) ? (
        <div
          className={classnames(styles.comAroundWrapper)}>
          /* OnBoard */
        </div>
      ) : (
        <div
          className={classnames(styles.comAroundWrapper)}>
          /* GuideNails & BelongsSet */
        </div>
      )
    ) :
    null;
  }
}


const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    belongsByType: state.belongsByType,
    sharedsList: state.sharedsList
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
