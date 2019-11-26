import React from 'react';
import {
  Route,
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import querystring from 'query-string';
import classnames from 'classnames';
import styles from "./styles.module.css";
import Unit from '../../../../Unit/Unit/Unit.jsx';
import NailRegular from '../../../../Component/Nails/NailRegular/NailRegular.jsx';
import {
  handleNounsList,
  handleUsersList
} from '../../../../redux/actions/general.js';
import {
  cancelErr,
  uncertainErr
} from '../../../../utils/errHandlers.js';

const styleMiddle = {

}

class Broads extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      unitsList: [],
      unitsBasic: {},
      marksBasic: {}
    };
    this.axiosSource = axios.CancelToken.source();
    this._render_Broads = this._render_Broads.bind(this);
    this._construct_UnitInit = this._construct_UnitInit.bind(this);
    this._axios_units = this._axios_units.bind(this);
    this._axios_nails_Broads = this._axios_nails_Broads.bind(this);
    this.style={

    }
  }

  _construct_UnitInit(match, location){
    let unitInit= {marksify: false, initMark: "all", layer: 0};
    return unitInit;
  }

  _axios_units(unitsList){
    const self = this;
    this.setState({axios: true});

    axios.get('/router/units', {
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      params: {
        unitsList: unitsList
      },
      cancelToken: self.axiosSource.token
    }).then(function(res){
      let resObj = JSON.parse(res.data);
      //res should contain
      //nounsListMix
      //usersList
      //unitsBasic, to state
      //marksBasic, to state
      self.props._submit_NounsList_new(resObj.main.nounsListMix);
      self.props._submit_UsersList_new(resObj.main.usersList);
      self.setState({
        unitsBasic: resObj.main.unitsBasic,
        marksBasic: resObj.main.marksBasic
      })
    }).catch(function (thrown) {
      if (axios.isCancel(thrown)) {
        cancelErr(thrown);
      } else {
        self.setState((prevState, props)=>{
          return {axios:false}
        }, ()=>{
          let message = uncertainErr(thrown);
          if(message) alert(message);
        });
      }
    });
  }

  _axios_nails_Broads(){
    const self = this;
    this.setState({axios: true});

    axios.get('/router/broad/accumulated', {
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      cancelToken: self.axiosSource.token
    }).then(function(res){
      let resObj = JSON.parse(res.data);
      //api /broad would only include unitsList
      //set unitsList in the state,
      //and get unitsBasic by api /unit before go to next
      self._axios_units(resObj.main.unitsList);
      self.setState({
        axios: false,
        unitsList: resObj.main.unitsList
      })
      return; //close this promise
    }).catch(function (thrown) {
      if (axios.isCancel(thrown)) {
        cancelErr(thrown);
      } else {
        self.setState((prevState, props)=>{
          return {axios:false}
        }, ()=>{
          let message = uncertainErr(thrown);
          if(message) alert(message);
        });
      }
    });
  }

  componentDidMount(){
    this._axios_nails_Broads();
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  _render_Broads(){
    let nailDOM=[],
        reserved = (
          <div
            key={'key_Broads_nails_titleReserved'}
            className={classnames(styles.boxReserved)}
            style={Object.assign({}, {width: '20vw'})}>
          </div>
        ), scrollFooter = (
          <div
            key={'key_Broads_nails_scrollFooter'}
            className={classnames(styles.scrollFooter)}/>
        );

    this.state.unitsList.forEach(function(unitId, index){
      //check the data status, only render after the data are ready.
      if(unitId in this.state.unitsBasic){
        nailDOM.push(
          <div
            key={'key_Broads_Nails_'+unitId}
            className={classnames(styles.boxNail)}>
            <NailRegular
              {...this.props}
              unitId={unitId}
              linkPath={this.props.match.url+'/unit'}
              unitBasic={this.state.unitsBasic[unitId]}
              marksBasic={this.state.marksBasic}/>
          </div>
        );
        //cauculate remainder to decide whether a interspace was needed or not
        let remainder = (index+1) % 3; // +1 to avoid error when index==0
        if(remainder==0) shareds.push(
          <div
            key={'key_nails_interspace'+index}
            className={classnames(styles.boxFillHoriz)}/>
        );
      }
    })

    //in the end, and only at the end!
    //push the footer
    nailDOM.push(scrollFooter);
    return nailDOM;
  }

  render(){
    return(
      <div
        className={classnames(styles.comBroad)}>
        <div
          className={classnames(styles.boxReserved, styles.boxTitle)}
          style={Object.assign({}, {width: '20vw'})}>
          {'title broad'}
        </div>
        <div
          className={classnames(styles.boxList)}>
          {this._render_Broads()}
        </div>
        <Route path={this.props.match.path+"/unit"} render={(props)=> <Unit {...props} _construct_UnitInit={this._construct_UnitInit} _refer_von_unit={this.props._refer_leaveSelf}/>}/>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {
    _submit_NounsList_new: (arr) => { dispatch(handleNounsList(arr)); },
    _submit_UsersList_new: (arr) => { dispatch(handleUsersList(arr)); }
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Broads));
