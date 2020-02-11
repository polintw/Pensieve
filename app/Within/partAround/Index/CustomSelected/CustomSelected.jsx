import React from 'react';
import {
  Route,
  Link,
  withRouter,
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import stylesMain from "../styles.module.css"; //Notice, we use shared css file here for easier control
import {
  axios_GET_selectedList,
  axios_Units,
  nailChart,
} from '../utils.js';
import {
  handleNounsList,
  handleUsersList
} from "../../../../redux/actions/general.js";
import {
  setIndexLists
} from '../../../../redux/actions/cosmic.js';
import {
  cancelErr,
  uncertainErr
} from '../../../../utils/errHandlers.js';

class CustomSelected extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      unitsBasic: {},
      marksBasic: {}
    };
    this.axiosSource = axios.CancelToken.source();
    this._fetch_Units = this._fetch_Units.bind(this);
    this._set_SelectedList = this._set_SelectedList.bind(this);
    this._render_unitsList = this._render_unitsList.bind(this);
    this.style={

    }
  }

  _fetch_Units(unitsList){
    const self = this;
    this.setState({axios: true});

    axios_Units(this.axiosSource.token, unitsList)
    .then((resObj)=>{
      //after res of axios_Units: call get nouns & users
      self.props._submit_NounsList_new(resObj.main.nounsListMix);
      self.props._submit_UsersList_new(resObj.main.usersList);
      //and update the data of units to state
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

  _set_SelectedList(){
    const self = this;
/*    this.setState({axios: true});

    axios_GET_selectedList(this.axiosSource.token)
    */
    let ptemp_ListSelecton = new Promise((resolve, reject)=>{
      let resObj = {
        main: {
          listCustomSelected: ["20", "27", "19"]
        }
      };

      resolve(resObj);
    });
    //Above, is the static data deisgned for prototype
    ptemp_ListSelecton
    .then((resObj)=>{
      //we now has the list of selected items,
      //call the unit fetch here, and no need to reset axios state.
      self._fetch_Units(resObj.main.listCustomSelected);
      //update the list to the reducer as well.
      let submitObj = {};
      submitObj['listCustomSelected'] = resObj.main.listCustomSelected;
      //update the list to Redux reducer,
      self.props._submit_IndexLists(submitObj);
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

  componentDidMount() {
    this._set_SelectedList();
  }

  componentWillUnmount() {
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  _render_unitsList(){
    //our list was saved to reducer after fetch
    let unitsList = this.props.indexLists['listCustomSelected'],
        unitsDOM = [];
    if(unitsList.length > 0 ){ // check necessity first, skip if no item.
      //we render no more than 6, but the backend may pass more than 6, so don't forget setting the limit
      for(let i =0 ; i< 6 && i< unitsList.length; i++){ //again, don't forget the length limit to prevent error cause by unwanted cycle
        let unitId = unitsList[i];
        //then important question: do we have the data of this Unit ? if not, we skip to next one
        if(unitId in this.state.unitsBasic) {
          let remainder = i % 2; // i start from 0, so it would be either 1 or 0, just like 'true or false'
          let nail = (!remainder && (i+1) == unitsList.length) ? nailChart(0, unitId, this): nailChart(2, unitId, this);
          unitsDOM.push(nail);
          //insert separation if needed
          if(remainder && (i+1)< unitsList.length) unitsDOM.push(
            <div
              key={'key_index_CustomSelected_filling_'+i}
              className={classnames(stylesMain.boxFillHorizClose)}/>
          ); //end of if()
        }
      }
    }

    return unitsDOM;
  }

  render(){
    return(
      <div
        className={classnames(styles.comCusSelected)}>
        {
          (this.props.indexLists['listCustomSelected'].length > 0) &&
          <div
            className={classnames(styles.boxTitleRow)}>
            <div
              className={classnames(styles.boxTitleWrap)}>
              <span
                className={classnames(styles.spanTitle, stylesMain.fontTitle)}>
                {this.props.i18nUIString.catalog["title_index_CusSelected"]}</span>
            </div>
          </div>
        }
        <div
          className={classnames(styles.boxUnits)}>
          {this._render_unitsList()}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    indexLists: state.indexLists,
    unitCurrent: state.unitCurrent,
    i18nUIString: state.i18nUIString,
    nounsBasic: state.nounsBasic,
    usersBasic: state.usersBasic,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_NounsList_new: (arr) => { dispatch(handleNounsList(arr)); },
    _submit_UsersList_new: (arr) => { dispatch(handleUsersList(arr)); },
    _submit_IndexLists: (listsObj) => { dispatch(setIndexLists(listsObj)); },
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomSelected));
