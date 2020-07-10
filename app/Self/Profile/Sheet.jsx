import React from 'react';
import {
  withRouter,
  Link
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import {
  SheetAccount,
  SheetBasic
} from './SheetCom.jsx';
import BelongsSet from './BelongsSet/BelongsSet.jsx';
import PasswordForm from '../../Components/PasswordForm/PasswordForm.jsx';
import {mountUserSheet} from "../../redux/actions/front.js";
import {
  cancelErr,
  uncertainErr
} from "../../utils/errHandlers.js";

  class Sheet extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      onEnterBackPwd: false
    };
    this.axiosSource = axios.CancelToken.source();
    this._render_SheetView = this._render_SheetView.bind(this);
    this._submit_password_success = this._submit_password_success.bind(this);
    this._handleEnter_PassBack = this._handleEnter_PassBack.bind(this);
    this._handleLeave_PassBack = this._handleLeave_PassBack.bind(this);
  }

  _submit_password_success(){
    window.location.assign('/self/profile/sheet');
  }

  componentDidMount(){
    //save in the reducer, so check if there are data: this.props.userSheet: ify?
    if(!this.props.userSheet.ify){
      //we combine 2 page to one at this moment, reflect the "lite version"
      //_set_store_userSheetMount(obj)；the action for accountSet has not yet builded
      const self = this;
      let _axios_getUserSheet = ()=>{
        return axios.get('/router/profile/sheet', {
          headers: {
            'charset': 'utf-8',
            'token': window.localStorage['token']
          },
          cancelToken: this.axiosSource.token
        });
      }, _axios_getAccountSet = ()=>{
        return axios.get('/router/account/setting', {
          headers: {
            'charset': 'utf-8',
            'token': window.localStorage['token']
          },
          cancelToken: this.axiosSource.token
        });
      };
      let axiosArr = [_axios_getUserSheet(),_axios_getAccountSet()];
      axios.all(axiosArr).then(
        axios.spread(function(sheetRes, accountRes){
          let sheetResObj = JSON.parse(sheetRes.data),
              accountResObj = JSON.parse(accountRes.data);
          sheetResObj['ify'] = true;
          self.setState({
            axios: false
          });
          self.props._set_store_userSheetMount(sheetResObj.main.sheetSet, accountResObj.main.accountSet);
        })
      ).catch(function (thrown) {
        self.setState({ axios: false });
        if (axios.isCancel(thrown)) {
          cancelErr(thrown);
        } else {
          let message = uncertainErr(thrown);
          if (message) alert(message);
        }
      });
    }
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  _render_SheetView(paramsStatus){
    switch (paramsStatus) {
      case 'password':
        return (
          <div
            className={classnames(styles.boxReset)}>
            <div
              className={classnames(styles.boxResetForm)}>
              <PasswordForm
                {...this.props}
                _submit_success={this._submit_password_success}/>
              <Link
                to={{
                  pathname: this.props.match.url ,
                  search: '',
                }}
                className={classnames(
                  styles.linkPassBack,
                  {[styles.linkPassBackMouse]: this.state.onEnterBackPwd}
                )}
                onMouseEnter={this._handleEnter_PassBack}
                onMouseLeave={this._handleLeave_PassBack}>
                <span
                  className={classnames(
                    'centerAlignChild',
                    "fontSubtitle_h5",
                    {
                      ['colorEditBlack']: !this.state.onEnterBackPwd,
                      ["colorWhite"]: this.state.onEnterBackPwd
                    }
                  )}>
                  {this.props.i18nUIString.catalog["submit_cancel"]}
                </span>
              </Link>
            </div>

          </div>
        )
        break;
      default:
        return (
          <div
            className={classnames(styles.boxRows)}>
            <div>
              <SheetAccount {...this.props}/>
            </div>
            <div>
              <SheetBasic {...this.props}/>
            </div>
            <div style={{width: '100%', borderBottom: "solid 1px #d8d8d8", marginBottom: '3rem'}}/>
            <div>
              <BelongsSet />
            </div>

          </div>
        )
    };
  }

  render(){
    let params = new URLSearchParams(this.props.location.search); //we need value in URL query
    let paramsStatus = params.get('status');

    return(
      <div
        className={classnames(styles.compSheet)}>
        <div
          className={classnames(styles.boxTitle)}>
          <span
            className={classnames(styles.spanTitle, "fontTitle", "colorSignBlack")}>
            {this.props.i18nUIString.catalog["title_profile"]}
          </span>
        </div>
        <div
          style={{marginTop: '3.47vh'}}>
          {this._render_SheetView(paramsStatus)}
        </div>
      </div>
    )
  }

  _handleEnter_PassBack(e){
    this.setState({
      onEnterBackPwd: true
    })
  }

  _handleLeave_PassBack(e){
    this.setState({
      onEnterBackPwd: false
    })
  }

}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    userSheet: state.userSheet,
    accountSet: state.accountSet
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {
    _set_store_userSheetMount: (sheetObj, accountSet)=>{dispatch(mountUserSheet(sheetObj, accountSet));}
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Sheet));
