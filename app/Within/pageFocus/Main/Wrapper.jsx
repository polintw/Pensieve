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
import MainTitle from '../MainTitle/MainTitle.jsx';
import MainBanner from '../MainBanner/MainBanner.jsx';

import MainList from './MainList/MainList.jsx';
import Unit from '../../../Unit/Unit/Unit.jsx';
import {
  cancelErr,
  uncertainErr
} from '../../../utils/errHandlers.js';

class Wrapper extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axiosFocus: false,
      lastVisit: false,
      mountTodo: ["lastVisit", "listMain", "listBannerNew", "listBannerSelect", "listRowBroads"]
    };
    this.axiosSource = axios.CancelToken.source();
    this._construct_UnitInit = this._construct_UnitInit.bind(this);
    this._set_mountToDo = this._set_mountToDo.bind(this);
    this.style={
      withinCom_MainIndex_scroll_: {
        width: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box'
      },
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
      prevState.mountTodo.splice(itemIndex, 1);
      return ({
        mountTodo: prevState.mountTodo
      });
    }); //end of 'if'

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
            className={styles.boxScroll}>
            <MainList
              {...this.props}
              _set_mountToDo={this._set_mountToDo}
              _refer_von_cosmic={this.props._refer_von_cosmic}/>
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

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Wrapper));
