import React from 'react';
import {
  Route,
  Switch,
  Link,
  withRouter,
  Redirect
} from 'react-router-dom';
import {connect} from "react-redux";

import Unit from '../../Component/Unit.jsx';
import {
  handleNounsList,
  handleUsersList
} from "../../redux/actions/general.js";
import {
  cancelErr,
  uncertainErr
} from "../../utils/errHandlers.js";

const styleMiddle = {
  comWindowAccu: {

  },
  boxBlocks: {

  },
  footer: {

  }
}

class Accumulated extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      unitsBlock: [],
      //unitsBlock is a arr composed of multiple unitsList(also an arr)
      unitsBasic: {},
      marksBasic: {},
    };
    this.axiosSource = axios.CancelToken.source();
    this._construct_UnitInit = this._construct_UnitInit.bind(this);
    this._axios_nouns_singular = this._axios_nouns_singular.bind(this);
    this._render_accumulated_Block = this._render_accumulated_Block.bind(this);
    this.style={

    }
  }

  _construct_UnitInit(match, location){
    let unitInit= {marksify: false, initMark: "all", layer: 0};
    return unitInit;
  }

  _axios_nouns_singular(){
    const self = this;
    this.setState({axios: true});

    //now get the Units of this noun from the attribution in database
    axios({
      method: 'get',
      url: '/router/nouns/'+this.userId,
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      cancelToken: self.axiosSource.cancelToken
    }).then(function (res) {

      let resObj = JSON.parse(res.data);
      self.props._submit_NounsList_new(resObj.main.nounsListMix);
      self.props._submit_UsersList_new(resObj.main.usersList);
      self.setState((prevState, props)=>{
        //we don't push anything and keep it as previous,
        //bexuase we need to let the render check if there is any id for this noun or not.
        if(resObj.main.unitsList.length>0) prevState.unitsBlock.push(resObj.main.unitsList);
        return({
          axios: false,
          unitsBlock: prevState.unitsBlock, //maybe this is not a good way, modifying the prevState directy
          unitsBasic: resObj.main.unitsBasic,
          marksBasic: resObj.main.marksBasic
        });
      });
    }).catch(function (thrown) {
      self.setState({axios: false});
      if (axios.isCancel(thrown)) {
        cancelErr(thrown);
      } else {
        let message = uncertainErr(thrown);
        if(message) alert(message);
      }
    });

  }

  _render_nouns_Block(){
    if(!this.state.unitsBlock[0]) return(
      <div
        style={Object.assign({}, styleMiddle.fontPlaceholder, {boxSizing: 'border-box',margin: '13% 0'})}>
        {"revealing the unknown to the curious people! "}
      </div>
    );

    let list = this.state.unitsBlock.map((unitBlock, index)=>{
      return (
        <MixBlock/>
      )
    });

    return list;
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    //becuase there is chance we jump from noun to noun, using the same component this one
    //so we check if the userId has changed
    this.userId = this.props.match.params.userId;
    if(this.userId !== prevProps.match.params.userId){
      //load Units tagged to this noun
      this._axios_nouns_singular();
    };
  }

  componentDidMount() {
    //load Units tagged to this noun
    this.userId = this.props.match.params.userId;
    this._axios_nouns_singular();
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    return(
      <div
        className={'boxAbsoluteFull'}
        style={styleMiddle.comWindowAccu}>
        <div
          style={styleMiddle.boxBlocks}>
          {this._render_accumulated_Block()}
        </div>
        <div style={styleMiddle.footer}></div>
        <Route
          path={this.props.match.path+"/units/:id"}
          render={(props)=> <Unit {...props} _construct_UnitInit={this._construct_UnitInit} _refer_von_unit={this.props._refer_von_cosmic}/>}/>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
    nounsBasic: state.nounsBasic,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Accumulated));
