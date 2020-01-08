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
} from '../utils.js';
import ServiceLinks from '../../../../Component/ServiceLinks.jsx';
import {
  handleNounsList,
  handleUsersList,
} from "../../../../redux/actions/general.js";
import {
  handFocusListNew
} from "../../../../redux/actions/cosmic.js";
import {
  cancelErr,
  uncertainErr
} from '../../../../utils/errHandlers.js';

const styleMiddle = {
  boxFooterInfo: {
    alignSelf: 'flex-end',
    margin: '4.2rem 0 1.6rem',
    padding: '2rem 1.2rem 0',
    color: '#ababab'
  },
  spanFooterInfo: {
    display: 'inline-block',
    boxSizing: 'border-box',
    marginRight: '0.42rem'
  },
  textFooterInfo: {
    fontSize: '1.21rem',
    letterSpacing: '0.1rem',
  }
}

class MainList extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      focusFetchTurn: 1,
      unitsBasic: {},
      marksBasic: {},
    };
    this.refScroll = React.createRef();
    this.axiosSource = axios.CancelToken.source();
    this._render_IndexNails = this._render_IndexNails.bind(this);
    this._check_Position = this._check_Position.bind(this);
    this._set_focusList = this._set_focusList.bind(this);
    this.style={
      withinCom_MainIndex_scroll_col_footer: {
        display: 'inline-block',
        width: '100%',
        height: '33vh',
        position: 'relative',
        boxSizing: 'border-box'
      },
    }
  }

  _check_Position(){
    let boxScrollBottom = this.refScroll.current.getBoundingClientRect().bottom, //bottom related top of viewport of box Scroll
        windowHeightInner = window.innerHeight; //height of viewport
    //now, the bottom would change base on scroll, and calculate from the top of viewport
    //we set the threshould of fetch to the 3 times of height of viewport.
    //But! we only fetch if we are 'not' fetching--- check the axios status.
    if(!this.state.axios && boxScrollBottom < (3*windowHeightInner) && boxScrollBottom > windowHeightInner){
      //base on the concept that bottom of boxScroll should always lower than top of viewport,
      //and do not need to fetch if you have see the 'real' bottom.
      this._set_focusList();
    }
  }

  _set_focusList(){
    const self = this;
    this.setState({axios: true});

    axios_cosmic_IndexList(self.axiosSource.token, this.state.focusFetchTurn+1)
    .then((focusObj)=> {
      self.props._submit_NounsList_new(focusObj.main.nounsListMix);
      self.props._submit_UsersList_new(focusObj.main.usersList);
      self.props._submit_FocusList_new(focusObj.main.unitsList); //even the unitsList from rea was empty

      self.setState((prevState, props)=>{
        return({
          axios: false,
          focusFetchTurn: prevState.focusFetchTurn+1,
          unitsBasic: Object.assign({}, prevState.unitsBasic, focusObj.main.unitsBasic),
          marksBasic: Object.assign({}, prevState.marksBasic, focusObj.main.marksBasic)
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


  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){
    const self = this;

    this.setState({axios: true});

    axios_cosmic_IndexList(self.axiosSource.token, this.state.focusFetchTurn)
      .then((focusObj)=> {
        self.props._submit_NounsList_new(focusObj.main.nounsListMix);
        self.props._submit_UsersList_new(focusObj.main.usersList);
        self.props._submit_FocusList_new(focusObj.main.unitsList); //even the unitsList from rea was empty
        self.props._set_mountToDo("listMain"); //and splice the label from the todo list


        self.setState((prevState, props)=>{
          return({
            //we are not going to change the cycle turn in state, mark current '1'st round status
            axios: false,
            unitsBasic: Object.assign({}, prevState.unitsBasic, focusObj.main.unitsBasic),
            marksBasic: Object.assign({}, prevState.marksBasic, focusObj.main.marksBasic)
          });
        }, ()=>{
          window.addEventListener("scroll", self._check_Position);
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

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
    window.removeEventListener("scroll", this._check_Position);
  }

  _render_IndexNails(){
    const ruleFirstBlock = [2,2,2,3,3,0,2,2,2,2],
          ruleBlock = [2,2,2,[0,2],[2,0],2,2,2];

    let nailsIndex = []; //don't use .map() because we probably need to push twice in one round
    this.props.indexLists.listFocus.forEach((unitId, index)=>{
      let rulePattern = index< 10? ruleFirstBlock: ruleBlock;
      let remainder = (index< 10)? index % rulePattern.length: (index-10) % rulePattern.length;
      let nailChoice = rulePattern[remainder];
      //and remember handling the switch of side -- like the painting of a long 'tunnel'
      if(typeof nailChoice != "number") nailChoice = !!( Math.floor((index-10)/8) %2) ? nailChoice[0]: nailChoice[1];
      //then important question: do we have the data of this Unit ? if not, we skip to next one
      if(unitId in this.state.unitsBasic) {
        let nail = nailChart(nailChoice, unitId, this);
        nailsIndex.push(nail);
        //diff remainder again for rendering 'separation line'
        let optionalLine = separationLine(remainder, index);
        if(optionalLine) nailsIndex.push(optionalLine);
      }

    })

    return nailsIndex;
  }

  render(){
    return(
      <div
        className={styles.comMainList}
        ref={this.refScroll}>
        {this._render_IndexNails()}
        <div
          style={styleMiddle.boxFooterInfo}>
          <span style={Object.assign({}, styleMiddle.spanFooterInfo, styleMiddle.textFooterInfo)}>{"Cornerth."}</span>
          <br></br>
          <br></br>
          <ServiceLinks/>
        </div>
        <div style={this.style.withinCom_MainIndex_scroll_col_footer}></div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    indexLists: state.indexLists
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_NounsList_new: (arr) => { dispatch(handleNounsList(arr)); },
    _submit_UsersList_new: (arr) => { dispatch(handleUsersList(arr)); },
    _submit_FocusList_new: (arr) => { dispatch(handFocusListNew(arr)); }
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(MainList));
