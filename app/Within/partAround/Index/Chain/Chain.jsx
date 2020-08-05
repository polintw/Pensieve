import React from 'react';
import {
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import stylesNail from "../../../stylesNail.module.css";
import ChainShared from './ChainShared.jsx';
import ChainMessage from './ChainMessage.jsx';
import {_comp_EmptyBox} from './ChainAdditionBox.jsx';
import IndexShare from '../IndexShare/IndexShare.jsx';
import NailFeed from '../../../../Components/Nails/NailFeed/NailFeed.jsx';
import {
  axios_get_UnitsBasic,
  _axios_GET_andParams
} from '../../../../utils/fetchHandlers.js';
import {
  handleNounsList,
  handleUsersList,
} from "../../../../redux/actions/general.js";
import {
  submitChainList
} from "../../../../redux/actions/within.js";
import {
  cancelErr,
  uncertainErr
} from "../../../../utils/errHandlers.js";

class Chain extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      fetched: false,
      unitsBasic: {},
      marksBasic: {}
    };

    this.axiosSource = axios.CancelToken.source();
    this._set_ChainUnits = this._set_ChainUnits.bind(this);
    this._set_unitBasic = this._set_unitBasic.bind(this);
    this._get_inspiredList = this._get_inspiredList.bind(this);
    this._render_ChainUnits = this._render_ChainUnits.bind(this);
  }

  _get_inspiredList(){
    const self = this;

    return _axios_GET_andParams(this.axiosSource.token, '/router/feed/chainlist', [{ key: 'inspired', value: true }])
    /*
    resObj.main {
      newInspiredList: [],
    }
    */
      .then((resInsObj) => {
        let displayOrder = resInsObj.main.newInspiredList; // must be an array, no matter empty or not
        let newInspiredObj = {displayOrder: displayOrder, displayInfo: {}};
        if (displayOrder.length == 1){ // only 1 new inspired, we going to add detailed info
          let targetUnit = displayOrder[0];
          return _axios_GET_andParams(self.axiosSource.token, '/router/share/' + targetUnit + '/statics/inspired', [
            { key: 'lastUser', value: true }, {key: 'newUsersSum', value: true}
          ])
          .then((resInsDetailObj)=>{
            newInspiredObj.displayInfo["inspiredDetail"] ={
              lastUser: resInsDetailObj.main.lastUser,
              sumNew: resInsDetailObj.main.sumNew
            };

            self.props._submit_UsersList_new([resInsDetailObj.main.lastUser]); // pass the userId to redux.action

            return newInspiredObj;
          })
        }
        else // any else
        return newInspiredObj; // end of 'if()'
      })
      .then((newInspiredObj)=>{
        newInspiredObj.displayOrder.forEach((unitId, index) => {
          newInspiredObj.displayInfo[unitId] = 'newInspired';
        });

        return [newInspiredObj.displayOrder, newInspiredObj.displayInfo];
      })
  }

  _set_ChainUnits(params){
    const self = this;
    this.setState({axios: true});

    _axios_GET_andParams(this.axiosSource.token, '/router/feed/chainlist', params)
    .then((resObj)=>{
      //(we don't update the 'axios' state, because there is another axios here, for units, right after the res)
      /*
      resObj.main: {
              sharedPrimer: false,
              userShared: false,
              resToShared: false,
              resToRespond: false,
              latestShared: false,
              }
      */
      let displayOrder = [], displayInfo={};
      displayOrder.push(resObj.main['sharedPrimer'], resObj.main['userShared'], resObj.main['resToShared'],resObj.main['resToRespond'],resObj.main['latestShared']);
      displayOrder = displayOrder.filter((item, index)=> {return item}); //use the property the item would be 'false' if none
      Object.keys(resObj.main).forEach((key, index) => {
        if( !resObj.main[key]) return; // 'false', go next
        displayInfo[resObj.main[key]] = key;
      });
      return {
        listOrderedChain: displayOrder,
        listInfo: displayInfo
      };
    })
    .then((chainObj)=>{
      // add another possibility not result of 'respond': inspired
      if (chainObj.listOrderedChain.length == 0){ // no respond, not a new Shared, we call the api to ask new 'inspired'
        return self._get_inspiredList()
        .then(([inspiredOrderedList, inspiredListInfo])=>{
          chainObj.listOrderedChain = inspiredOrderedList;
          chainObj.listInfo = inspiredListInfo;

          return chainObj
        })
      }
      else return chainObj; // end of 'if()'
    })
    .then((chainObj)=>{
      self.props._submit_list_Chain(chainObj);
      self.setState({
        fetched: true,
        axios: false
      });
      self.props._set_mountToDo('chainlist'); // and, after we get the list back, inform the parent we are done with the lastVisit time
      //and use the list to get the data of each unit
      // no need to 'return' here, let the f() deal with the error itself
      self._set_unitBasic(chainObj.listOrderedChain);
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

  _set_unitBasic(unitsList){
    const self = this;
    this.setState({axios: true});

    axios_get_UnitsBasic(this.axiosSource.token, unitsList)
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
    //monitor flag for this comp: 1) new shared by user.
    if(this.props.flagChainFetRespond && this.props.flagChainFetRespond != prevProps.flagChainFetRespond) this._set_ChainUnits([{key: 'respond',value:true}]);
  }

  componentDidMount(){
    this._set_ChainUnits();
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  _render_ChainUnits(){
    let nailsDOM = [];
    const props = this.props;

    this.props.chainList.listOrderedChain.forEach((unitId, index) => {
      //render if there are something in the data
      if( !(unitId in this.state.unitsBasic)) return; //skip if the info of the unit not yet fetch
      nailsDOM.push(
        <div
          key={"key_ChainUnits_"+index}
          className={classnames(stylesNail.boxNail)}>
          <NailFeed
            {...this.props}
            unitId={unitId}
            linkPath={this.props.location.pathname + ((this.props.location.pathname == '/') ? 'unit' : '/unit')}
            unitBasic={this.state.unitsBasic[unitId]}
            marksBasic={this.state.marksBasic}/>
        </div>
      );

    });
    if(nailsDOM.length ==1 ){ // any one nail condition should has a 'EmptyBox' to keep in pair
      let DOMEmptyBox = _comp_EmptyBox(this.props, this.state);
      nailsDOM.push(DOMEmptyBox);
    };

    return nailsDOM;
  }

  render(){
    let currentPath = this.props.location.pathname;
    let fellowsify = currentPath.includes('/fellows');

    return (
      <div
        className={classnames(styles.comChain)}>
        <div
          className={classnames(styles.boxFullWide)}
          style={{margin: '4px 0'}}>
          <ChainShared/>
        </div>
        {
          !fellowsify && // not display in path '/fellows'
          <div
            className={classnames(styles.boxIndexShare)}>
            <IndexShare
              {...this.props}/>
          </div>
        }
        {
          (this.props.chainList.listOrderedChain.length > 0 && this.props.chainList.listOrderedChain[0] in this.state.unitsBasic) &&
          <div
            className={classnames(styles.boxChainModule)}>
            <div
              className={classnames(
                styles.boxFullWide, styles.boxSeperate
              )}>
              <ChainMessage
                unitsBasic={this.state.unitsBasic}/>
            </div>
            <div
              className={classnames(
                styles.boxModule,
                styles.boxModuleSmall
              )}>
              {this._render_ChainUnits()}
            </div>
          </div>
        }
      </div>
    )
  }

}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    belongsByType: state.belongsByType,
    chainList: state.chainList,
    indexLists: state.indexLists,
    flagChainFetRespond: state.flagChainFetRespond
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_NounsList_new: (arr) => { dispatch(handleNounsList(arr)); },
    _submit_UsersList_new: (arr) => { dispatch(handleUsersList(arr)); },
    _submit_list_Chain: (obj) => { dispatch(submitChainList(obj)); }
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Chain));
