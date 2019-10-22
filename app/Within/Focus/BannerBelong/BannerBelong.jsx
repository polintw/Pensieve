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
  )
}

class BannerBelong extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      onRecord: false,
    };
    this._render_BelongList = this._render_BelongList.bind(this);
    this._axios_GET_belongRecords = this._axios_GET_belongRecords.bind(this);
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
    const self = this;
    this.setState({axios: true});

    axios({
      method: 'get',
      url: '/router/profile/sheetsNodes?present&random&limit=5',
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      cancelToken: self.axiosSource.cancelToken
    }).then(function (res) {
      let resObj = JSON.parse(res.data);
      self.props._submit_NounsList_new(resObj.main.nodesList);

      self.setState((prevState, props)=>{
        return({
          axios: false,
          records: resObj.main.nodesList.length> 0 ? resObj.main.nodesList : true,
          //check if the nodesList has anything. if not, return true to let the com rendered(default 'false')
          viewForm: resObj.main.nodesList.length> 0 ? false : true
          //if nothing, means need to show the ptions Form, set it to 'true'
        });
        //for now, we didn't update nodes connection to user to anywhere
        //even it was already prepared by res data
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

  componentDidMount() {
    this._axios_GET_belongRecords();
  }

  componentWillUnmount() {
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  _render_BelongList(){
    let items = this.state.records.map((nodeId, index)=>{
      return recordLink(nodeId, this);
    });

    return items;
  }

  render(){
    return(
      <div>
        {
          !this.state.viewForm && this.state.records &&
          <div
            className={classnames(styles.boxList, styles.fontList)}>
            {this._render_BelongList()}
          </div>
        }
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
)(BannerBelong));
