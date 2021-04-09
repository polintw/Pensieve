import React from 'react';
import {
  Link,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import classnames from 'classnames';
import styles from "./styles.module.css";
import ModalBox from '../../../../Components/ModalBox.jsx';
import ModalBackground from '../../../../Components/ModalBackground.jsx';
import SvgArrowStick from '../../../../Components/Svg/SvgArrowStick.jsx';
import {
  _axios_get_signedList,
  _axios_get_userUnitSign
} from './axios.js';
import {
  cancelErr,
  uncertainErr
} from '../../../../utils/errHandlers.js';
import {
  outside
} from '../../../../../config/services.js'

class ModalList extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      signed: false,
      signedBtnMessage: null,
      signedUsers: []
    };
    this.axiosSource = axios.CancelToken.source();
    this._render_signedUsers = this._render_signedUsers.bind(this);
    this._set_signedList = this._set_signedList.bind(this);
    this._handleRes_fbLoginRes = this._handleRes_fbLoginRes.bind(this);
    this._handleClick_modalClose = this._handleClick_modalClose.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){
    this._set_signedList();
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  _render_signedUsers(){
    let usersDOM = this.state.signedUsers.map((userObj, index)=>{
      return (
        <div>
          <div>
            <img src={userObj.profilePicUrl}/>
          </div>
          <div>
            <span>
              {userObj.name}
            </span>
          </div>
        </div>
      )
    });

    return usersDOM;
  }

  render(){
    return(
      <ModalBox containerId="unitFrame">
        <ModalBackground
          onClose={()=>{this.props._set_modalListSwitch(false);}}
          style={{
            position: "fixed",
            backgroundColor: 'rgba(51, 51, 51, 0.85)' }}>
          <div>
            <div>
              <div
                onClick={(e)=>{e.stopPropagation();e.preventDefault();this.props._set_modalListSwitch(false);}}>
                <SvgArrowStick />
              </div>
              <div>
                {"Mark your name if you've visited the scene!"}
              </div>
              <div>
                <span>
                  {"Mark your name by "}
                </span>
                <div>
                  <div>
                    <FacebookLogin
                      appId={outside.facebookAppId}
                      autoLoad={false}
                      fields="name,email,picture"
                      callback={this._handleRes_fbLoginRes} />
                  </div>
                </div>
              </div>
              <div>
                {this._render_signedUsers()}
              </div>
            </div>
          </div>
        </ModalBackground>
      </ModalBox>
    )
  }

  _handleRes_fbLoginRes(response){
    const self = this;
    this.setState({axios: true});

    _axios_get_userUnitSign(this.axiosSource.token, {
      fbId: response.userId,
      userIdIdentity: "facebook",
      unitId: this.props.unitCurrent.unitId,
      pathProjectName: this.props.unitEntity.pathSubCate.currentPathProject,
      subCateId: this.props.unitEntity.pathSubCate.currentSubCateId
    })
    .then((resObj)=>{
      if(resObj.main.signed){
        self.setState((prevState, props)=>{
          return {
            axios: false,
            signed: true,
            signedBtnMessage: "You've already signed."
          };
        });
      }
      else return _axios_post_userUnitSign(this.axiosSource.token, {
        fbId: response.userId,
        fbName: response.name,
        fbEmail: response.email,
        fbProfilePicUrl: response.picture.data.url,
        userIdIdentity: "facebook",
        unitId: this.props.unitCurrent.unitId,
        pathProjectName: this.props.unitEntity.pathSubCate.currentPathProject,
        subCateId: this.props.unitEntity.pathSubCate.currentSubCateId
      })
      .then((resObj)=>{
        self.setState((prevState, props)=>{
          return {
            axios: false,
            signed: true,
            signedBtnMessage: "You are on the list"
          };
        });
        this._set_signedList();
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

  _set_signedList(){
    const self = this;
    this.setState({axios: true});

    _axios_get_signedList(this.axiosSource.token, {
      unitId: this.props.unitCurrent.unitId,
      // only PathProject has subCate now, so keep these params simple, but ready for future scale
      subCateId: this.props.unitEntity.pathSubCate.currentSubCateId,
      subCateParent: 'pathProject',
      pathProjectName: this.props.unitEntity.pathSubCate.currentPathProject,
    })
    .then((resObj)=>{
      self.setState((prevState, props)=>{
        return {
          axios: false,
          signedUsers: resObj.main.signUsersArr
        };
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
    unitCurrent: state.unitCurrent,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalList));
