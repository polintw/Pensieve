import React from 'react';
import {
  Link,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import SimpleBlock from './SimpleBlock.jsx';
import {
  handleNounsList,
  handleUsersList
} from "../../redux/actions/general.js";
import {
  cancelErr,
  uncertainErr
} from "../../utils/errHandlers.js";

const styleMiddle = {
  comNounSingular: {
    height: '',
  },
  boxScroll: {
    width: '932px',
    position: 'absolute',
    top: '4.8vh',
    left: '50%',
    transform: 'translate(-50%,0)',
    boxSizing: 'border-box'
  },
  boxTitle: {

  },
  boxBlocks: {
    width: '100%',
    position: 'relative',
    boxSizing: 'border-box',
  },
  footer: {
    width: '100%',
    height: '5rem',
    position: 'relative',
    boxSizing: 'border-box'
  }
}

class CosmicNoun extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      unitsBlock: [],
      //unitsBlock is a arr composed of multiple unitsList(also an arr)
      unitsBasic: {},
      marksBasic: {},
    };
    this.nounId = this.props.match.params.nounId;
    this.axiosSource = axios.CancelToken.source();
    this._construct_UnitInit = this._construct_UnitInit.bind(this);
    this._render_nouns_Block = this._render_nouns_Block.bind(this);
    this._axios_nouns_singular = this._axios_nouns_singular.bind(this);
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
      url: '/router/nouns/'+this.nounId,
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
        prevState.unitsBlock.push(resObj.main.unitsList);
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
    let list = this.state.unitsBlock.map((unitBlock, index)=>{
      return (
        <SimpleBlock
          key={"key_Cosmicnoun_blocks_"+index}
          unitsList={unitBlock}
          unitsBasic={this.state.unitsBasic}
          marksBasic={this.state.marksBasic}/>
      )
    });

    return list;
  }

  componentDidMount() {
    //load Units tagged to this noun
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
        style={styleMiddle.comNounSingular}>
        <div
          style={styleMiddle.boxScroll}>
          <div
            style={styleMiddle.boxTitle}>
            <div>
              {}
            </div>
          </div>
          <div
            style={styleMiddle.boxBlocks}>
            {this._render_nouns_Block()}
          </div>
          <div style={styleMiddle.footer}></div>
        </div>
        <div style={{width: '100%', height: '3vh', position: 'fixed', top: '0', backgroundColor: '#FCFCFC'}}></div>
        <div style={{width: '100%', height: '2.4rem', position: 'fixed', bottom: '0', backgroundColor: '#FCFCFC'}}></div>
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
    _submit_NounsList_new: (arr) => { dispatch(handleNounsList(arr)); },
    _submit_UsersList_new: (arr) => { dispatch(handleUsersList(arr)); }
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(CosmicNoun));
