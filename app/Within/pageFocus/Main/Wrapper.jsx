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
  axios_feedList_customNew,
  axios_visit_GET_last,
  axios_visit_Index
} from './utils.js';
import DemandTake from './DemandTake/Wrapper.jsx';
import MainTitle from './MainTitle/MainTitle.jsx';
import MainList from './MainList/MainList.jsx';
import MatchSet from './MatchSet/Wrapper.jsx';
import Supply from './Supply/Supply.jsx';
import Broads from './Broads/Broads.jsx';
import NewShared from './NewShared/NewShared.jsx';
import NewSharedCustom from './NewSharedCustom/NewSharedCustom.jsx';
import Unit from '../../../Unit/Unit/Unit.jsx';
import {
  setIndexLists,
  setFlag
} from '../../../redux/actions/cosmic.js';
import {
  initCosmicGeneral
} from '../../../redux/constants/states.js';
import {
  cancelErr,
  uncertainErr
} from '../../../utils/errHandlers.js';

const toDoArr = ["lastVisit", "listMain", "listNewwithCustom", "listRowBroads"];

class Wrapper extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axiosFocus: false,
      lastVisit: false,
      mountTodo: toDoArr
    };
    this.axiosSource = axios.CancelToken.source();
    this._construct_UnitInit = this._construct_UnitInit.bind(this);
    this._set_mountToDo = this._set_mountToDo.bind(this);
    this.style={

    }
  }

  _construct_UnitInit(match, location){
    let unitInit= {marksify: false, initMark: "all", layer: 0};
    return unitInit;
  }

  _set_mountToDo(item){
    let itemIndex = this.state.mountTodo.indexOf(item);
    if(!(itemIndex < 0)) //skip if the item already rm
    this.setState((prevState, props)=>{
      //remove the label of this process from mout todo
      let leftToDo = prevState.mountTodo.slice(); //this is line is crucial,
      //the var 'toDoArr' would be modified if we splice() the prevState.mountTodo directly
      //so we need to make a shallow copy to avoid this problem.
      leftToDo.splice(itemIndex, 1);
      return ({
        mountTodo: leftToDo
      });
    }); //end of 'if'

  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if(this.state.mountTodo.length==0){
      //now, after everything was mount, we update the visiting time to the server
      axios_visit_Index(this.axiosSource.token);
      //and for safety, we reset the state to default.
      this.setState((prevState, props)=>{
        return {mountTodo: toDoArr};
      });
    }
  }

  componentDidMount(){
    const self = this;
    this.setState({axiosFocus: true});

    //get the last visit situation for child component
    //in the future, method to get basic (user)sheet data would join here
    axios.all([
      axios_visit_GET_last(self.axiosSource.token),
      axios_feedList_customNew(self.axiosSource.token)
    ])
      .then(
        axios.spread(function(lastVisitRes, customNewRes){
          self._set_mountToDo("listNewwithCustom"); //splice the label from the todo list
          self._set_mountToDo("lastVisit"); //and splice the label from the todo list
          let submitObj = {};

          submitObj['listCustomNew'] = customNewRes.main.listCustomNew;
          submitObj['listNew'] = customNewRes.main.listNew;
          //update the list to Redux reducer,
          self.props._submit_IndexLists(submitObj);
          //set the flag to reduucer to inform NewShare or NewSharedCustom refresh
          self.props._submit_FlagSwitch(['flagNewSharedDataFetch', 'flagNewCustomDataFetch']);

          self.setState({
            axiosFocus: false,
            lastVisit: lastVisitRes.main.lastTime
          });
        })
      )
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
    //clear & reset to init when Unmount, make sure the list would not render anything when retrun to index
    this.props._submit_IndexLists(initCosmicGeneral.indexLists);
  }

  render(){
    return(
      <div>
        <div
          className={classnames(styles.comMainWrapper)}>
          <div
            className={classnames(styles.boxRowTop)}>
            <MainTitle
              lastVisit={this.state.lastVisit}
              _refer_von_cosmic={this.props._refer_von_cosmic}/>
          </div>
          <div
            className={classnames(styles.boxRow)}>
            <DemandTake
              _refer_von_cosmic={this.props._refer_von_cosmic}/>
          </div>
          <div
            className={classnames(styles.boxRow)}>
            <div
              className={classnames(styles.boxMatchSet)}>
              <MatchSet
                _refer_von_cosmic={this.props._refer_von_cosmic}/>
            </div>
            <div
              className={classnames(styles.boxBeneathMatchSet)}>
              <Supply/>
            </div>
            <div
              className={classnames(styles.decoSeparationStroke, styles.boxCenterStrokeRow)}></div>
          </div>
          {
            (this.props.indexLists.listCustomNew.length> 0) &&
            <div
              className={classnames(styles.boxRow)}>
              <NewSharedCustom
                {...this.props}/>
            </div>
          }
          {
            (this.props.indexLists.listNew.length> 0) &&
            <div
              className={classnames(styles.boxRow)}>
              <NewShared
                {...this.props}/>
            </div>
          }
          <div
            className={classnames(styles.boxRow)}>
            <Broads
              {...this.props}
              _set_mountToDo={this._set_mountToDo}/>
          </div>
          <div
            className={styles.boxList}>
            <MainList
              {...this.props}
              _set_mountToDo={this._set_mountToDo}/>
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
    userInfo: state.userInfo,
    indexLists: state.indexLists
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_IndexLists: (listsObj) => { dispatch(setIndexLists(listsObj)); },
    _submit_FlagSwitch: (target) => { dispatch(setFlag(target)); },
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Wrapper));
