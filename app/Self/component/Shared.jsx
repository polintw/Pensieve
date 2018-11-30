import React from 'react';
import {
  Route,
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import NailShared from './NailShared.jsx';
import Threads from './Threads.jsx';
import CreateShare from '../../Component/CreateShare.jsx';
import Unit from '../../Component/Unit.jsx';
//ModalBox used some unstable method, considering updating some day.
import ModalBox from '../../Component/ModalBox.jsx';

class Shared extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      unitsList: [],
      unitsBasicSet: {}
    };
    this._construct_UnitInit = this._construct_UnitInit.bind(this);
    this._submit_Share_New = this._submit_Share_New.bind(this);
    this.style={
      selfCom_Shared_: {
        width: '100%',
        position: 'absolute',
        top: '0',
        left: '0'
      },
      selfCom_Shared_top_: {
        width: '100%',
        height: '16vh',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        padding: '2vh 0'
      },
      selfCom_Shared_top_CreateShare_: {
        width: '36%',
        height: '100%',
        verticalAlign: 'middle',
        float: 'right'
      },
      selfCom_Shared_nails_: {
        width: '100%',
        position: "absolute",
        top: '16vh',
        left: '0',
        boxSizing: 'border-box',
        padding: '2vh 0 0 0'
      }
    }
  }

  _construct_UnitInit(match, location){
    let unitInit= Object.assign(this.state.unitsBasicSet[match.params.id], {marksify: true, initMark: "all", layer: 0});
    return unitInit;
  }

  _submit_Share_New(dataObj){
    const self = this;
    axios.get('/router/user/cognition/shared', {
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      }
    }).then(function(res){
      self.setState({
        unitsList: res.data.main.unitsList,
        unitsBasicSet: res.data.main.unitsBasicSet
      })
    })
  }

  componentDidMount(){
    const self = this;
    axios.get('/router/user/cognition/shared', {
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      }
    }).then(function(res){
      self.setState({
        unitsList: res.data.main.unitsList,
        unitsBasicSet: res.data.main.unitsBasicSet
      })
    })
  }

  render(){
    //let cx = cxBind.bind(styles);
    const self = this;
    let shares = self.state.unitsList.map(function(dataKey, index){
      let dataValue = self.state.unitsBasicSet[dataKey];
      return(
        <NailShared
          {...self.props}
          key={'key_Shared_nails_'+index}
          sharedId={dataKey}
          unitBasic={dataValue}/>
      )
    })

    return(
      <div
        style={this.style.selfCom_Shared_}>
        <div
          style={this.style.selfCom_Shared_top_}>
          <div
            style={this.style.selfCom_Shared_top_CreateShare_}>
            <img src="/images/vacancy.png" style={{width: '100%', height: '100%'}}/>
            <CreateShare
              _submit_Share_New={this._submit_Share_New}
              _refer_von_Create={this.props._refer_leaveSelf}/>
          </div>
        </div>
        <div
          style={this.style.selfCom_Shared_nails_}>
          {shares}
        </div>
        <ModalBox containerId="root">
          <Route path={this.props.match.path+"/:sharedId/threads"} render={(props)=> <Threads {...props} unitBasic={this.state.unitsBasicSet[props.match.params.sharedId]} _refer_leaveSelf={this.props._refer_leaveSelf}/>}/>
        </ModalBox>
        <Route path={this.props.match.path+"/units/:id"} render={(props)=> <Unit {...props} _construct_UnitInit={this._construct_UnitInit} _refer_von_unit={this.props._refer_leaveSelf}/>}/>
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

export default withRouter(connect(
  mapStateToProps,
  null
)(Shared));
