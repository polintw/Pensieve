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
import TitleInspired from '../Titles/TitleInspired.jsx';
import Unit from '../../../../Unit/Unit/Unit.jsx';
import NailInspired from '../../../../Component/Nails/NailInspired/NailInspired.jsx';
import {
  handleNounsList,
  handleUsersList
} from '../../../../redux/actions/general.js';
import {
  cancelErr,
  uncertainErr
} from '../../../../utils/errHandlers.js';

const styleMiddle = {
  titleReserved: {
    display: 'inline-block',
    height: '25vw',
    position: 'relative',
    float: 'right',
    boxSizing: 'border-box',
    backgroundColor: 'transparent'
  },
  scrollFooter: {
    display: 'inline-block',
    width: '99%',
    height: '58vh',
    minHeight: '111px',
    position: 'relative',
    boxSizing: 'border-box',
  }
}

class Inspired extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      unitsList: [],
      marksList: [],
      unitsBasic: {},
      marksBasic: {}
    };
    this.axiosSource = axios.CancelToken.source();
    this._render_Inspireds = this._render_Inspireds.bind(this);
    this._construct_UnitInit = this._construct_UnitInit.bind(this);
    this._axios_nails_Inspireds = this._axios_nails_Inspireds.bind(this);
    this.style={
      selfCom_Inspired_: {
        width: '100%',
        position: 'absolute',
        top: '0',
        left: '0'
      },
    }
  }

  _construct_UnitInit(match, location){
    let urlQuery = querystring.parse(location.search);
    //init inthis file has 2 possibilities:
    //inspired mark opened, or Unit opened from related(response)
    let unitInit= urlQuery.mark? {marksify: true, initMark: urlQuery.mark, layer: this.state.marksBasic[urlQuery.mark].layer}: {marksify: false, initMark: "all", layer: 0};
    return unitInit;
  }

  _render_Inspireds(){
    const self = this;
    let inspireds=[],
        reserved = (
          <div
            key={'key_Inspired_nails_titleReserved'}
            style={Object.assign({}, {width: '20vw'}, styleMiddle.titleReserved)}>
          </div>
        ), scrollFooter = (
          <div
            key={'key_Inspired_nails_scrollFooter'}
            style={styleMiddle.scrollFooter}></div>
        );

    //then we render Nail by Unit,
    //each Unit form only one Nail,
    //using the list in each unitBasic to accomplish this
    self.state.unitsList.forEach(function(unitKey, index){
      let unitBasic = self.state.unitsBasic[unitKey];
      inspireds.push(
        <div
          key={'key_Inspired_nails_'+unitKey}
          className={classnames(styles.boxNail)}>
          <NailInspired
            {...self.props}
            unitId={unitKey}
            unitBasic={unitBasic}
            marksBasic={self.state.marksBasic}/>
        </div>
      )
    })

    inspireds.unshift(reserved);
    inspireds.push(scrollFooter);
    return inspireds;
  }

  _axios_nails_Inspireds(){
    const self = this;
    this.setState({axios: true});

    axios.get('/router/inspire/accumulated', {
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      cancelToken: self.axiosSource.token
    }).then(function(res){
      let resObj = JSON.parse(res.data);
      self.setState({
        axios: false,
        unitsList: resObj.main.unitsList,
        marksList: resObj.main.marksList, //in fact, this marksList would not be used during rendering because we render by Unit(fragment list in unitBasic)
        unitsBasic: resObj.main.unitsBasic,
        marksBasic: resObj.main.marksBasic
      })
      //send the nouns used by all shareds to the redux reducer
      self.props._submit_NounsList_new(resObj.main.nounsListMix);
      self.props._submit_UsersList_new(resObj.main.usersList);
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
    this._axios_nails_Inspireds();
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    return(
      <div
        style={this.style.selfCom_Inspired_}>
        <div
          style={Object.assign({}, {width: '20vw'}, styleMiddle.titleReserved)}>
          <TitleInspired
            {...this.props}/>
        </div>
        <div
          className={classnames(styles.boxList)}>
          {this._render_Inspireds()}
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
)(Inspired));
