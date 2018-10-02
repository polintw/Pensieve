import React from 'react';
import querystring from 'query-string';
import cxBind from 'classnames/bind';
import Appearance from '../../Component/Appearance.jsx';
import SvgPropic from '../../Component/SvgPropic.jsx';

export default class CosmicUser extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      userQueried: null,
      userBasic: null,
      tab: false
    };
    this.axiosSource = axios.CancelToken.source();
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

  componentDidMount() {
    let urlQuery = querystring.parse(this.props.location.search); //should be contain in redux
    const self = this;
    this.setState((prevState, props)=>{
      return {userQueried: urlQuery.id, tab: 'path'}
    }, ()=>{
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
        {
          this.state.tab=="path" &&
          <div
            style={this.style.withinCom_CosmicUser_appear_}>
            <Appearance
              userBasic={this.props.userBasic}
              urlParam={"/router/cosmic/pick/user"}
              urlQuery={"?id="+this.state.userQueried}/>
          </div>
        }
      </div>
    )
  }
}
