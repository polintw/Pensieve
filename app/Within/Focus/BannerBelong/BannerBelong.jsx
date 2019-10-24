import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import BelongbyType from '../BelongbyType/BelongbyType.jsx';
import {
  cancelErr,
  uncertainErr
} from "../../../utils/errHandlers.js";
import {
  handleNounsList
} from "../../../redux/actions/general.js";

const nodeTypeList = ["residence", "stay", "hometown", "", "used", "used"];

class BannerBelong extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      typeObj: {},
      nodesList: [],
      nodesSharedCount: {}
    };
    this._set_sharedCount = this._set_sharedCount.bind(this);
    this._render_BelongList = this._render_BelongList.bind(this);
    this._axios_GET_sharedCount = this._axios_GET_sharedCount.bind(this);
    this._axios_GET_belongRecords = this._axios_GET_belongRecords.bind(this);
    this._axios_GET_recordeShared = this._axios_GET_recordeShared.bind(this);
  }

  _axios_GET_belongRecords(){
    return axios({
      method: 'get',
      url: '/router/profile/sheetsNodes?present&random&limit=8',
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      cancelToken: this.axiosSource.cancelToken
    })
  }

  _axios_GET_recordeShared(){
    return axios({
      method: 'get',
      url: '/router/records/nodes?type=shared&limit=5', //the limit 5, considering the possibility of 'repeat' to belong list
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      cancelToken: this.axiosSource.cancelToken
    })
  }

  _axios_GET_sharedCount(nodeId){
    return axios({
      method: 'get',
      url: '/router/nouns/'+nodeId+ '/attribution',
      params: {require: 'countShared'},
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      cancelToken: this.axiosSource.cancelToken
    })
  }

  _set_sharedCount(nodesList){
    //make axios req by nodesList
    let promiseArr = nodesList.map((nodeId, index)=>{
      return this._axios_GET_sharedCount(nodeId)
    });
    const self = this;
    this.setState({axios: true});

    axios.all(promiseArr)
      .then(results => { //we don't know how many res from .all(), so use general params
        self.setState({axios: false});

        let nodesSharedCount = {}; //obj prepare for new records, combined with current state later
        //we then loop the results, and by the same order, we pick the nodeId from nodesList by index
        //and remember, the result hasn't parse yet
        results.forEach((res, index)=>{
          let resObj = JSON.parse(res.data);
          nodesSharedCount[nodesList[index]] = resObj.main.count;
        });

        self.setState((prevState, props)=>{
          return {
            nodesSharedCount: {...prevState.nodesSharedCount, ...nodesSharedCount} //combined new records to current state by spread
          }
        });

      ).catch(function (thrown) {
        self.setState({axios: false});
        if (axios.isCancel(thrown)) {
          cancelErr(thrown);
        } else {
          let message = uncertainErr(thrown);
          if(message) alert(message);
        }
      });
  }

  componentDidMount() {
    const self = this;
    this.setState({axios: true});

    axios.all([
      this._axios_GET_belongRecords(),
      this._axios_GET_recordeShared()
    ]).then(
      axios.spread((belongRecord, recordShared)=>{
        self.setState({axios: false}); //set here because we are going to next axios not far away

        let belongObj = JSON.parse(belongRecord.data),
            sharedObj = JSON.parse(recordShared.data);
        let sharedList = sharedObj.main.nodesList;
        if(sharedList.length > belongObj.main.nodesList.length){ //long enouogh to delete repeat node by belong
          sharedList = sharedList.filter((nodeId, index)=>{ return belongObj.main.nodesList.indexOf(nodeId)< 0 })
        }
        //then, concat the lists
        const nodesList= belongObj.main.nodesList.concat(sharedList);
        let typeObj = {used: []};
        nodesList.forEach((nodeId, index)=>{ //and, switch nodesChart to type attribution for rendering convinence
          if(nodeId in resObj.main.nodesChart) typeObj[resObj.main.nodesChart[nodeId]] = nodeId
          else typeObj["used"].push(nodeId); //end of 'if'
        });

        self.props._submit_NounsList_new(nodesList); //GET nodes info by Redux action
        self._set_sharedCount(nodesList); //GET count of each node display

        self.setState((prevState, props)=>{
          return({
            nodesList: nodesList,
            typeObj: typeObj
          });
        });

      })
    ).catch(function (thrown) {
      self.setState({axios: false});
      if (axios.isCancel(thrown)) {
        cancelErr(thrown);
      } else {
        let message = uncertainErr(thrown);
        if(message) alert(message);
      }
    });
  }

  componentWillUnmount() {
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  _render_BelongList(){
    const nodesDOM = nodeTypeList.map((nodeType, index)=>{
      return (
        <div
          className={classnames(styles.boxByType)}>
          <BelongbyType
            key={"key_BelongByType_"+index}
            {...this.state}
            tpye={nodeType}
            listIndex={index}/>
        </div>
      )

      //but return "·" for the site between 'hometown' & 'used'

    });

    return nodesDOM;
  }

  render(){
    return(
      <div
        className={classnames(styles.comBannerBelong)}>
        {this._render_BelongList()}
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
    i18nUIString: state.i18nUIString,
    nounsBasic: state.nounsBasic,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_NounsList_new: (arr) => { dispatch(handleNounsList(arr)); },
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(BannerBelong));
