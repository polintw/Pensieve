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

class MainIndex extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      unitsList: [],
      unitsBasic: {},
      marksBasic: {},
      colLeft: [],
      colRight: []
    };
    this.axiosSource = axios.CancelToken.source();
    this._construct_UnitInit = this._construct_UnitInit.bind(this);
    this._render_LtdUnitsRaws = this._render_LtdUnitsRaws.bind(this);
    this.style={
      withinCom_MainIndex_: {
        width: '100%',
        minHeight: '110%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box'
      },
      withinCom_MainIndex_scroll_: {
        width: '101%',
        position: "relative"
      }
    }
  }

  _construct_UnitInit(match, location){
    let unitInit=Object.assign(this.state.unitsBasic[match.params.id], {marksify: true, initMark: "all", layer: 0});
    return unitInit;
  }

  _render_LtdUnitsRaws(){
    let point = 0;
    let raws = [];
    while (point< this.state.unitsList.length) {
      let number = Math.floor(Math.random()*3)+1;
      if(this.state.unitsList.length-point < number){number = this.state.unitsList.length-point;};
      raws.push(

      )
      point +=  number;
    };
    this.setState({colLeft: raws});
  }

  componentDidMount(){
    const self = this;
    this.setState((prevState, props)=>{return {axios: true};}, ()=>{
      let url = '/router/cosmic/compound';
      axios.get(url, {
        headers: {
          'charset': 'utf-8',
          'token': window.localStorage['token']
        },
        cancelToken: self.axiosSource.token
      }).then(function (res) {
          self.setState((prevState, props)=>{
            let resObj = JSON.parse(res.data);
            return({
              axios: false,
              unitsList: resObj.main.unitsList,
              unitsBasic: resObj.main.unitsBasic,
              marksBasic: resObj.main.marksBasic
            });
          }, self._render_LtdUnitsRaws);
      }).catch(function (thrown) {
        if (axios.isCancel(thrown)) {
          console.log('Request canceled: ', thrown.message);
        } else {
          console.log(thrown);
          self.setState({axios: false});
          alert("Failed, please try again later");
        }
      });
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
        style={this.style.withinCom_MainIndex_}>
        <div
          style={this.style.withinCom_MainIndex_scroll_}>
          <div>
            {this.state.colLeft}
          </div>
          <div>
            {this.state.colRight}
          </div>
        </div>
        <Route
          path={this.props.match.path+"/units/:id"}
          render={(props)=> <Unit {...props} _construct_UnitInit={this._construct_UnitInit} _refer_von_unit={this.props._refer_von_unit}/>}/>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo
  }
}

export default withRouter(connect(
  mapStateToProps,
  null
)(MainIndex));
