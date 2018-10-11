import React from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import CreateShare from '../../Component/CreateShare.jsx';
import Unit from '../../Component/Unit.jsx';

export default class Shared extends React.Component {
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
      },
      selfCom_Shared_nails_div_: {
        display: 'inline-block',
        width: '32%',
        height: '32vh',
        position: 'relative',
        boxSizing: 'border-box',
        margin: '0 1% 2vh 0',
        overflow: 'hidden',
        cursor: 'pointer'
      },
      selfCom_Shared_nails_div_img: {
        maxWidth: '150%',
        maxHeight: '150%',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)'
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
        <Link
          key={'key_Shared_nails_'+index}
          to={{
            pathname: self.props.match.url+"/units/"+dataKey,
            state: {from: self.props.location}
          }}>

          <div
            unitname={dataKey}
            style={self.style.selfCom_Shared_nails_div_}>
            <img
              src={'/router/img/'+dataValue.pic_layer0+'?type=thumb'}
              style={self.style.selfCom_Shared_nails_div_img}/>
          </div>
        </Link>
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
              userBasic={this.props.userBasic}
              _submit_Share_New={this._submit_Share_New}/>
          </div>
        </div>
        <div
          style={this.style.selfCom_Shared_nails_}>
          {shares}
        </div>
        <Route path={this.props.match.path+"/units/:id"} render={(props)=> <Unit {...props} _construct_UnitInit={this._construct_UnitInit} _refer_von_unit={this.props._refer_leaveSelf}/>}/>
      </div>
    )
  }
}
