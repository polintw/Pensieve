import React from 'react';
import {
  Route,
  Redirect,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import Feed from './Feed/Feed.jsx';
import TitleUser from './TitleUser/TitleUser.jsx';
import {
  _axios_get_Basic
} from './axios.js';
import UnitScreen from '../../../Unit/UnitScreen/UnitScreen.jsx';
import UnitUnsign from '../../../Unit/UnitUnsign/UnitUnsign.jsx';
import {
  handleUsersList,
} from "../../../redux/actions/general.js";
import {
  cancelErr,
  uncertainErr
} from '../../../utils/errHandlers.js';

class Wrapper extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      savedPosition: null,
      userBasicInfo: {
        timeCreate: null,
        countShareds: 0,
        inspiredCount: 0,
        inspiredYou: false
      },
    };
    this.axiosSource = axios.CancelToken.source();
    this.wrapperWithinUser = React.createRef();
    this._set_userBasic = this._set_userBasic.bind(this);
    this._construct_UnitInit = this._construct_UnitInit.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    let preUrlParams = new URLSearchParams(prevProps.location.search); //we need value in URL query
    if(this.userId != preUrlParams.get('userId') ){ // that's, if the page was jump to next user
      this._set_userBasic();
    };
    if(
      this.props.location.pathname != prevProps.location.pathname &&
      this.props.location.pathname.includes('/unit')
    ){
      let savedPosition = window.scrollY;
      this.setState((prevState, props)=>{
        return {
          savedPosition: savedPosition
        };
      }, ()=>{
        this.wrapperWithinUser.current.style.display='none';
      });
    }
    else if(
      this.props.location.pathname != prevProps.location.pathname &&
      prevProps.location.pathname.includes('/unit') &&
      !this.props.location.pathname.includes('/unit')
    ){
      this.wrapperWithinUser.current.style={};
      window.scroll(0, prevState.savedPosition);
      this.setState({
        savedPosition: null
      });
    };
  }

  componentDidMount(){
    this._set_userBasic();
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    this.urlParams = new URLSearchParams(this.props.location.search); //we need value in URL query
    this.userId = this.urlParams.get('userId');

    return(
      <div>
        <div
          ref={this.wrapperWithinUser}
          className={classnames(styles.comSeeUser)}>
          <div
            className={classnames(styles.boxRow)}>
            <TitleUser
              userId = {this.userId}
              userBasicInfo={this.state.userBasicInfo}/>
          </div>
          <div>
            <Feed
              {...this.props}
              userId = {this.userId}/>
          </div>
        </div>
        <Route
          path={((this.props.location.pathname =="/") ? '' : this.props.location.pathname.slice(0, -5))+ '/unit' }
          render={(props)=> {
            // PathProject allow no token browse, so we have to use different Unit for both condition
            return (this.props.tokenStatus== 'invalid' || this.props.tokenStatus == 'lack') ? (
              <UnitUnsign
                {...props}
                _refer_von_unit={this.props._refer_to}/>
            ):(
              <UnitScreen
                {...props}
                _createdRespond= {()=>{/* no need to give any flad in AtNode*/ }}
                _construct_UnitInit={this._construct_UnitInit}
                _refer_von_unit={this.props._refer_to}/>
            )
          }
        }/>
      </div>
    )
  }

  _construct_UnitInit(match, location){
    let unitInit= {marksify: false, initMark: "first", layer: 0};
    return unitInit;
  }

  _set_userBasic(){
    const self = this;
    this.setState({axios: true});

    let basicReqObj = { // for now, GET filterStart
      url: '/router/people/basic',
      params: {userId: this.userId}
    };
    // start, first make sure the userrrr basic was on the list
    this.props._submit_UsersList_new([this.userId]);
    // then req basic(filterStart)
    _axios_get_Basic(this.axiosSource.token, basicReqObj)
    .then((resObj)=> {
      self.setState({
        axios: false,
        userBasicInfo: resObj.main.userBasicInfo
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

}


const mapStateToProps = (state)=>{
  return {
    tokenStatus: state.token,
    i18nUIString: state.i18nUIString,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_UsersList_new: (arr) => { dispatch(handleUsersList(arr)); },
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Wrapper));
