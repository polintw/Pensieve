import React from 'react';
import {
  Route,
  Switch,
  Link,
  withRouter,
  Redirect
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import BelongOptions from '../BelongOptions/BelongOptions.jsx';
import {
  cancelErr,
  uncertainErr
} from "../../../utils/errHandlers.js";

const recordLink = (nodeId, self)=>{
  return (
    <Link
      key={"key_Belong_records_"+index}
      to={"/cosmic/nodes/"+nodeId}
      className={'plainLinkButton'}>
      <span>
        {self.props.nounsBasic[nodeId].name}
      </span>
    </Link>
  )
}

class BelongForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      records: false, //would be an array after the axios get the records from db
      viewForm: false //judge whether open the Options or not
    };
    this.axiosSource = axios.CancelToken.source();
    this._render_BelongList = this._render_BelongList.bind(this);
    this._render_actionDescrip = this._render_actionDescrip.bind(this);
    this._axios_GET_belongRecords = this._axios_GET_belongRecords.bind(this);
    this.style={

    }
  }

  _axios_GET_belongRecords(){
    const self = this;
    this.setState({axios: true});

    //GET /router/profile/sheetsNodes, & query?

    axios({
      method: 'get',
      url: '/router/explore/nouns',
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      cancelToken: self.axiosSource.cancelToken
    }).then(function (res) {
      self.setState({axios: false});

      let resObj = JSON.parse(res.data);
      let nounsArr = resObj.main.nounsListUsed,
          callBack = ()=>{
            //for convenience when rendering, limit first block to less than 8
            let [firstEight, afterEight]=[[],[]];
            if(resObj.main.nounsListUsed.length>8) {
              firstEight = resObj.main.nounsListUsed.slice(0, 8);
              afterEight = resObj.main.nounsListUsed.slice(8);
            }else firstEight=resObj.main.nounsListUsed;
            self.setState((prevState, props)=>{
              prevState.listUsed.push(firstEight);
              prevState.listUsed.push(afterEight);
              return {listUsed: prevState.listUsed}
            });
          };

      self.props._submit_NounsList_new(nounsArr, callBack);

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

  }

  componentDidMount() {
    this._axios_GET_belongRecords();
    //would get nodes list, and pass to redux

  }

  componentWillUnmount() {

  }

  _render_actionDescrip(){
    if(this.state.records< 0) return (<p>{this.props.i18nUIString.catalog['guidingNewBelong']}</p>)
    else if(this.state.records< 2) return (<p>{this.props.i18nUIString.catalog['guidingEditBelong']}</p>);
    //there is third kind of situation: "edit"  to just edit current list after all 3 are redorded
  }

  _render_BelongList(){
    let items = this.state.records.map((nodeId, index)=>{
      return recordLink(nodeId, this);
    });

    return items;
  }

  render(){
    return(
      <div
        className={classnames(styles.comBelongForm)}>
        {
          !this.state.viewForm && this.state.records &&
          <div>
            {this._render_BelongList()}
          </div>
        }
        {
          this.state.records &&
          <div>
            {this._render_actionDescrip()}
            {
              this.state.viewForm &&
              <BelongOptions/>
            }
          </div>
        }
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

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(BelongForm));
