import React from 'react';
import {
  Route,
  Switch,
  Link,
  withRouter,
  Redirect
} from 'react-router-dom';
import {connect} from "react-redux";
import cxBind from 'classnames/bind';
import RelationRes from './RelationRes.jsx';
import RelationOrigin from './RelationOrigin.jsx';

class CosmicRelated extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      unitTo: null,

    };
    this.axiosSource = axios.CancelToken.source();
    this._refer_von_unit = this._refer_von_unit.bind(this);
    this.style={
      withinCom_CosmicRelated_: {
        width: '64%',
        position: 'absolute',
        top: '1vh',
        left: '50%',
        transform: 'translate(-50%, 0)',
        boxSizing: 'border-box'
      },
      withinCom_CosmicRelated_origin_: {
        width: '92%',
        height: '8vh',
        position: 'relative',
        left: '4%',
        boxSizing: 'border-box'
      },
      withinCom_CosmicRelated_res_: {
        width: '100%',
        position: 'relative',
        left: '0%'
      }
    }
  }

  _refer_von_unit(identifier, route){
    switch (route) {
      case 'user':
        if(identifier == this.props.userInfo.id){
          window.location.assign('/user/overview');
        }else{
          this.setState((prevState, props)=>{
            let unitTo = {
              params: '/cosmic/users/'+identifier+'/accumulated',
              query: ''
            };
            return {unitTo: unitTo}
          })
        }
        break;
      case 'noun':
        this.setState((prevState, props)=>{
          let unitTo = {
            params: '/cosmic/nouns/'+identifier,
            query: ''
          };
          return {unitTo: unitTo}
        })
        break;
      default:
        return
    }
  }

  componentDidMount() {

  }

  componentWillUnmount(){

  }

  render(){
    //let cx = cxBind.bind(styles);
    if(this.state.unitTo){return <Redirect to={this.state.unitTo.params+this.state.unitTo.query}/>}

    return(
      <div
        style={this.style.withinCom_CosmicRelated_}>
        <div
          style={this.style.withinCom_CosmicRelated_origin_}>
          <RelationOrigin
            {...this.props}
            _refer_von_unit={this.props._refer_von_unit}/>
        </div>
        <div
          style={this.style.withinCom_CosmicRelated_res_}>
          <RelationRes
            {...this.props}
            _refer_von_unit={this.props._refer_von_unit}/>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo
  }
}

export default connect(
  mapStateToProps,
  null
)(CosmicRelated);
