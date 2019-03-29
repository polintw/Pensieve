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
import Appearance from '../../Component/Appearance.jsx';
import SvgPropic from '../../Component/Svg/SvgPropic.jsx';

class CosmicUser extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      unitTo: null,
      userQueried: this.props.match.params.id,
      userBasic: null
    };
    this.axiosSource = axios.CancelToken.source();
    this._refer_von_unit = this._refer_von_unit.bind(this);
    this.style={
      withinCom_CosmicUser_: {
        width: '75%',
        position: 'absolute',
        top: '2vh',
        left: '12%',
        boxSizing: 'border-box'
      },
      withinCom_CosmicUser_appear_: {
        width: '100%',
        minHeight: '64vh',
        position: 'absolute',
        top: '48vh',
        left: '0%',
        boxSizing: 'border-box'
      },
      withinCom_CosmicUser_cover_: {
        width: '100%',
        height: '48vh',
        position: 'absolute',
        top: '2vh',
        left: '0',
        boxSizing: 'border-box'
      },
      withinCom_CosmicUser_cover_userSign_: {
        width: '40%',
        height: '55%',
        position: 'absolute',
        top: '30%',
        left: '50%',
        transform: 'translate(-50%, 0)',
        boxSizing: 'border-box'
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
              params: '/cosmic/people/'+identifier,
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
    const self = this;
    let url = "/router/cosmic/pick/user/overview?id="+this.state.userQueried;
    axios.get(url, {
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      cancelToken: self.axiosSource.token
    }).then(function (res) {
        self.setState((prevState, props)=>{
          let resObj = JSON.parse(res.data);
          return {
            axios: false,
            userBasic: resObj.main.userBasic
          }
        });
    }).catch(function (thrown) {
      if (axios.isCancel(thrown)) {
        console.log('Request canceled: ', thrown.message);
      } else {
        console.log(thrown);
        self.setState({axios: false});
        alert("Failed, please try again later");
      }
    });
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    if(this.state.unitTo){return <Redirect to={this.state.unitTo.params+this.state.unitTo.query}/>}

    return(
      <div
        style={this.style.withinCom_CosmicUser_}>
        <div
          style={this.style.withinCom_CosmicUser_cover_}>
          <div style={this.style.withinCom_CosmicUser_cover_userSign_}>
            {this.state.userBasic &&
              <span>{this.state.userBasic[this.state.userQueried].account}</span>
            }
            <div
              style={{}}>
              <SvgPropic/>
            </div>
          </div>
        </div>
        <div
          style={this.style.withinCom_CosmicUser_appear_}>
          <Appearance
            {...this.props}
            urlParam={"/router/cosmic/pick/user"}
            urlQuery={"?id="+this.state.userQueried}
            _refer_von_unit={this._refer_von_unit}/>
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

export default withRouter(connect(
  mapStateToProps,
  null
)(CosmicUser));
