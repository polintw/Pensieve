import React from 'react';
import {
  Link,
  Redirect,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import {
  _axios_get_responds
} from '../utils.js';
import NailFeedWide from '../../Components/Nails/NailFeedWide/NailFeedWide.jsx';
import NailFeedMobile from '../../Components/Nails/NailFeedMobile/NailFeedMobile.jsx';
import {
  submitUnitRespondsList
} from "../../redux/actions/unit.js";
import {
  handleNounsList,
  handleUsersList,
} from "../../redux/actions/general.js";
import {axios_get_UnitsBasic} from '../../utils/fetchHandlers.js';
import {
  cancelErr,
  uncertainErr
} from "../../utils/errHandlers.js";

class Related extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      unitsBasic: {},
      marksBasic: {}
    };
    this.refScroll = React.createRef();
    this.axiosSource = axios.CancelToken.source();
    this._check_Position = this._check_Position.bind(this);
    this._set_respoondsUnits = this._set_respoondsUnits.bind(this);
    this._render_RespondsNails = this._render_RespondsNails.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    //due to update to unitId only still Redirect to a new URL
    //check again to re-define the URL
    if(!this.props.location.pathname.includes('explore/unit')) window.history.replaceState(this.props.location.state, '', '/cosmic/explore/unit?unitId='+this.unitId);
    //Note that, replaceState would also change the behavior of 'back' by browser, (only back to the new path)
    //we need to modify the behavior manually one day by 'popstate' iterate by the replaceState
  }

  componentDidMount(){
    this._set_respoondsUnits();
    window.addEventListener("scroll", this._check_Position);

    //replace the URL display in the browser bar if not from independt page
    if(!this.props.location.pathname.includes('explore/unit')) window.history.replaceState(this.props.location.state, '', '/cosmic/explore/unit?unitId='+this.unitId);
    //Note that, replaceState would also change the behavior of 'back' by browser, (only back to the new path)
    //we need to modify the behavior manually one day by 'popstate' iterate by the replaceState
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
    window.removeEventListener("scroll", this._check_Position);
  }

  _render_RespondsNails(){
    let groupsDOM = [];
    const _nailsGroup = (unitGroup, groupIndex)=>{
      let nailsDOM = [];
      unitGroup.forEach((unitId, index) => {
        //render if there are something in the data
        if( !(unitId in this.state.unitsBasic)) return; //skip if the info of the unit not yet fetch
        // for mobile device, use one special Nail
        let cssVW = window.innerWidth;
        if(cssVW < 860) {
          nailsDOM.push(
            <div
              key={"key_FeedAssigned_new_" + index}
              className={classnames(styles.boxNail, styles.custNailWide)}>
              <NailFeedMobile
                {...this.props}
                leftimg={false}
                unitId={unitId}
                linkPath={'/unit'}
                unitBasic={this.state.unitsBasic[unitId]}
                marksBasic={this.state.marksBasic} />
            </div>
          );
          return;
        };
        // for laptop / desktop, change nail by cycles
        nailsDOM.push (
          <div
            key={"key_FeedAssigned_new_"+index}
            className={classnames(styles.boxNail, styles.custNailWide)}>
            <NailFeedWide
              {...this.props}
              leftimg={ false}
              unitId={unitId}
              linkPath={'/unit'}
              unitBasic={this.state.unitsBasic[unitId]}
              marksBasic={this.state.marksBasic}/>
          </div>
        );
      });

      return nailsDOM;
    };

    this.props.unitCurrentResponds.list.forEach((unitGroup, index)=>{
      groupsDOM.push(
        <div
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
    let params = new URLSearchParams(this.props.location.search); //we need value in URL query
    this.unitId = params.get('unitId');

    return(
      <div
        className={classnames(styles.comRelated)}>
        <div
          className={classnames(styles.boxTitle)}>
          <span
            className={classnames('fontContentPlain', "weightBold", "colorAssistGold")}>
            {this.props.i18nUIString.catalog["title_Unit_ListResponds"]}</span>
        </div>
        {
          (this.props.unitCurrentResponds.list.length > 0) &&
          <div>
            {this._render_RespondsNails()}
          </div>
        }
        {
          ((this.props.unitCurrentResponds.list.length == 0) &&
            !this.state.axios &&
            !this.props.unitCurrentResponds.scrolled
          ) &&
          <div
            className={classnames(
              styles.boxModule,
              styles.boxModuleSmall,
            )}>
            <div
              className={classnames(styles.boxTitle, styles.boxDescript, "fontTitleSmall", "colorLightGrey")}>

              {this.props.i18nUIString.catalog['guiding_FeedAssigned_noneAssigned']}
            </div>
          </div>
        }

        <div ref={this.refScroll}/>

        <div
          className={styles.boxFooter}>
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
      this.props.unitCurrentResponds.scrolled // checkpoint from the backend, no items could be res if !scrolled
    ){
      //base on the concept that bottom of boxScroll should always lower than top of viewport,
      //and do not need to fetch if you have see the 'real' bottom.
      this._set_respoondsUnits();
    }
  }

  _set_respoondsUnits(){
    // feeds was selected by the last unit get last round
    let listUnitBase = false,
        list = (this.props.unitCurrentResponds.list.length > 0)? this.props.unitCurrentResponds.list : false;

    if(list){ //that's, if the list was empty---like at the beginning--- the listUnitBase would be 'false' as claim
      let group, groupLength;
      group = list[list.length-1];
      groupLength = list[list.length-1].length;
      listUnitBase = this.state.unitsBasic[group[groupLength-1]].createdAt;
    };
    const self = this;
    this.setState({axios: true});

    _axios_get_responds(this.axiosSource.token, {
      exposedId: this.unitId,
      listUnitBase: listUnitBase
    })
    .then((resObj)=>{
      // list was saved in redux state
      self.props._submit_list_UnitResponds({
        list: resObj.main.unitsList,
        scrolled: resObj.main.scrolled
      });

      return axios_get_UnitsBasic(self.axiosSource.token, resObj.main.unitsList) //and use the list to get the data of eahc unit
    })
    .then((resObj)=>{
      //after res of axios_Units: call get nouns & users
      self.props._submit_NounsList_new(resObj.main.nounsListMix);
      self.props._submit_UsersList_new(resObj.main.usersList);
      //and final, update the data of units to state
      self.setState((prevState, props)=>{
        return ({
          axios: false,
          unitsBasic: {...prevState.unitsBasic, ...resObj.main.unitsBasic},
          marksBasic: {...prevState.marksBasic, ...resObj.main.marksBasic}
        });
      });

    }).catch(function (thrown) {
      if (axios.isCancel(thrown)) {
        cancelErr(thrown);
      } else {
        self.setState((prevState, props)=>{
          return {axios:false}
        }, ()=>{
          let message = uncertainErr(thrown);
          if(message) alert(message);
        });
      }
    });
  }

}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    unitCurrent: state.unitCurrent,
    unitCurrentResponds: state.unitCurrentResponds
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_NounsList_new: (arr) => { dispatch(handleNounsList(arr)); },
    _submit_UsersList_new: (arr) => { dispatch(handleUsersList(arr)); },
    _submit_list_UnitResponds: (obj) => { dispatch(submitUnitRespondsList(obj)); }
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Related));
