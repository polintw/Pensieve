import React from 'react';
import {
  Link,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import cxBind from 'classnames/bind';
import Unit from '../../Component/Unit.jsx';
import SvgPropic from '../../Component/SvgPropic.jsx';

class RelationOrigin extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      unitBasic: {},
      authorBasic: {}
    };
    this.axiosSource = axios.CancelToken.source();
    this._construct_UnitInit = this._construct_UnitInit.bind(this);
    this.style={
      withinCom_RelationOrigin_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        border: '0.75px solid grey',
      },
      withinCom_RelationOrigin_Link: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        cursor: 'pointer'
      },
      withinCom_RelationOrigin_propic: {
        width: '15%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '3%',
        boxSizing: 'border-box'
      },
      withinCom_CosmicRelated_nouns_: {
        width: '36%',
        height: '100%',
        position: 'absolute',
        top: '0',
        right: '4%',
        boxSizing: "border-box",
        verticalAlign: 'middle',
        fontSize: '1.6rem',
        fontWeight: '400',
        letterSpacing: '0.15rem'
      }
    }
  }

  _construct_UnitInit(match, location){
    let unitInit=Object.assign({}, this.state.unitBasic, {marksify: true, initMark: "all", layer: 0});
    return unitInit;
  }

  componentDidMount() {
    const self = this;
    this.setState((prevState, props)=>{return {axios: true};}, ()=>{
      let url = "/router/units/"+self.props.match.params.id+"/basic";
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
              unitBasic: resObj.main.unitBasic,
              authorBasic: resObj.main.authorBasic
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
        style={this.style.withinCom_RelationOrigin_}>
        <Link
          to={{
            pathname: this.props.match.url+"/"+this.state.unitBasic.unitId+"/origin",
            state: {from: this.props.location}
          }}
          style={this.style.withinCom_RelationOrigin_Link}>
          <div
            style={this.style.withinCom_RelationOrigin_propic}>
            <SvgPropic/>
          </div>
          <div
            style={this.style.withinCom_CosmicRelated_nouns_}>
            {this.state.unitBasic.nouns}
          </div>
        </Link>
        <Route
          path={this.props.match.path+"/:id/origin"}
          render={(props)=> <Unit {...props} _construct_UnitInit={this._construct_UnitInit} _refer_von_unit={this.props._refer_von_unit}/>}/>
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
)(RelationOrigin));
