import React from 'react';
import {
  Route,
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import {
  axios_get_taking_list,
  axios_delete_matchSetting
} from '../../utilsMatchNodes.js';
import {
  handleNounsList
} from "../../../../../redux/actions/general.js";
import {
  setFlag,
  setIndexLists,
  setAxiosMatchTaking
} from "../../../../../redux/actions/cosmic.js";
import {
  cancelErr,
  uncertainErr
} from '../../../../../utils/errHandlers.js';

class Taking extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      demandCount: null
    };
    this.axiosSource = axios.CancelToken.source();
    this._fetch_List = this._fetch_List.bind(this);
    this._submit_giveup = this._submit_giveup.bind(this);
    this._render_matchTaking = this._render_matchTaking.bind(this);
    this._handleClick_taken_giveUp = this._handleClick_taken_giveUp.bind(this);
    this.style={

    }
  }

  _handleClick_taken_giveUp(event){
    event.preventDefault();
    event.stopPropagation();

    if(this.props.axiosMatchTaking) return; //for this component, allow only one process at a period

    // boolean message to confirm, which in top component, recieving obj as custom setting
    // and use _submit_giveup as positive action

  }

  _submit_giveup(nodeId){
    const self = this;
    this.setState({axios: true});
    this.props._set_axios_MatchTaking(true); //set axiosMatchTaking as well

    axios_delete_matchSetting(this.axiosSource.token, 'taking', {'takingList': this.props.indexLists.demandTake})
    .then((resObj)=>{
      self.props._set_axios_MatchTaking(false); //set axiosMatchTaking back
      //if succeed, just refresh the list locally
      self._fetch_List();
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

  _fetch_List(){
    const self = this;
    this.setState({axios: true});

    axios_get_taking_list(this.axiosSource.token)
    .then((resObj)=>{
      //no matter empty or not, update the list of state by the list of res
      self.props._submit_NounsList_new(resObj.main.nodesList); //GET nodes info by Redux action
      self.props._submit_IndexLists({demandTake: resObj.main.nodesList}); //submit the list to the props.indexLists.

      self.setState({
        axios: false,
        demandCount: resObj.main.demandCount
      })
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
    if(this.props.flagTakingRefresh && this.props.flagTakingRefresh != prevProps.flagTakingRefresh){
      this._fetch_List();
      this.props._submit_FlagSwitch(['flagTakingRefresh']); //set flag back to dafault
    }

  }

  componentDidMount() {
    this._fetch_List();
  }

  componentWillUnmount() {

  }

  _render_matchTaking(){
    let displaying = !this.props.axiosMatchTaking ? (this.props.indexLists.demandTake.length > 0) ? "taking": "empty": "axios";

    switch (displaying) {
      case "taking":
        let nodeId = this.props.indexLists.demandTake[0];
        return (
          <div>
            <div>
              <span>{this.props.i18nUIString.catalog["title_Main_matchTaking"][0]}</span>
              <span>
                {nodeId in this.props.nounsBasic ? (
                  this.props.nounsBasic[nodeId].name) : (null)}
              </span>
            </div>
            <div>
              <span>
                {this.props.i18nUIString.catalog["title_Main_matchTaking"][1]}</span>
              <span>
                {this.state.demandCount}
              </span>
              <div
                onClick={this._handleClick_taken_giveUp}>
                {this.props.i18nUIString.catalog["title_Main_matchTaking"][2]}
              </div>
            </div>
          </div>
        );
        break;
      case "axios":
        return (
          <div>
            {this.props.i18nUIString.catalog["hint_Process_MatchTaking"]}
          </div>
        )
        break;
      default:
        return null //like the 'empty list' situation
    }
  }

  render(){
    return(
      <div
        className={classnames()}>
        {this._render_matchTaking()}
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    nounsBasic: state.nounsBasic,
    i18nUIString: state.i18nUIString,
    flagTakingRefresh: state.flagTakingRefresh,
    axiosMatchTaking: state.axiosMatchTaking,
    indexLists: state.indexLists,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_NounsList_new: (arr) => { dispatch(handleNounsList(arr)); },
    _submit_IndexLists: (listsObj) => { dispatch(setIndexLists(listsObj)); },
    _submit_FlagSwitch: (target) => { dispatch(setFlag(target)); },
    _set_axios_MatchTaking: () => { dispatch(setAxiosMatchTaking()); },
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Taking));
