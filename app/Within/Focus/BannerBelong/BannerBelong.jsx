import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import {
  cancelErr,
  uncertainErr
} from "../../../utils/errHandlers.js";
import {
  handleNounsList
} from "../../../redux/actions/general.js";

const recordLink = (nodeId, self)=>{
  //still check if the node has data in reducer
  return (
    <div>
      <
      <Link
        key={"key_Belong_records_"+nodeId}
        to={"/cosmic/nodes/"+nodeId}
        nodeid={nodeId}
        className={classnames('plainLinkButton', styles.boxRecord)}
        onMouseEnter={self._handleEnter_Record}
        onMouseLeave={self._handleLeave_Record}>
        <div
          className={classnames(styles.spanRecord)}>
          {
            (self.state.onRecord== nodeId) &&
            <span style={{
                width: '72%', position: 'absolute', bottom: '-11%', left: '5%',
                borderBottom: 'solid 1px #ff7a5f'
              }}/>
            }
            {nodeId in self.props.nounsBasic ? (
              self.props.nounsBasic[nodeId].name) : (
                null
              )}
            </div>
          </Link>
    </div>
  )
}

class BannerBelong extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      onRecord: false,
      nodesChart: {},
      nodesList: []
    };
    this._set_nodesShared = this._set_nodesShared.bind(this);
    this._render_BelongList = this._render_BelongList.bind(this);
    this._axios_GET_sharedCount = this._axios_GET_sharedCount.bind(this);
    this._axios_GET_belongRecords = this._axios_GET_belongRecords.bind(this);
    this._axios_GET_recordeShared = this._axios_GET_recordeShared.bind(this);
    this._handleEnter_Record = this._handleEnter_Record.bind(this);
    this._handleLeave_Record = this._handleLeave_Record.bind(this);
  }

  _handleEnter_Record(e){
    this.setState({
      onRecord: e.currentTarget.getAttribute('nodeid')
    })
  }

  _handleLeave_Record(e){
    this.setState({
      onRecord: false
    })
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

  _set_nodesShared(nodesList){

  }

  componentDidMount() {
    const self = this;
    this.setState({axios: true});

    axios.all([
      this._axios_GET_belongRecords(),
      this._axios_GET_recordeShared()
    ]).then(
      axios.spread((belongRecord, recordShared)=>{
        let belongObj = JSON.parse(belongRecord.data),
            sharedObj = JSON.parse(recordShared.data);
        let sharedList = sharedObj.main.nodesList;
        if(sharedList.length > belongObj.main.nodesList.length){ //long enouogh to delete repeat node by belong
          sharedList = sharedList.filter((nodeId, index)=>{ return belongObj.main.nodesList.indexOf(nodeId)< 0 })
        }
        //then, concat the lists
        const nodesList= belongObj.main.nodesList.concat(sharedList);

        self.props._submit_NounsList_new(nodesList); //GET nodes info by Redux action
        self._set_nodesShared(nodesList); //GET count of each node display

        self.setState((prevState, props)=>{
          return({
            axios: false,
            nodesList: nodesList,
            nodesChart: resObj.main.nodesChart
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
    ["residence", "stay", "hometown", "", "used", "used"]

    let items = this.state.nodesList.map((nodeId, index)=>{

      this.state.nodesChart[nodeId]
      return recordLink(nodeId, this);
    });

    return items;
  }

  render(){
    return(
      <div
        className={classnames(styles.boxList, styles.fontList)}>
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
