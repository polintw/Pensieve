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
import stylesFont from '../stylesFont.module.css';
import {
  axios_visit_GET_last,
  axios_visit_Index
} from './utils.js';
import Chain from './Chain/Chain.jsx';
import BelongsMap from './BelongsMap/BelongsMap.jsx'
import BelongsSet from './BelongsSet/BelongsSet.jsx';
import FeedAssigned from './FeedAssigned/FeedAssigned.jsx';
import NavFeed from "./NavFeed/NavFeed.jsx";
import OnBoard from '../OnBoard/Wrapper.jsx';
import GuideNails from '../OnBoard/GuideNails.jsx';
import UnitScreen from '../../../Unit/UnitScreen/UnitScreen.jsx';
import {
  initAround
} from '../../../redux/states/statesWithin.js';
import {
  setIndexList,
  setWithinFlag
} from "../../../redux/actions/within.js";
import {
  cancelErr,
  uncertainErr
} from '../../../utils/errHandlers.js';

const toDoArr = ["lastVisit", "chainlist"];

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
    this._set_lastVisit = this._set_lastVisit.bind(this);
    this._createdRespond = this._createdRespond.bind(this);
    this._construct_UnitInit = this._construct_UnitInit.bind(this);
    this._render_FooterHint = this._render_FooterHint.bind(this);
    this._render_Newly = this._render_Newly.bind(this);
  }

  _construct_UnitInit(match, location){
    let unitInit= {marksify: false, initMark: "all", layer: 0};
    return unitInit;
  }

  _createdRespond(){
    this.props._set_WithinFlag(true, "chainFetRespond");
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

  _set_lastVisit(visitTime){
    this.setState({ lastVisit: visitTime});
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
    this.props._set_IndexLists(initAround.indexLists);
  }

  render(){
    return(
      <div>
        {
          (this.props.userInfo.accountStatus == "newly") ? //should knew before React mount
          (
            this._render_Newly()
          ):(
            <div
              className={classnames(styles.comAroundWrapper)}>
              <div
                className={classnames(styles.boxRow, styles.boxRowTop)}>
                <Chain
                  {...this.props}
                  lastVisit={this.state.lastVisit}
                  _set_mountToDo={this._set_mountToDo}/>
              </div>
              <div
                className={classnames(styles.boxRow)}>
                <NavFeed {...this.props}/>
                <Switch>
                  <Route path={'/fellows'} render={(props)=> <BelongsMap {...props} /> }/>
                  <Route path={this.props.match.path} render={(props) => <FeedAssigned
                    {...props}
                    lastVisit={this.state.lastVisit}
                    _set_mountToDo={this._set_mountToDo}
                    _refer_von_cosmic={this.props._refer_von_cosmic} />}/>
                </Switch>
              </div>
              <div
                className={classnames(styles.boxRow, styles.boxFooter)}>
                {this._render_FooterHint()}
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

  _render_Newly(){
    return this.props.belongsByType.fetched ? // already recieved the res of belonstype
    (
      ( (!("homeland" in this.props.belongsByType) || (!this.props.belongsByType['homeland'])) && //no set homeland
        (!("residence" in this.props.belongsByType) || (!this.props.belongsByType["residence"])) // no set residence
      ) ? (
        <div
          className={classnames(styles.comAroundWrapper)}>
          <OnBoard/>
          <div
            className={classnames(styles.boxFooter)}
            style={{marginBottom: '6vh'}}></div>
        </div>
      ) : (
        <div
          className={classnames(styles.comAroundWrapper)}>
          <div
            className={classnames(styles.boxRow, styles.boxRowTop)}>
            <GuideNails
              guideChoice={'welcome'}/>
          </div>
          <div
            className={classnames(styles.boxRow)}>
            <GuideNails
              guideChoice={'howShare'}/>
          </div>
          <div
            className={classnames(styles.boxRow)}
            style={{margin: '4px 0 0'}}>
            <BelongsSet/>
          </div>
          <div
            className={classnames(styles.boxFooter)}
            style={{marginBottom: '6vh'}}></div>
        </div>
      )
    ) :
    null;
  }

  _render_FooterHint(){
    // by feed length, we gave users some message about the thing they could do
    let feedConcatList = this.props.indexLists.listBrowsed.concat(this.props.indexLists.listUnread);
    if (!this.props.belongsByType['residence'] && !this.props.belongsByType['homeland']) { //first, if the belong do not be set at all, which means could not share and do fetch any feed
      return (
        <span
          className={classnames(styles.spanFooterHint, stylesFont.fontTitleSmall, stylesFont.colorGrey)}>
          {this.props.i18nUIString.catalog["descript_AroundIndex_footer_BelongHint"]}</span>
      );
    }
    else{
      return (
        <span
          className={classnames(styles.spanFooterHint, stylesFont.fontTitleSmall, stylesFont.colorLightGrey)}>
          {this.props.i18nUIString.catalog['descript_AroundIndex_footer']}</span>
      );
    }
  }
}


const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    belongsByType: state.belongsByType,
    indexLists: state.indexLists,
    chainList: state.chainList,
    sharedsList: state.sharedsList
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _set_IndexLists: (obj) => { dispatch(setIndexList(obj)); },
    _set_WithinFlag: (bool, flag) => {dispatch(setWithinFlag(bool, flag)); }
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Wrapper));
