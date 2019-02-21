import React from 'react';
import {
  Link,
  Redirect,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import cxBind from 'classnames/bind';
import Unit from '../../Component/Unit.jsx';
import NailScape from '../../Component/Nails/NailScape.jsx';
import {
  handleNounsList,
  handleUsersList
} from "../../redux/actions/general.js";
import {errHandler_axiosCatch} from "../../utils/errHandlers.js";

class MainIndex extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      unitTo: null,
      unitsList: [],
      unitsBasic: {},
      marksBasic: {},
      rawsArr: []
    };
    this.axiosSource = axios.CancelToken.source();
    this._construct_UnitInit = this._construct_UnitInit.bind(this);
    this._render_LtdUnitsRaws = this._render_LtdUnitsRaws.bind(this);
    this._refer_von_unit = this._refer_von_unit.bind(this);
    this._axios_cosmic_mainCompound =this._axios_cosmic_mainCompound.bind(this);
    this.style={
      withinCom_MainIndex_: {
        width: '100%',
        position: 'relative',
        boxSizing: 'border-box'
      },
      withinCom_MainIndex_scroll_: {
        width: '100%',
        position: "relative"
      }
    }
  }

  _refer_von_unit(identifier, route){
    switch (route) {
      case 'user':
        if(identifier == this.props.userInfo.id){
          window.location.assign('/user/screen');
        }
        break;
      default:
        return
    }
  }

  _construct_UnitInit(match, location){
    let unitInit=Object.assign(this.state.unitsBasic[match.params.id], {marksify: true, initMark: "all", layer: 0});
    return unitInit;
  }

  _axios_cosmic_mainCompound(url, params){
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
        prevState.unitsList.unshift(resObj.main.unitsList);
        return({
          axios: false,
          unitsList: prevState.unitsList,
          unitsBasic: resObj.main.unitsBasic,
          marksBasic: resObj.main.marksBasic
        });
      }, self._render_LtdUnitsRaws);
      self.props._submit_NounsList_new(resObj.main.nounsListMix);
      self.props._submit_UsersList_new(resObj.main.usersList);
    }).catch(function (thrown) {
      if (axios.isCancel(thrown)) {
        console.log('Request canceled: ', thrown.message);
      } else {
        self.setState({axios: false});
        let customSwitch = (status)=>{
          return null
        };
        errHandler_axiosCatch(thrown, customSwitch);
      }
    });
  }

  _render_LtdUnitsRaws(){
    let row = this.state.unitsList[0] ? this.state.unitsList[0]:[];
    let nailsArr = row.map((unitId, index)=>{
      return (
        <NailScape
          {...this.props}
          key={'key_ScapeNails_'+this.state.unitsList.length+'_'+index}
          unitId={unitId}
          unitBasic={this.state.unitsBasic[unitId]}
          marksBasic={this.state.marksBasic}/>
      )
    })

    this.setState((prevState, props)=>{
      return {rawsArr: prevState.rawsArr.concat(nailsArr)}
    });
  }

  componentDidMount(){
    this.setState((prevState, props)=>{return {axios: true};}, ()=>{
      let url = '/router/cosmic/compound',
      params = {'ordinal': 'first'};
      this._axios_cosmic_mainCompound(url, params);
    })
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    if(this.state.unitTo){return <Redirect to={this.state.unitTo.params+this.state.unitTo.query}/>}
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.withinCom_MainIndex_}>
        <div
          style={this.style.withinCom_MainIndex_scroll_}>
          {this.state.rawsArr}
        </div>
        <Route
          path="/units/:id"
          render={(props)=> <Unit {...props} _construct_UnitInit={this._construct_UnitInit} _refer_von_unit={this._refer_von_unit}/>}/>
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
)(MainIndex));
