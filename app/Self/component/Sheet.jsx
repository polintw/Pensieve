import React from 'react';
import {connect} from "react-redux";
import {
  SheetAccount,
  SheetSetting,
  SheetBasic
} from './SheetCom.jsx';
import {mountUserSheet} from "../../redux/actions/general.js";

class Sheet extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false
    };
    this.axiosSource = axios.CancelToken.source();
    this.style={
      selfCom_Sheet_: {
        width: '100%',
        position: 'absolute',
        top: '0%',
        left: '0%'
      },
      selfCom_Sheet_navStatics_UserName_: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: '20vh',
        position: 'absolute',
        top: '2vh',
        right: '0',
        boxSizing: 'border-box'
      },
      selfCom_Sheet_navStatics_UserName_span_: {
        display: 'inline-block',
        position: 'relative',
        boxSizing: 'border-box',
        padding: '1% 0',
        marginRight: '14vw',
        fontWeight: '600',
        fontSize: '2.8rem',
        letterSpacing: '0.28rem',
        color: '#222222'
      },
      selfCom_Sheet_display_: {
          width: '100%',
          position: 'absolute',
          top: '28vh',
          left: '0',
          boxSizing: 'border-box',
          padding: '3vh 2.5vw'
      },
      selfCom_Sheet_display_basic_: {
        width: '100%',
        position: 'relative',
        boxSizing: 'border-box'
      },
      selfCom_Sheet_display_basic_tempSetting: {
        width: '90%',
        height: '25vh',
        position: 'relative',
        boxSizing: 'border-box',
        padding: '2vh 5%',
        margin: '0 5%'
      },
      selfCom_Sheet_display_basic_blockGender: {
        width: '90%',
        height: '7vh',
        position: 'relative',
        boxSizing: 'border-box',
        padding: '2vh 5%',
        margin: '0 5%'
      }
    }
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
          }
        });
      }, _axios_getAccountSet = ()=>{
        return axios.get('/router/account/setting', {
          headers: {
            'charset': 'utf-8',
            'token': window.localStorage['token']
          }
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
    let paramsStatus = params.get('status'), statusSetting;
    if(paramsStatus == 'setting')statusSetting = true;

    return(
      <div
        style={this.style.selfCom_Sheet_}>
        <div
          style={this.style.selfCom_Sheet_navStatics_UserName_}>
          <span style={this.style.selfCom_Sheet_navStatics_UserName_span_}>{this.props.userInfo.account}</span>
        </div>
        <div
          style={this.style.selfCom_Sheet_display_}>
          <section>
          {
            statusSetting?(
              <div
                style={this.style.selfCom_Sheet_display_basic_}>
                <SheetSetting {...this.props}/>
              </div>
            ):(
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
          }
          </section>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sheet);
