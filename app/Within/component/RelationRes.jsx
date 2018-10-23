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
import DraftDisplay from '../../Component/DraftDisplay.jsx';

class RelationRes extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      unitsList: [],
      unitsBasic: {},
      marksBasic: {},
      authorsBasic: {}
    };
    this.axiosSource = axios.CancelToken.source();
    this._construct_UnitInit = this._construct_UnitInit.bind(this);
    this.style={
      withinCom_RelationRes_: {
        width: '100%',
        position: 'absolute',
        top: '0',
        left: '0'
      },
      withinCom_RelationRes_block_: {
        width: '100%',
        height: '15vh',
        position: 'relative',
        boxSizing: 'border-box',
        margin: '0 0 1vh 0',
        border: '0.75px solid black'
      },
      withinCom_RelationRes_block_img: {
        width: '45%',
        maxHeight: '100%',
        position: 'absolute',
        top: '50%',
        left: '55%',
        transform: 'translate(0, -50%)',
        boxSizing: 'border-box'
      },
      withinCom_RelationRes_block_rough_: {
        width: '55%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left:'0',
        boxSizing: 'border-box'
      },
      withinCom_RelationRes_block_rough_Propic: {
        width: '24%',
        height: '30%',
        position: 'absolute',
        top: '50%',
        left: '0'
      }
    }
  }

  _construct_UnitInit(match, location){
    let unitInit=Object.assign({}, this.state.unitsBasic[match.params.id], {marksify: true, initMark: "all", layer: 0});
    return unitInit;
  }

  componentDidMount() {
    const self = this;
    this.setState((prevState, props)=>{return {axios: true};}, ()=>{
      let url = "/router/units/"+self.props.match.params.id+"/responses";
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
              unitsBasic: resObj.main.unitsBasic,
              marksBasic: resObj.main.marksBasic,
              authorsBasic: resObj.main.authorsBasic
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
    const self = this;
    let responses = this.state.unitsList.map((key, index)=>{
      let unitBasic = this.state.unitsBasic[key];
      return (
        <div
          key={'key_unit_res_'+index}
          style={this.style.withinCom_RelationRes_block_}>
          <Link
            to={{
              pathname: self.props.match.url+"/"+key,
              state: {from: self.props.location}
            }}>
            <div
              style={this.style.withinCom_RelationRes_block_rough_}>
              <div>
                <DraftDisplay
                  editorState={this.state.marksBasic[unitBasic.marksList[0]].editorContent}/>
              </div>
              <div
                style={this.style.withinCom_RelationRes_block_rough_Propic}>
                <SvgPropic/>
              </div>
            </div>
            <img
              src={'/router/img/'+unitBasic.pic_layer0+'?type=thumb'}
              style={this.style.withinCom_RelationRes_block_img}/>
          </Link>
        </div>
      );
    })

    return (
      <div
        style={this.style.withinCom_RelationRes_}>
        {
          this.state.unitsList.length > 0 ? (
            <div>
              {responses}
            </div>
          ):(
            <div>
              {"尚未有針對此單元的回應"}
            </div>
          )
        }
        <Route
          path={this.props.match.path+"/:id"}
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
)(RelationRes));
