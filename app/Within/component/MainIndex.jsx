import React from 'react';
import {
  Link,
  Redirect,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import cxBind from 'classnames/bind';
import Unit from '../../Component/Unit.jsx';

const commonStyle = {
  withinCom_MainIndex_scroll_col_: {
    width: '32%',
    position: "absolute",
    top: '5vh'
  }
}

class MainIndex extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      unitsList: [],
      unitsBasic: {},
      marksBasic: {},
      colLeft: [],
      colRight: [],
      colLeftHt: 0,
      colRightHt: 0,
      colLatest: "Left", //keep in Caps
      nextRender: 0
    };
    this.axiosSource = axios.CancelToken.source();
    this._set_RenderbyCol = this._set_RenderbyCol.bind(this);
    this._construct_UnitInit = this._construct_UnitInit.bind(this);
    this.style={
      withinCom_MainIndex_: {
        width: '100%',
        minHeight: '110%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box'
      },
      withinCom_MainIndex_scroll_: {
        width: '101%',
        position: "relative"
      },
      withinCom_MainIndexRaws_unit_div_img: {
        width: '90%',
        height: 'auto'
      },
      withinCom_MainIndexRaws_unit_: {
        display: 'inline-block',
        width: '100%',
        position: 'relative',
        boxSizing: 'border-box',
        overflow: 'hidden',
        cursor: 'pointer'
      }
    }
  }

  _construct_UnitInit(match, location){
    let unitInit=Object.assign(this.state.unitsBasic[match.params.id], {marksify: true, initMark: "all", layer: 0});
    return unitInit;
  }

  _set_RenderbyCol(currentHight){
    if(this.state.nextRender == this.state.unitsList.length) return;
    this.setState((prevState, props)=> {
      //to keep state being immutable, we claim a new obj and return it in the end
      let nextState = new Object();
      let currentSide = (prevState.colLatest == "Left") ? "Left":"Right",
          opposite = (prevState.colLatest == "Left") ? "Right":"Left",
          unitKey = prevState.unitsList[prevState.nextRender];
      let unitData = prevState.unitsBasic[unitKey];

      nextState["col"+currentSide+"Ht"] = prevState["col"+currentSide+"Ht"] + currentHight;
      nextState.colLatest = (nextState["col"+currentSide+"Ht"] > this.state["col"+opposite+"Ht"] ) ? opposite : currentSide;
      nextState.nextRender = prevState.nextRender + 1;
      prevState["col"+nextState.colLatest].push(
          <div
            key={'key_CosmicCompound_'+prevState.nextRender}
            style={this.style.withinCom_MainIndexRaws_unit_}>
            <Link
              to={{
                pathname: this.props.match.url+"/units/"+unitKey,
                state: {from: this.props.location}
              }}>
              <img
                src={'/router/img/'+unitData.pic_layer0+'?type=thumb'}
                style={this.style.withinCom_MainIndexRaws_unit_div_img}
                onLoad={({currentTarget: {clientHeight}})=>this._set_RenderbyCol(clientHeight)}/>
            </Link>
          </div>
        );//notice the 'onLoad'! we use cache directly due to the SyntheticEvent property of react,
        //it can't accept 'event' pass to a invoked callback, like the whole 'setState' we used here
        nextState["col"+nextState.colLatest] = prevState["col"+nextState.colLatest];

      return nextState;
    })

  }

  componentDidMount(){
    const self = this;
    this.setState((prevState, props)=>{return {axios: true};}, ()=>{
      let url = '/router/cosmic/compound';
      axios.get(url, {
        headers: {
          'charset': 'utf-8',
          'token': window.localStorage['token']
        },
        cancelToken: self.axiosSource.token
      }).then(function (res) {
          self.setState((prevState, props)=>{
            let resObj = JSON.parse(res.data);
            return({
              axios: false,
              unitsList: resObj.main.unitsList,
              unitsBasic: resObj.main.unitsBasic,
              marksBasic: resObj.main.marksBasic
            });
          }, ()=>{
            self._set_RenderbyCol(0);
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
        style={this.style.withinCom_MainIndex_}>
        <div
          style={this.style.withinCom_MainIndex_scroll_}>
          <div
            style={Object.assign({left: '10%'}, commonStyle.withinCom_MainIndex_scroll_col_)}>
            {this.state.colLeft}
          </div>
          <div
            style={Object.assign({left: '62%', textAlign: 'right'}, commonStyle.withinCom_MainIndex_scroll_col_)}>
            {this.state.colRight}
          </div>
        </div>
        <Route
          path={this.props.match.path+"/units/:id"}
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
)(MainIndex));
