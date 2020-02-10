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
import RowEntry from './RowEntry/RowEntry.jsx';
import NewSharedCustom from './NewSharedCustom/NewSharedCustom.jsx';
import SelfShared from './SelfShared/SelfShared.jsx';
import CustomSelected from './CustomSelected/CustomSelected.jsx';
import Belongs from './Belongs/Belongs.jsx';
import CornersRecom from './CornersRecom/CornersRecom.jsx';
import CreateShare from '../../../Component/CreateShare.jsx';
import SvgCreate from '../../../Component/Svg/SvgCreate.jsx';
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

const toDoArr = ["lastVisit", "listNewwithCustom"];

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
    this._submit_Share_New = this._submit_Share_New.bind(this);
    this._handleMouseOn_Create = ()=> this.setState((prevState,props)=>{return {onCreate: prevState.onCreate?false:true}});
    this.style={

    }
  }

  _construct_UnitInit(match, location){
    let unitInit= {marksify: false, initMark: "all", layer: 0};
    return unitInit;
  }

  _submit_Share_New(dataObj){
    window.location.assign('/user/cognition/actions/shareds/unit?theater&unitId='+dataObj.unitId);
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
          className={classnames(styles.comAroundWrapper)}>
          <div
            className={classnames(styles.boxRowTop)}>
            <RowEntry
              lastVisit={this.state.lastVisit}
              _refer_von_cosmic={this.props._refer_von_cosmic}/>
          </div>
          <div
            className={classnames(styles.boxRow)}>
            <div
              className={classnames(styles.boxBelong)}>
              <Belongs
                _refer_von_cosmic={this.props._refer_von_cosmic}/>
            </div>
            <div
              className={classnames(styles.boxCreate)}
              onMouseEnter={this._handleMouseOn_Create}
              onMouseLeave={this._handleMouseOn_Create}>
              <SvgCreate
                black={this.state.onCreate}
                place={false}
                stretch={true}/>
              <CreateShare
                _submit_Share_New={this._submit_Share_New}
                _refer_von_Create={this.props._refer_von_cosmic}/>
            </div>
          </div>
          <div
            className={classnames(styles.boxRow)}>
            <SelfShared/>
          </div>
          {
            <div
              className={classnames(styles.boxRow)}>
              (this.props.indexLists.listCustomNew.length> 0) ? (
                <NewSharedCustom
                  {...this.props}/>
              ):(
                <CustomSelected
                  {...this.props}/>
              )
              <div
                className={classnames(styles.decoSeparationLine, styles.boxUnderLine)}></div>
            </div>
          }
          <div
            className={classnames(styles.boxRow)}>
            <CornersRecom
              _refer_von_cosmic={this.props._refer_von_cosmic}/>
          </div>
          <div
            className={classnames(styles.boxFooter)}></div>
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
