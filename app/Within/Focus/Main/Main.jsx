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
  nailChart,
  separationLine,
  axios_cosmic_IndexList,
  axios_visit_GET_last,
  axios_visit_Index
} from './utils.js';
import MainTitle from '../MainTitle/MainTitle.jsx';
import MainBanner from '../MainBanner/MainBanner.jsx';
import Unit from '../../../Unit/Unit/Unit.jsx';
import {
  handleNounsList,
  handleUsersList
} from "../../../redux/actions/general.js";
import {
  cancelErr,
  uncertainErr
} from '../../../utils/errHandlers.js';

const styleMiddle = {
  boxFooterInfo: {
    alignSelf: 'flex-end',
    margin: '4.2rem 0 1.6rem',
    padding: '2rem 1.2rem 0',
    color: '#ababab'
  },
  spanFooterInfo: {
    display: 'inline-block',
    boxSizing: 'border-block',
    marginRight: '0.42rem'
  },
  textFooterInfo: {
    fontSize: '1.21rem',
    letterSpacing: '0.1rem',
  }
}

class MainIndex extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axiosFocus: false,
      lastVisit: false,
      focusFetchTurn: 1,
      mountTodo: ["lastVisit", "listMain", "listBannerNew", "listBannerSelect"],
      unitsList: [],
      unitsBasic: {},
      marksBasic: {},
    };
    this.refScroll = React.createRef();
    this.axiosSource = axios.CancelToken.source();
    this._construct_UnitInit = this._construct_UnitInit.bind(this);
    this._render_IndexNails = this._render_IndexNails.bind(this);
    this._check_Position = this._check_Position.bind(this);
    this._set_mountToDo = this._set_mountToDo.bind(this);
    this._set_focusList = this._set_focusList.bind(this);
    this.style={
      withinCom_MainIndex_scroll_: {
        width: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box'
      },
      withinCom_MainIndex_scroll_col_footer: {
        display: 'inline-block',
        width: '100%',
        height: '33vh',
        position: 'relative',
        boxSizing: 'border-box'
      },
    }
  }

  _construct_UnitInit(match, location){
    let unitInit= {marksify: false, initMark: "all", layer: 0};
    return unitInit;
  }

  _check_Position(){
    let boxScrollBottom = this.refScroll.current.getBoundingClientRect().bottom, //bottom related top of viewport of box Scroll
        windowHeightInner = window.innerHeight; //height of viewport
    //now, the bottom would change base on scroll, and calculate from the top of viewport
    //we set the threshould of fetch to the 3 times of height of viewport.
    //But! we only fetch if we are 'not' fetching--- check the axios status.
    if(!this.state.axiosFocus && boxScrollBottom < (3*windowHeightInner) && boxScrollBottom > windowHeightInner){
      //base on the concept that bottom of boxScroll should always lower than top of viewport,
      //and do not need to fetch if you have see the 'real' bottom.
      this._set_focusList();
    }
  }

  _set_mountToDo(item){
    let itemIndex = this.state.mountTodo.indexOf(item);
    if(!(itemIndex < 0)) //skip if the item already rm
    this.setState((prevState, props)=>{
      //remove the label of this process from mout todo
      prevState.mountTodo.splice(itemIndex, 1);
      return ({
        mountTodo: prevState.mountTodo
      });
    }); //end of 'if'

  }

  _set_focusList(){
    const self = this;
    this.setState({axiosFocus: true});

    axios_cosmic_IndexList(self.axiosSource.token, this.state.focusFetchTurn+1)
    .then((focusObj)=> {

      self.props._submit_NounsList_new(focusObj.main.nounsListMix);
      self.props._submit_UsersList_new(focusObj.main.usersList);

      self.setState((prevState, props)=>{
        let nextList = prevState.unitsList.concat(focusObj.main.unitsList); //even the unitsList from rea was empty

        return({
          axiosFocus: false,
          focusFetchTurn: prevState.focusFetchTurn+1,
          unitsList: nextList,
          unitsBasic: Object.assign({}, prevState.unitsBasic, focusObj.main.unitsBasic),
          marksBasic: Object.assign({}, prevState.marksBasic, focusObj.main.marksBasic)
        });
      });
    })
    .catch(function (thrown) {
      self.setState({axiosFocus: false});
      if (axios.isCancel(thrown)) {
        cancelErr(thrown);
      } else {
        let message = uncertainErr(thrown);
        if(message) alert(message);
      }
    });

  }


  componentDidUpdate(prevProps, prevState, snapshot){
    if(this.state.mountTodo.length==0){
      //now, after everything was mount, we update the visiting time to the server
      axios_visit_Index(this.axiosSource.token);
      //and for safety, we reset the state to default.
      this.setState({mountTodo: ["lastVisit", "listMain", "listBannerNew", "listBannerSelect"]});
    }
  }

  componentDidMount(){
    const self = this;

    this.setState({axiosFocus: true});

    //get the last visit situation for child component
    //in the future, method to get basic (user)sheet data would join here(use Promise.all())
    axios_visit_GET_last(self.axiosSource.token)
      .then((lastVisitObj)=>{
        self.setState({
          lastVisit: lastVisitObj.main.lastTime
        });
        self._set_mountToDo("lastVisit"); //and splice the label from the todo list
        //because we need to set mountTodo for mount stage, we get data of list now directly without _set_focusList
        return axios_cosmic_IndexList(self.axiosSource.token, this.state.focusFetchTurn);
      })
      .then((focusObj)=> {
        self.props._submit_NounsList_new(focusObj.main.nounsListMix);
        self.props._submit_UsersList_new(focusObj.main.usersList);

        self._set_mountToDo("listMain"); //and splice the label from the todo list

        self.setState((prevState, props)=>{
          let nextList = prevState.unitsList.concat(focusObj.main.unitsList); //even the unitsList from rea was empty

          return({
            //we are not going to change the cycle turn in state, mark current '1'st round status
            axiosFocus: false,
            unitsList: nextList,
            unitsBasic: Object.assign({}, prevState.unitsBasic, focusObj.main.unitsBasic),
            marksBasic: Object.assign({}, prevState.marksBasic, focusObj.main.marksBasic)
          });
        }, ()=>{
          window.addEventListener("scroll", self._check_Position);
        });
      })
      .catch(function (thrown) {
        self.setState({axiosFocus: false});
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
    window.removeEventListener("scroll", this._check_Position);
  }

  _render_IndexNails(){
    const ruleFirstBlock = [1,1,1,3,3,0,2,1,1,1],
          ruleBlock = [1,1,1,[0,2],[2,0],1,1,1];

    let nailsIndex = []; //don't use .map() because we probably need to push twice in one round
    this.state.unitsList.forEach((unitId, index)=>{
      let rulePattern = index< 10? ruleFirstBlock: ruleBlock;
      let remainder = (index< 10)? index % rulePattern.length: (index-10) % rulePattern.length;
      let nailChoice = rulePattern[remainder];
      //and remember handling the switch of side -- like the painting of a long 'tunnel'
      if(typeof nailChoice != "number") nailChoice = !!( Math.floor((index-10)/8) %2) ? nailChoice[0]: nailChoice[1];

      let nail = nailChart(nailChoice, unitId, this);
      nailsIndex.push(nail);
      //diff remainder again for rendering 'separation line'
      let optionalLine = separationLine(remainder, index);
      if(optionalLine) nailsIndex.push(optionalLine);
    })

    return nailsIndex;
  }

  render(){
    return(
      <div>
        <div
          style={this.style.withinCom_MainIndex_scroll_}>
          <div
            className={classnames(styles.boxTop)}>
            <div
              className={classnames(styles.boxTitle)}>
              <MainTitle
                lastVisit={this.state.lastVisit}
                _refer_von_cosmic={this.props._refer_von_cosmic}/>
            </div>
            <div
              className={classnames(styles.boxBanner)}>
              <MainBanner
                {...this.props}
                _set_mountToDo={this._set_mountToDo}
                _refer_von_cosmic={this.props._refer_von_cosmic}/>
            </div>
          </div>
          <div
            ref={this.refScroll}
            className={styles.boxScroll}>
            {this._render_IndexNails()}
            <div
              style={styleMiddle.boxFooterInfo}>
              <span style={Object.assign({}, styleMiddle.spanFooterInfo, styleMiddle.textFooterInfo)}>{"Cornerth."}</span>
              <br></br>
              <br></br>
              <span style={Object.assign({}, styleMiddle.spanFooterInfo, styleMiddle.textFooterInfo)}>{"about"}</span>
              <span style={Object.assign({}, styleMiddle.spanFooterInfo, styleMiddle.textFooterInfo)}>{"．"}</span>
              <span style={Object.assign({}, styleMiddle.spanFooterInfo, styleMiddle.textFooterInfo)}>{"contact"}</span>
              <span style={Object.assign({}, styleMiddle.spanFooterInfo, styleMiddle.textFooterInfo)}>{"．"}</span>
              <span style={Object.assign({}, styleMiddle.spanFooterInfo, styleMiddle.textFooterInfo)}>{"join"}</span>
            </div>
            <div style={this.style.withinCom_MainIndex_scroll_col_footer}></div>
          </div>
        </div>
        <Route
          path={this.props.match.path+"/unit"}
          render={(props)=> <Unit {...props} _construct_UnitInit={this._construct_UnitInit} _refer_von_unit={this.props._refer_von_cosmic}/>}/>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_NounsList_new: (arr) => { dispatch(handleNounsList(arr)); },
    _submit_UsersList_new: (arr) => { dispatch(handleUsersList(arr)); }
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(MainIndex));
