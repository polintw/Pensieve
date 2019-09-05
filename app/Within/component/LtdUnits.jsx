import React from 'react';
import {
  Link,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import cxBind from 'classnames/bind';
import Unit from '../../Unit/Unit/Unit.jsx';
import NailScape from '../../Component/Nails/NailScape.jsx';
import {
  handleNounsList,
  handleUsersList
} from "../../redux/actions/general.js";
import {errHandler_axiosCatch} from "../../utils/errHandlers.js";

class LtdUnits extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      ltdList: [],
      unitsBasic: {},
      marksBasic: {},
      nailsArr: []
    };
    this.axiosSource = axios.CancelToken.source();
    this._construct_UnitInit = this._construct_UnitInit.bind(this);
    this._axios_list_scape = this._axios_list_scape.bind(this);
    this._render_scape_nails = this._render_scape_nails.bind(this);
    this.style={
      absolute_FullVersion: {
        width: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box'
      },
      withinCom_LtdUnits_div_: {
        width: '101%',
        position: "relative"
      },
      withinCom_LtdUnits_footer: {
        width: '100%',
        height: '10vh',
        position: 'relative'
      }
    }
  }

  _construct_UnitInit(match, location){
    let unitInit= {marksify: false, initMark: "all", layer: 0};
    return unitInit;
  }

  _axios_list_scape(url, params){
    const self = this;
    this.setState({axios: true});
    axios.get(url, {
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      params: params,
      cancelToken: self.axiosSource.token
    }).then(function (res) {
      let resObj = JSON.parse(res.data);
      self.setState((prevState, props)=>{
        prevState.ltdList.unshift(resObj.main.unitsList);
        return({
          axios: false,
          ltdList: prevState.ltdList,
          unitsBasic: resObj.main.unitsBasic,
          marksBasic: resObj.main.marksBasic
        });
      }, self._render_scape_nails);
      self.props._submit_NounsList_new(resObj.main.nounsListMix);
      self.props._submit_UsersList_new(resObj.main.usersList);
    }).catch(function (thrown) {
      if (axios.isCancel(thrown)) {
        console.log('Request canceled: ', thrown.message);
      } else {
        self.setState({axios: false});
        let customSwitch = (status)=>{
          if(status == 401){
            window.location.assign('/s/signin');
          }
          return null;
        };
        errHandler_axiosCatch(thrown, customSwitch);
      }
    });
  }

  _render_scape_nails(){
    let row = this.state.ltdList[0] ? this.state.ltdList[0]:[];
    let nailsArr = row.map((unitId, index)=>{
      return (
        <NailScape
          {...this.props}
          key={'key_ScapeNails_'+this.state.ltdList.length+'_'+index}
          unitId={unitId}
          unitBasic={this.state.unitsBasic[unitId]}
          marksBasic={this.state.marksBasic}/>
      )
    })

    this.setState((prevState, props)=>{
      return {nailsArr: prevState.nailsArr.concat(nailsArr)}
    });
  }

  componentDidMount(){
    this.setState((prevState, props)=>{return {axios: true};}, ()=>{
      let url = '/router/scape',
      params = {'ordinal': 'first'};
      this._axios_list_scape(url, params);
    })
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    //let cx = cxBind.bind(styles);

    return(
      <div
        style={Object.assign({padding: '1vh 0 0 0'}, this.style.absolute_FullVersion)}>
        <div
          style={this.style.withinCom_LtdUnits_div_}>
          {this.state.nailsArr}
        </div>
        <div style={this.style.withinCom_LtdUnits_footer}></div>
        <Route
          path="/unit"
          render={(props)=> <Unit {...props} _construct_UnitInit={this._construct_UnitInit} _refer_von_unit={this.props._refer_leavevonLtd}/>}/>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {
    _submit_NounsList_new: (arr)=>{dispatch(handleNounsList(arr));},
    _submit_UsersList_new: (arr)=>{dispatch(handleUsersList(arr));}
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(LtdUnits));
