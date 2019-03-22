import React from 'react';
import {
  Link,
  Route,
  withRouter,
  Redirect
} from 'react-router-dom';
import {connect} from "react-redux";
import Unit from '../../Component/Unit.jsx';
import SvgPropic from '../../Component/Svg/SvgPropic.jsx';
import DraftDisplay from '../../Component/DraftDisplay.jsx';

class CosmicSelected extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      unitTo: null,
      unitsList: [],
      unitsBasic: {},
      marksBasic: {},
      usersBasic: {}
    };
    this.axiosSource = axios.CancelToken.source();
    this._construct_UnitInit = this._construct_UnitInit.bind(this);
    this._close_modal_Unit = this._close_modal_Unit.bind(this);
    this._refer_von_unit = this._refer_von_unit.bind(this);
    this.style={
      withinCom_Cosmic_Selected_: {
        width: '100%',
        position: 'absolute',
        top: '0',
        left: '0'
      },
      withinCom_Cosmic_Selected_list_: {

      },
      withinCom_Cosmic_Selected_list_nail_: {

      }
    }
  }

  _construct_UnitInit(match, location){
    let unitInit=Object.assign({}, this.state.unitsBasic[match.params.id], {marksify: true, initMark: "all", layer: 0});
    return unitInit;
  }

  _close_modal_Unit(){
    this.setState({
      unitModalify: false,
      focusUnitId: null
    })
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

  componentDidMount(){
    const self = this;
    this.setState((prevState, props)=>{return {axios: true};}, ()=>{
      let url = this.props.urlParam+this.props.urlQuery;
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
              unitsList: resObj.main.unitsList,
              marksBasic: resObj.main.marksBasic,
              unitsBasic: resObj.main.unitsBasic,
              usersBasic: resObj.main.usersBasic
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
    if(this.state.unitTo){return <Redirect to={this.state.unitTo.params+this.state.unitTo.query}/>}
    //let cx = cxBind.bind(styles);

    const self = this;
    let nails = this.state.unitsList.map((key, index)=>{
      let unitBasic = this.state.unitsBasic[key];
      return (
        <div
          key={'key_selected_'+index}
          style={this.style.withinCom_Cosmic_Selected_list_nail_}>
          <Link
            to={{
              pathname: self.props.match.url+"/units/"+key,
              state: {from: self.props.location}
            }}>
            <img
              src={'/router/img/'+unitBasic.pic_layer0+'?type=thumb'}
              style={{}}/>
            <div
              style={{}}>
              <div
                style={{}}>
                <SvgPropic/>
              </div>
            </div>
          </Link>
        </div>
      );
    })

    return(
      <div
        style={this.style.withinCom_Cosmic_Selected_}>
        <div
          style={this.style.withinCom_Cosmic_Selected_list_}>
          {nails}
        </div>
        <Route
          path={this.props.match.path+"/units/:id"}
          render={(props)=> <Unit {...props} _construct_UnitInit={this._construct_UnitInit} _refer_von_unit={this._refer_von_unit}/>}/>
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
)(CosmicSelected));
