import React from 'react';
import {
  Route,
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import Threads from './Threads.jsx';
import CreateShare from '../../Component/CreateShare.jsx';
import Unit from '../../Component/Unit.jsx';
import SvgCreate from '../../Component/SvgCreate.jsx';
import NailShared from '../../Component/Nails/NailShared.jsx';
//ModalBox used some unstable method, considering updating some day.
import ModalBox from '../../Component/ModalBox.jsx';

class Shared extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      unitsList: [],
      unitsBasic: {},
      marksBasic: {}
    };
    this.axiosSource = axios.CancelToken.source();
    this._construct_UnitInit = this._construct_UnitInit.bind(this);
    this._submit_Share_New = this._submit_Share_New.bind(this);
    this._axios_nails_shareds = this._axios_nails_shareds.bind(this);
    this.style={
      selfCom_Shared_: {
        width: '100%',
        position: 'absolute',
        top: '0',
        left: '0'
      },
      selfCom_Shared_rowCreate_: {
        width: '100%',
        height: '15vh',
        position: 'relative',
        boxSizing: 'border-box',
        padding: '2vh 0',
      },
      selfCom_Shared_top_CreateShare_: {
        display: 'inline-block',
        width: '18%',
        height: '100%',
        position: 'absolute',
        right: '5%'
      },
      selfCom_Shared_nails_: {
        width: '100%',
        position: "absolute",
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        padding: '2vh 0 0 0'
      }
    }
  }

  _construct_UnitInit(match, location){
    let unitInit= Object.assign(this.state.unitsBasic[match.params.id], {marksify: true, initMark: "all", layer: 0});
    return unitInit;
  }

  _axios_nails_shareds(){
    const self = this;
    this.setState({axios: true});
    axios.get('/router/actions/shareds', {
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      }
    }).then(function(res){
      let resObj = JSON.parse(res.data);
      self.setState({
        axios: false,
        unitsList: resObj.main.unitsList,
        unitsBasic: resObj.main.unitsBasic,
        marksBasic: resObj.main.marksBasic
      })
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

  _submit_Share_New(dataObj){
    this._axios_nails_shareds();
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
    //let cx = cxBind.bind(styles);
    const self = this;
    const rowCreate = (
      <div
        key={'key_Shared_nails_rowCreate'}
        style={Object.assign({margin: this.state.unitsList.length< 1?'2vh 0 2vh 0' : '0 0 2vh 0'},this.style.selfCom_Shared_rowCreate_)}>
        <div style={{display: 'inline-block', position: 'absolute', left: '9%'}}>
          <p style={{fontStyle: 'italic',fontSize: '1.4rem', letterSpacing: '0.15rem'}}>{"share your own, release your power"}</p>
        </div>
        <div
          style={this.style.selfCom_Shared_top_CreateShare_}>
          <SvgCreate/>
          <CreateShare
            _submit_Share_New={this._submit_Share_New}
            _refer_von_Create={this.props._refer_leaveSelf}/>
        </div>
      </div>
    );
    let shares = self.state.unitsList.map(function(dataKey, index){
      let dataValue = self.state.unitsBasic[dataKey];
      return(
        <NailShared
          {...self.props}
          key={'key_Shared_nails_'+index}
          sharedId={dataKey}
          unitBasic={dataValue}/>
      )
    })
    if(this.state.unitsList.length< 3){
      shares.push(
        rowCreate
      )
    }else{
      shares.splice(2, 0, rowCreate)
    }

    return(
      <div
        style={this.style.selfCom_Shared_}>
        <div
          style={this.style.selfCom_Shared_nails_}>
          {shares}
        </div>
        <ModalBox containerId="root">
          <Route path={this.props.match.path+"/:sharedId/threads"} render={(props)=> <Threads {...props} unitBasic={this.state.unitsBasic[props.match.params.sharedId]} _refer_leaveSelf={this.props._refer_leaveSelf}/>}/>
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
