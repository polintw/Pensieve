import React from 'react';
import {
  Route,
  Switch,
  Link,
  withRouter,
  Redirect
} from 'react-router-dom';
import {connect} from "react-redux";
import querystring from 'query-string';
import classnames from 'classnames';
import styles from "./styles.module.css";
import Unit from '../../../Unit/Unit/Unit.jsx';
import NailSquare from '../../../Component/Nails/NailSquare/NailSquare.jsx';
import {
  handleNounsList,
  handleUsersList
} from "../../../redux/actions/general.js";
import {
  cancelErr,
  uncertainErr
} from "../../../utils/errHandlers.js";

const styleMiddle = {
  comWindowAccu: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column'
  },
  boxBlocks: {
    display: 'flex',
    justifyContent: "space-between",
    flexWrap: 'wrap',
    width: '100%',
    position: 'relative',
    boxSizing: 'border-box',
  },
  footer: {
    width: '100%',
    height: '44vh',
    position: 'relative',
    boxSizing: 'border-box'
  },
  fontPlaceholder: {

  }
}

class Accumulated extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      nailsBlock: [],
      //nailsBlock is a arr composed of multiple mixList(also an arr)
      unitsBasic: {},
      marksBasic: {},
    };
    this.axiosSource = axios.CancelToken.source();
    this._construct_UnitInit = this._construct_UnitInit.bind(this);
    this._axios_window_accumulated = this._axios_window_accumulated.bind(this);
    this._render_accumulated_Block = this._render_accumulated_Block.bind(this);
    this.style={

    }
  }

  _construct_UnitInit(match, location){
    let urlQuery = querystring.parse(location.search),
        unitInit;
    if(urlQuery.mark){
      unitInit = {marksify: true, initMark: urlQuery.mark, layer: this.state.marksBasic[urlQuery.mark].layer};
    }else{
      unitInit= {marksify: false, initMark: "all", layer: 0};
    }
    return unitInit;
  }

  _axios_window_accumulated(){
    const self = this;
    this.setState({axios: true});

    //now get the Units related to this user from database
    axios({
      method: 'get',
      url: '/router/window/accumulated?userId='+this.userId,
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
        //becuase we need to let the render check if there is any id accumulated.
        if(resObj.main.mixList.length>0) prevState.nailsBlock.push(resObj.main.mixList);
        return({
          axios: false,
          nailsBlock: prevState.nailsBlock, //maybe this is not a good way, modifying the prevState directy
          unitsBasic: Object.assign({}, prevState.unitsBasic, resObj.main.unitsBasic),
          marksBasic: Object.assign({}, prevState.marksBasic, resObj.main.marksBasic)
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

  _render_accumulated_Block(){
    if(!this.state.nailsBlock[0]) return(
      <div
        style={Object.assign({}, styleMiddle.fontPlaceholder, {boxSizing: 'border-box',margin: '13% 0'})}>
        {this.props.i18nUIString.catalog["hintEmptyUsers_accumulated"]}
      </div>
    );
    //use Block to render if not empty
    let units = [];
    this.state.nailsBlock.forEach((block,blockIndex)=>{ //spread the list of blocks
      block.forEach((unitObj,unitIndex)=>{ //then sprean each block
        //just for temp, we need to make a simple unitsList here
        //because previously, the nailsList was designed for MixBlock which need to distinguish 'type'
        if(unitObj.type=='shared') {
          units.push( //push each unit to return array directly
            <div
              key={'key_Window_Accumulated_'+unitIndex}
              className={classnames(
                styles.boxNail, styles.boxSquare)}>
                <NailSquare
                  {...this.props}
                  unitId={unitObj.id}
                  linkPath={this.props.match.url+'/unit'}
                  unitBasic={this.state.unitsBasic[unitObj.id]}
                  marksBasic={this.state.marksBasic}/>
              </div>
            );
        }
      })
    })

    //insert interspace
    //due to the temp method dealing with the old problem of MixBlock,
    //using length of array 'units' here to loop for insertion
    for(let i=Math.floor(units.length/3) ; i > 0 ; i--){
      //Notice here! we set i from the 'largest' because the 'length' would change along with the process
      //if we start from 0
      let insertIndex = i*3,
          DOM = (
            <div
              key={'key_Window_Accumulated_interspace_'+insertIndex}
              className={classnames(styles.boxFillHoriz)}
              ></div>
          );

      units.splice(insertIndex, 0, DOM);
    }

    return units;
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    //becuase there is chance we jump from user to user, using the same component this one
    //so we check if the userId has changed
    this.userId = this.props.match.params.userId || this.props.windowId; //consider both in cosmic and Terrace
    if(this.userId !== prevProps.match.params.userId){
      this._axios_window_accumulated();
    };
  }

  componentDidMount() {
    this.userId = this.props.match.params.userId || this.props.windowId; //consider both in cosmic and Terrace
    this._axios_window_accumulated();
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    return(
      <div
        style={styleMiddle.comWindowAccu}>
        <div
          style={styleMiddle.boxBlocks}>
          {this._render_accumulated_Block()}
        </div>
        <div style={styleMiddle.footer}></div>
        <Route
          path={this.props.match.path+"/unit"}
          render={(props)=> <Unit {...props} _construct_UnitInit={this._construct_UnitInit} _refer_von_unit={this.props._refer_von_userWindow}/>}/>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
    nounsBasic: state.nounsBasic,
    i18nUIString: state.i18nUIString,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_NounsList_new: (arr) => { dispatch(handleNounsList(arr)); },
    _submit_UsersList_new: (arr) => { dispatch(handleUsersList(arr)); }
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Accumulated));
