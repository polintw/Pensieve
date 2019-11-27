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
import NailInspired from '../../../../Component/Nails/NailInspired/NailInspired.jsx';
import {
  handleNounsList,
  handleUsersList
} from '../../../../redux/actions/general.js';
import {
  cancelErr,
  uncertainErr
} from '../../../../utils/errHandlers.js';

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

  _render_Inspireds(){
    const self = this;
    let inspireds=[],
        scrollFooter = (
          <div
            key={'key_Inspired_nails_scrollFooter'}
            className={classnames(styles.scrollFooter)}/>
        );

    //then we render Nail by Unit,
    //each Unit form only one Nail,
    //using the list in each unitBasic to accomplish this
    let widthCount = 0; // a value used to accumulate the 'width'--- as the width of Nail was case by case,
    self.state.unitsList.forEach(function(unitKey, index){
      let unitBasic = self.state.unitsBasic[unitKey];
      let wideNail = !!(unitBasic.marksList.length > 1); //claim a var representing the width condition

      widthCount += wideNail? 2: 1; //meaning the 'width'  of new nail going to be pushed
      if(widthCount > 3){ //meaning if the width woudl over 3 (the limit to each row),
        //than we push the interspace first before the new Nail,
        //and reset the widthCount because it is belong to the new row.
        inspireds.push(
          <div
            key={'key_Inspired_nails_interspace'+index}
            className={classnames(styles.boxFillHoriz)}/>
        );
        widthCount = wideNail? 2: 1;
      };

      inspireds.push(
        <div
          key={'key_Inspired_nails_'+unitKey}
          className={classnames(styles.boxNail)}
          style={{width: wideNail? "40vw": "20vw"}}>
          <NailInspired
            {...self.props}
            unitId={unitKey}
            unitBasic={unitBasic}
            linkPath={self.props.match.url+'/unit'}
            marksBasic={self.state.marksBasic}/>
        </div>
      );

    });

    //in the end, and only at the end!
    //push the footer
    inspireds.push(scrollFooter);
    return inspireds;
  }

  render(){
    return(
      <div
        style={this.style.selfCom_Inspired_}>
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
