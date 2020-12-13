import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import stylesNail from "../../../stylesNail.module.css";
import FeedEmpty from './FeedEmpty.jsx';
import NailFeedFocus from '../../../../Components/Nails/NailFeedFocus/NailFeedFocus.jsx';
import NailFeedMobile from '../../../../Components/Nails/NailFeedMobile/NailFeedMobile.jsx';
import AccountPalette from '../../../../Components/AccountPalette.jsx';
import {_axios_get_accumulatedList} from '../axios.js';
import {axios_get_UnitsBasic} from '../../../../utils/fetchHandlers.js';
import {
  handleNounsList,
  handleUsersList,
  handlePathProjectsList
} from "../../../../redux/actions/general.js";
import {
  cancelErr,
  uncertainErr
} from "../../../../utils/errHandlers.js";
import {
  domain
} from '../../../../../config/services.js';

class Feed extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      feedList: [],
      unitsBasic: {},
      marksBasic: {},
      scrolled: true,
      onNodeLink: false
    };
    this.refScroll = React.createRef();
    this.axiosSource = axios.CancelToken.source();
    this._set_feedUnits = this._set_feedUnits.bind(this);
    this._check_Position = this._check_Position.bind(this);
    this._render_FeedNails = this._render_FeedNails.bind(this);
    this._render_FooterHint = this._render_FooterHint.bind(this);
    this._handleEnter_NodeLink = this._handleEnter_NodeLink.bind(this);
    this._handleLeave_NodeLink = this._handleLeave_NodeLink.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){
    this._set_feedUnits();
    window.addEventListener("scroll", this._check_Position);
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
    window.removeEventListener("scroll", this._check_Position);
  }

  _render_FooterHint(){
    // by feed length, we gave users some message about the thing they could do
    if (this.state.feedList.length> 0){
      return (
        <div>
          <span
            className={classnames("fontTitleSmall", "colorLightGrey")}
            style={{margin: "8px 0", display: 'inline-block' }}>
            {this.props.i18nUIString.catalog['descript_AroundIndex_footer']}
          </span>
        </div>
      );
    }
    else{ // most reason to:no feed at all
      return null;
    }
  }

  _render_FeedNails(){
    let groupsDOM = [];
    const _nailsGroup = (unitGroup, groupIndex)=>{
      let nailsDOM = [];
      unitGroup.forEach((unitId, index) => {
        //render if there are something in the data
        if( !(unitId in this.state.unitsBasic)) return; //skip if the info of the unit not yet fetch
        // for mobile device, use one special Nail
        let cssVW = window.innerWidth;

        nailsDOM.push (
          <div
            key={"key_NodeFeed_new_"+index}
            className={classnames(styles.boxModuleItem)}>
              <div
                className={classnames(styles.boxFocusNailSubtitle)}>
                <div
                  className={classnames(styles.boxSubtitleFlex, styles.boxSmallNoFlex)}>
                  <div
                     className={classnames(styles.boxFocusNailSubtitleUp, 'colorStandard')}>
                    <AccountPalette
                      size={"regularBold"}
                    referLink={
                      (this.state.unitsBasic[unitId].authorIdentity == 'pathProject') ?
                        (
                          domain.protocol + "://" +
                          domain.name + '/cosmic/explore/path/' +
                          (
                            this.state.unitsBasic[unitId].authorId in this.props.pathsBasic &&
                            this.props.pathsBasic[this.state.unitsBasic[unitId].authorId].pathName)
                        ) : (
                          domain.protocol + "://" +
                          domain.name + '/cosmic/explore/user?userId=' +
                          this.state.unitsBasic[unitId].authorId
                        )
                    }
                    userId={this.state.unitsBasic[unitId].authorId}
                    authorIdentity={this.state.unitsBasic[unitId].authorIdentity}
                      styleLast={(this.state.unitsBasic[unitId].authorIdentity == 'pathProject') ? { color: 'rgb(69, 135, 160)'} : {}}/>
                    <span
                      className={classnames(styles.spanFocusSubtitleConnect, 'colorEditLightBlack', 'fontSubtitle_h5')}>
                      {this.props.i18nUIString.catalog['connection_focus_userNode']}
                    </span>
                  </div>
                <div
                  className={classnames(styles.boxFocusNailSubtitleLow)}>
                  <Link
                    to={"/cosmic/explore/node?nodeid=" + this.state.unitsBasic[unitId].nounsList[0]}
                    className={classnames('plainLinkButton')}
                    eventkey={"mouseEvKey_node_" + unitId + "_" + this.state.unitsBasic[unitId].nounsList[0]}
                    onMouseEnter={this._handleEnter_NodeLink}
                    onMouseLeave={this._handleLeave_NodeLink}>
                    {(this.state.unitsBasic[unitId].nounsList[0] in this.props.nounsBasic) &&
                      <span
                        className={classnames(
                          "fontNodesEqual", "weightBold", "colorEditBlack",
                          styles.spanBaseNode,
                          { [styles.spanBaseNodeMouse]: this.state.onNodeLink == ("mouseEvKey_node_" + unitId + "_" + this.state.unitsBasic[unitId].nounsList[0]) }
                        )}>
                        {this.props.nounsBasic[this.state.unitsBasic[unitId].nounsList[0]].name}</span>
                    }
                  </Link>
                  <span
                    className={classnames("fontNodesEqual", "colorEditBlack", "weightBold")}>
                    {this.state.unitsBasic[unitId].nounsList[0] in this.props.nounsBasic ? (
                      (this.props.nounsBasic[this.state.unitsBasic[unitId].nounsList[0]].prefix.length > 0) &&
                      (", ")) : (null)
                    }
                  </span>
                  <br/>
                  {
                    (this.state.unitsBasic[unitId].nounsList[0] in this.props.nounsBasic &&
                      this.props.nounsBasic[this.state.unitsBasic[unitId].nounsList[0]].prefix.length > 0) &&
                    <div
                      className={classnames('plainLinkButton')}
                      style={{display: 'inline-block'}}
                      eventkey={"mouseEvKey_node_" + unitId + "_prefix_" + this.props.nounsBasic[this.state.unitsBasic[unitId].nounsList[0]].parentId}>
                        <span
                          className={classnames("fontSubtitle", "weightBold", "colorEditBlack")}>
                          {this.props.nounsBasic[this.state.unitsBasic[unitId].nounsList[0]].prefix}</span>
                    </div>
                  }
                </div>
                </div>
              </div>
              <div
                className={classnames(stylesNail.boxNail, stylesNail.custFocusNailWide)}>
                {
                  (cssVW < 860) ? (
                    <NailFeedMobile
                      {...this.props}
                      leftimg={false}
                      unitId={unitId}
                      nodisplay={['author']}
                      linkPath={this.props.location.pathname + ((this.props.location.pathname == '/') ? 'unit' : '/unit')}
                      unitBasic={this.state.unitsBasic[unitId]}
                      marksBasic={this.state.marksBasic} />
                  ): (
                    <NailFeedFocus
                      {...this.props}
                      leftimg={true}
                      unitId={unitId}
                      narrowWidth={false}
                      linkPath={this.props.location.pathname + ((this.props.location.pathname == '/') ? 'unit' : '/unit')}
                      unitBasic={this.state.unitsBasic[unitId]}
                      marksBasic={this.state.marksBasic} />
                  )
                }
              </div>
          </div>
        );
      });

      return nailsDOM;
    };

    this.state.feedList.forEach((unitGroup, index)=>{
      groupsDOM.push(
        <div
          key={"key_PathProject_FeedGroup"+index}
          className={classnames(
            styles.boxModule,
            styles.boxModuleSmall,
          )}>
          {_nailsGroup(unitGroup, index)}
        </div>
      );
    });

    return groupsDOM;
  }

  render(){
    return (
      <div className={styles.comFocusBoardFeed}>
        <div>
          {
            (this.state.feedList.length > 0) &&
            <div>
              {this._render_FeedNails()}
            </div>
          }
          {
            ((this.state.feedList.length == 0) &&
              !this.state.scrolled &&
              !this.state.axios
            ) &&
            <div
              className={classnames(
                styles.boxModule,
                styles.boxModuleSmall,
              )}>
              <FeedEmpty
                {...this.props}/>
            </div>
          }

          <div ref={this.refScroll}/>
          <div
            className={classnames(styles.boxFooter)}>
            {this._render_FooterHint()}
          </div>
        </div>
      </div>
    )
  }

  _check_Position(){
    let boxScrollBottom = this.refScroll.current.getBoundingClientRect().bottom, //bottom related top of viewport of box Scroll
        windowHeightInner = window.innerHeight; //height of viewport
    //now, the bottom would change base on scroll, and calculate from the top of viewport
    //we set the threshould of fetch to the 2.5 times of height of viewport.
    //But! we only fetch if we are 'not' fetching--- check the axios status.
    if(!this.state.axios &&
      boxScrollBottom < (2.5*windowHeightInner) &&
      boxScrollBottom > windowHeightInner && // safety check, especially for the very beginning, or nothing in the list
      this.state.scrolled // checkpoint from the backend, no items could be res if !scrolled
    ){
      //base on the concept that bottom of boxScroll should always lower than top of viewport,
      //and do not need to fetch if you have see the 'real' bottom.
      this._set_feedUnits();
    }
  }

  _set_feedUnits(lastUnitTime){
    // feeds was selected by the last unit get last round
    if(!lastUnitTime && this.state.feedList.length > 0){
      //set the lastUnitTime if no assigned, after the list had already had something
      let group, groupLength;
      let list = this.state.feedList;
      group = list[list.length-1];
      groupLength = group.length;
      lastUnitTime = this.state.unitsBasic[group[groupLength-1]].createdAt;
    };
    const self = this;
    this.setState({axios: true});

    _axios_get_accumulatedList(this.axiosSource.token, {
      listUnitBase: lastUnitTime,
    })
    .then((resObj)=>{
      if(resObj.main.unitsList.length > 0){
        self.setState((prevState, props)=>{
          let copyList = prevState.feedList.slice();
          copyList.push(resObj.main.unitsList);
          return {
            feedList: copyList,
            scrolled: resObj.main.scrolled
          }
        });

        return axios_get_UnitsBasic(self.axiosSource.token, resObj.main.unitsList);
      }
      else{
        self.setState({scrolled: resObj.main.scrolled}) // don't forget set scrolled to false to indicate the list was end
        return { //just a way to deal with the next step, stop further request
          main: {
            nounsListMix: [],
            usersList: [],
            pathsList: [],
            unitsBasic: {},
            marksBasic: {}
          }}};
    })
    .then((resObj)=>{
      //after res of axios_Units: call get nouns & users
      self.props._submit_NounsList_new(resObj.main.nounsListMix);
      self.props._submit_UsersList_new(resObj.main.usersList);
      self.props._submit_PathsList_new(resObj.main.pathsList);
      //and final, update the data of units to state
      self.setState((prevState, props)=>{
        return ({
          axios: false,
          unitsBasic: {...prevState.unitsBasic, ...resObj.main.unitsBasic},
          marksBasic: {...prevState.marksBasic, ...resObj.main.marksBasic}
        });
      });
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

  _handleEnter_NodeLink(e) {
    let target = e.currentTarget.getAttribute('eventkey');
    this.setState({ onNodeLink: target })
  }

  _handleLeave_NodeLink(e) {
    this.setState({ onNodeLink: false })
  }
}

const mapStateToProps = (state)=>{
  return {
    i18nUIString: state.i18nUIString,
    nounsBasic: state.nounsBasic,
    pathsBasic: state.pathsBasic
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_NounsList_new: (arr) => { dispatch(handleNounsList(arr)); },
    _submit_UsersList_new: (arr) => { dispatch(handleUsersList(arr)); },
    _submit_PathsList_new: (arr) => { dispatch(handlePathProjectsList(arr)); },
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Feed));
