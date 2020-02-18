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
  axios_visit_GET_last,
  axios_visit_Index
} from './utils.js';
import RowEntry from './RowEntry/RowEntry.jsx';
import BelongsSet from './BelongsSet/BelongsSet.jsx';

import {
  setIndexLists,
} from '../../../redux/actions/around.js';
import {
  initAround
} from '../../../redux/states/statesWithin.js';
import {
  cancelErr,
  uncertainErr
} from '../../../utils/errHandlers.js';

const toDoArr = ["lastVisit"];

class Wrapper extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      lastVisit: false,
      mountTodo: toDoArr
    };
    this.axiosSource = axios.CancelToken.source();
    this._set_mountToDo = this._set_mountToDo.bind(this);
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
    this.setState({axios: true});

    //get the last visit situation for child component
    axios_visit_GET_last(self.axiosSource.token)
    .then(function(lastVisitRes){
      self._set_mountToDo("lastVisit"); //and splice the label from the todo list

      self.setState({
        axios: false,
        lastVisit: lastVisitRes.main.lastTime
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
    //clear & reset to init when Unmount, make sure the list would not render anything when retrun to index
    this.props._submit_IndexLists(initAround.indexLists);
  }

  render(){
    return(
      <div>
        <div
          className={classnames(styles.comAroundWrapper)}>
          <div
            className={classnames(styles.boxRowTop)}>
            <RowEntry
              lastVisit={this.state.lastVisit}/>
          </div>
          <div
            className={classnames(styles.boxRow)}>
            <BelongsSet
              lastVisit={this.state.lastVisit}/>
          </div>

          <div
            className={classnames(styles.boxFooter)}></div>
        </div>

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
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Wrapper));
