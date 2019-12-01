import React from 'react';
import {
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import {
  SheetAccount,
  SheetSetting,
  SheetPassword,
  SheetBasic
} from './SheetCom.jsx';
import SvgPropic from '../../Component/Svg/SvgPropic.jsx';
import { AccountPlate } from '../../Component/AccountPlate.jsx';
import {mountUserSheet} from "../../redux/actions/general.js";

const styleMiddle = {

}

  class Sheet extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false
    };
    this.axiosSource = axios.CancelToken.source();
    this._render_SheetView = this._render_SheetView.bind(this);
    this.style={
      selfCom_Sheet_: {
        width: '100%',
        position: 'absolute',
        top: '0%',
        left: '0%'
      },
      selfCom_Sheet_ProfileTitle_: {
        width: '100%',
        height: '115px',
        position: 'absolute',
        top: '11px',
        right: '0',
        boxSizing: 'border-box',
        boxShadow: '1px 0px 3px -2px',
        backgroundColor: '#ffffff'
      },
      selfCom_Sheet_ProfileTitle_name: {
        display: 'inline-block',
        position: 'absolute',
        bottom: '22%',
        left: '6%',
        boxSizing: 'border-box',
        color: '#000000'
      },
      selfCom_Sheet_display_: {
        width: '100%',
        position: 'absolute',
        top: '151px',
        left: '0',
        boxSizing: 'border-box',
      },
      selfCom_Sheet_display_basic_: {
        display: 'inline-block',
        width: '100%',
        position: 'relative',
        boxSizing: 'border-box'
      },
      selfCom_Sheet_display_settingform: {
        width: '100%',
        position: 'relative',
        boxSizing: 'border-box',
        boxShadow: '0px 0px 3px -2px',
        backgroundColor: '#FFFFFF'
      },
      selfCom_Sheet_display_basic_tempSetting: {
        width: '100%',
        height: '152px',
        position: 'relative',
        boxSizing: 'border-box',
        marginBottom: '2.5%',
        boxShadow: '0px 0px 3px -2px',
        backgroundColor: '#FFFFFF'
      },
      selfCom_Sheet_display_basic_blockGender: {
        width: '100%',
        height: '118px',
        position: 'relative',
        boxSizing: 'border-box',
        boxShadow: '0px 0px 3px -2px',
        backgroundColor: '#FFFFFF'
      },
    }
  }

  _render_SheetView(paramsStatus){
    switch (paramsStatus) {
      case 'setting':
        return (
          <div
            style={this.style.selfCom_Sheet_display_settingform}>
            <SheetSetting {...this.props}/>
          </div>
        )
        break;
      case 'password':
        return (
          <div
            style={this.style.selfCom_Sheet_display_settingform}>
            <SheetPassword {...this.props}/>
          </div>
        )
        break;
      default:
        return (
          <div
            style={this.style.selfCom_Sheet_display_basic_}>
            <div
              style={this.style.selfCom_Sheet_display_basic_tempSetting}>
              <SheetAccount {...this.props}/>
            </div>
            <div
              style={this.style.selfCom_Sheet_display_basic_blockGender}>
              <SheetBasic {...this.props}/>
            </div>
          </div>
        )
    };
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
        if (axios.isCancel(thrown)) {
          console.log('Request canceled: ', thrown.message);
        } else {
          self.setState({axios: false});
          if (thrown.response) {
            // The request was made and the server responded with a status code that falls out of the range of 2xx
            alert('Something went wrong: '+thrown.response.data.message)
            if(thrown.response.status == 403){
              window.location.assign('/login');
            }
          } else if (thrown.request) {
              // The request was made but no response was received
              // `err.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              console.log(thrown.request);
          } else {
              // Something happened in setting up the request that triggered an Error
              console.log('Error: ', thrown.message);
          }
          console.log("Error config: "+thrown.config);
        }
      });
    }
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    let params = new URLSearchParams(this.props.location.search); //we need value in URL query
    let paramsStatus = params.get('status');

    return(
      <div
        style={this.style.selfCom_Sheet_}>
        <div
          style={this.style.selfCom_Sheet_ProfileTitle_}>
          <div
            style={this.style.selfCom_Sheet_ProfileTitle_name}>
            <AccountPlate
              size={'large'}
              accountFisrtName={this.props.userInfo.firstName}
              accountLastName={this.props.userInfo.lastName}
              styleFirst={{fontWeight: '600'}}/>
          </div>
        </div>
        <div
          style={this.style.selfCom_Sheet_display_}>
          {this._render_SheetView(paramsStatus)}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
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
