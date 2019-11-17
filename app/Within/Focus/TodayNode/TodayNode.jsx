import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import {
  nailChart,
} from '../Main/utils.js';
import {
  setIndexLists
} from '../../../redux/actions/cosmic.js';
import {
  handleNounsList,
  handleUsersList,
  updateNodesBasic
} from "../../../redux/actions/general.js";
import {
  cancelErr,
  uncertainErr
} from '../../../utils/errHandlers.js';

class TodayNode extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      nodeId: null,
      unitsBasic: {},
      marksBasic: {},
      wikiParagraph: []
    };
    this.axiosSource = axios.CancelToken.source();
    this._render_nails = this._render_nails.bind(this);
    this._axios_GET_Units = this._axios_GET_Units.bind(this);
    this._axios_GET_NodeWiki = this._axios_GET_NodeWiki.bind(this);
    this._axios_GET_todayNode = this._axios_GET_todayNode.bind(this);
    this.style={

    }
  }

  _axios_GET_Units(){
    //GET units list of this node,
    //and submit the list to the props.indexLists.
    //GET data for nails after the list return
  }

  _axios_GET_NodeWiki(){
    const self = this;
    this.setState({axios: true});
    let baseURL = "https://en.wikipedia.org/w/api.php?origin=*&format=json&action=query&prop=extracts&exintro&redirects=1&titles=Stack%20Overflow&utf8"

    axios({
      //IMPORTANT! we need to claim a clear req method by config because,
      //we req to a differ domain, a cross-site situation.
      //the axios would use method 'options' when facing absolute url if we didn't claim clear,
      //but the browser would block this method to a cross-site req.
      method:'get',
      url: baseURL,
      cancelToken: this.axiosSource.token
    }).then(function (res) {
console.log(res)

    }).catch(function (thrown) {
      self.setState({axios: false});
      if (axios.isCancel(thrown)) {
        cancelErr(thrown);
      } else {
        let message = uncertainErr(thrown);
        if(message) alert(message);
      }
    });

  }

  _axios_GET_todayNode(){
    const self = this;
    this.setState({axios: true});

    axios.get('/router/feed/custom/todayNode', {
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      cancelToken: this.axiosSource.token
    }).then(function (res) {
      let resObj = JSON.parse(res.data);

      self.props._submit_NodesBasic(resObj.main.nounsBasic);

      self.setState((prevState, props)=>{
        return ({
          axios: false,
          nodeId: resObj.main.nodesList[0]
        });
        //the TodayNode component would update after this step
        //then we fetch the data & info of this new node in 'componentDidUpdate'
      });
    }).catch(function (thrown) {
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
    if(prevState.nodeId != this.state.nodeId){
      this._axios_GET_NodeWiki();
      this._axios_GET_Units();
    }
  }

  componentDidMount() {
    this._axios_GET_todayNode();
  }

  componentWillUnmount() {
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  _render_nails(){
    //our list was saved to reducer after fetch
    let unitsList = this.props.indexLists['todayNode'],
        unitsDOM = [];

    if(unitsList.length > 0 ){ // check necessity first, skip if no item.
      //we render only two, but the backend may pass more than 2, so don't forget setting the limit
      for(let i =0 ; i< 2 && i< unitsList.length; i++){ //and don't forget the length limit to prevent error cause by unwanted cycle
        let unitId = unitsList[i];
        //then important question: do we have the data of this Unit ? if not, we skip to next one
        if(unitId in this.state.unitsBasic) {
          //the nailChart was co use with other component in Main,

          let nail = nailChart(choice, unitId, this);
          unitsDOM.push(nail);
        }
      }
    }

    return unitsDOM;
  }

  render(){
    return(
      <div
        className={classnames(styles.comTodayNode)}>
        <div>
          {"title"}
          {"'corner'"}
        </div>
        <div>{this._render_nails()}</div>
        <div>
          {this.state.wikiParagraph}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    nounsBasic: state.nounsBasic,
    indexLists: state.indexLists
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_IndexLists: (listsObj) => { dispatch(setIndexLists(listsObj)); },
    _submit_NounsList_new: (arr) => { dispatch(handleNounsList(arr)); },
    _submit_UsersList_new: (arr) => { dispatch(handleUsersList(arr)); },
    _submit_NodesBasic: (obj) => { dispatch(updateNodesBasic(obj)); }
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(TodayNode));
