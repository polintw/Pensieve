import React from 'react';
import {
  Route,
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import Threads from '../Threads.jsx';
import TitleShared from '../Titles/TitleShared.jsx';
import Unit from '../../../../Unit/Unit/Unit.jsx';
import NailShared from '../../../../Component/Nails/NailShared/NailShared.jsx';
//ModalBox used some unstable method, considering updating some day.
import ModalBox from '../../../../Component/ModalBox.jsx';
import {handleNounsList} from '../../../../redux/actions/general.js';
import {
  cancelErr,
  uncertainErr
} from '../../../../utils/errHandlers.js';

const styleMiddle = {
  titleReserved: {
    width: '100%',
    position: 'relative',
    left: '-2.5vw',
    boxSizing: 'border-box',
    marginBottom: '3.5rem',
    backgroundColor: 'transparent'
  },
  scrollFooter: {
    display: 'inline-block',
    width: '99%',
    height: '58vh',
    minHeight: '111px',
    position: 'relative',
    boxSizing: 'border-box',
  },
  notifiedBlock: {
    display:'inline-block',
    width: '65.3%',
    position:'relative',
    boxSizing:'border-box',
    textAlign:'left',
    float:'left'
  }
}

class Shared extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      unitsList: [],
      unitsBasic: {},
      marksBasic: {},
      notifiedList: [],
      notifiedStatus: {}
    };
    this.axiosSource = axios.CancelToken.source();
    this._render_Shareds = this._render_Shareds.bind(this);
    this._construct_UnitInit = this._construct_UnitInit.bind(this);
    this._axios_nails_shareds = this._axios_nails_shareds.bind(this);
    this._handleClick_notified_Nail = this._handleClick_notified_Nail.bind(this);
    this.style={
      selfCom_Shared_: {
        width: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box'
      },
    }
  }

  _construct_UnitInit(match, location){
    let unitInit= {marksify: false, initMark: "all", layer: 0};
    return unitInit;
  }

  _handleClick_notified_Nail(event){
    event.preventDefault();
    event.stopPropagation();
    let unitId = event.currentTarget.getAttribute('sharedid');
    this.setState((prevState,props)=>{
      prevState.notifiedStatus[unitId] = {inspired: false};
      return prevState;
    })
  }

  _render_Shareds(){
    const self = this;
    let shareds = [],
        scrollFooter = (
          <div
            key={'key_Shared_nails_scrollFooter'}
            style={styleMiddle.scrollFooter}></div>
          ),
          //currently, the Nail was align by '3', three nails a row
          //to add a empty a box for the last row if less than 3n,
          //calculate the remainder of the list
          initDelta = 3-(this.state.unitsList.length % 3);

    this.state.unitsList.forEach(function(dataKey, index){
      let dataValue = self.state.unitsBasic[dataKey];
      shareds.push(
        <div
          sharedid={dataKey}
          key={'key_Shared_nails_'+index}
          className={classnames(styles.boxNail)}
          onClick={self._handleClick_notified_Nail}>
          <NailShared
            {...self.props}
            unitId={dataKey}
            unitBasic={dataValue}
            linkPath={self.props.match.url+'/unit'}
            marksBasic={self.state.marksBasic}
            notifiedStatus={self.state.notifiedStatus[dataKey]}/>
        </div>
      );
      //cauculate remainder to decide whether a interspace was needed or not
      let remainder = (index+1) % 3; // +1 to avoid error when index==0
      if(remainder==0) shareds.push(
        <div
          key={'key_Shared_nails_interspace'+index}
          className={classnames(styles.boxFillHoriz)}/>
      );

    })

    if(this.state.notifiedList.length>0){ //units have notified need to be insert to the top
      //also loop the notified list
      this.state.notifiedList.forEach((dataKey, index)=>{
        let dataValue = self.state.unitsBasic[dataKey];
        shareds.unshift(
          <div
            sharedid={dataKey}
            key={'key_Shared_notifiedNails_'+index}
            className={classnames(styles.boxNail)}
            onClick={self._handleClick_notified_Nail}>
            <NailShared
              {...self.props}
              unitId={dataKey}
              unitBasic={dataValue}
              linkPath={self.props.match.url+'/unit'}
              marksBasic={self.state.marksBasic}
              notifiedStatus={self.state.notifiedStatus[dataKey]}/>
          </div>
        );
        //cauculate remainder to decide whether a interspace was needed or not
        let remainder = (index+1) % 3; // +1 to avoid error when index==0
        //add interspace every 3 nails, or at the bottom of the notified list
        if(remainder==0 || index==(this.state.notifiedList.length-1)) shareds.push(
          <div
            key={'key_Shared_nails_interspace'+index}
            className={classnames(styles.boxFillHoriz)}/>
        );

      });
    }
    //add the empty needed for the 3n
    if(initDelta < 3){
      for(let i=0; i< initDelta; i++){
        shareds.push(
          <div
            key={'key_Shared_blankNails_'+i}
            style={{width: '20vw',
              height: '25vw',
              position: 'relative'}}/>
        )
      }
    }
    //in the end, push the footer
    shareds.push(scrollFooter);

    return shareds;
  }

  _axios_nails_shareds(){
    const self = this;
    this.setState({axios: true});
    axios.get('/router/share/accumulated', {
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
        unitsBasic: resObj.main.unitsBasic,
        marksBasic: resObj.main.marksBasic,
        notifiedList: resObj.main.notifiedList,
        notifiedStatus: resObj.main.notifiedStatus
      })
      //send the nouns used by all shareds to the redux reducer
      self.props._submit_NounsList_new(resObj.main.nounsListMix);
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
    this._axios_nails_shareds();
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    return(
      <div
        style={this.style.selfCom_Shared_}>
        <div
          style={Object.assign({}, styleMiddle.titleReserved)}>
          <TitleShared
            {...this.props}
            _axios_nails_shareds={this._axios_nails_shareds}
            _refer_von_Create={this.props._refer_leaveSelf}/>
        </div>
        <div
          className={classnames(styles.boxList)}>
          {this._render_Shareds()}
        </div>
        <ModalBox containerId="root">
          <Route path={this.props.match.path+"/:sharedId/threads"} render={(props)=> <Threads {...props} unitBasic={this.state.unitsBasic[props.match.params.sharedId]} _refer_leaveSelf={this.props._refer_leaveSelf}/>}/>
        </ModalBox>
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
    _submit_NounsList_new: (arr)=>{dispatch(handleNounsList(arr));}
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Shared));
