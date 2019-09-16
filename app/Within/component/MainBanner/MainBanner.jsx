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
import {
  axios_Main_Banner,
} from './utils.js';
import CreateShare from '../../../Component/CreateShare.jsx';
import SvgCreate from '../../../Component/Svg/SvgCreate.jsx';
import {
  cancelErr,
  uncertainErr
} from '../../../utils/errHandlers.js';

class MainBanner extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
    };
    this.axiosSource = axios.CancelToken.source();
    this._submit_Share_New = this._submit_Share_New.bind(this);
    this.style={

    }
  }

  _submit_Share_New(dataObj){
    window.location.assign('/user/cognition/actions/shareds/units?theater&unitId='+dataObj.unitId);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {
    const self = this;
    this.setState({axios: true});

    axios_Main_Banner(this.axiosSource.token)
      .then((bannerObj)=>{
        //actually the api now do not return anything,
        //add more complicated check here when we increased more interact
        self.setState({
          axios: false,
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

  componentWillUnmount() {
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    return(
      <div
        className={classnames(styles.comMainBanner)}>
        <div
          className={classnames(styles.boxCreate)}>
          <SvgCreate
            place={false}
            stretch={true}/>
          <CreateShare
            _submit_Share_New={this._submit_Share_New}
            _refer_von_Create={this.props._refer_von_cosmic}/>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    unitCurrent: state.unitCurrent,
    mainTitle: state.mainTitle
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(MainBanner));
