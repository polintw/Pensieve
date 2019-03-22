import React from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import querystring from 'query-string';
import TitleInspired from './Titles/TitleInspired.jsx';
import DraftDisplay from '../../../Component/DraftDisplay.jsx';
import Unit from '../../../Component/Unit.jsx';
import {
  handleNounsList,
  handleUsersList
} from '../../../redux/actions/general.js';
import {
  cancelErr,
  uncertainErr
} from '../../../utils/errHandlers.js';

const commonStyle = {
  frameNail: {
    display: 'inline-block',
    width: '32%',
    height: '36vh',
    position: 'relative',
    boxSizing: 'border-box',
    margin: '2vh 0.7% 0 0'
  },
  titleReserved: {
    display: 'inline-block',
    height: '36vh',
    position: 'relative',
    float: 'right',
    boxSizing: 'border-box',
    backgroundColor: 'transparent'
  }
}

export default class Inspired extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      unitsList: [],
      marksList: [],
      unitsBasic: {},
      marksBasic: {}
    };
    this.axiosSource = axios.CancelToken.source();
    this._render_Inspireds = this._render_Inspireds.bind(this);
    this._construct_UnitInit = this._construct_UnitInit.bind(this);
    this._axios_nails_Inspireds = this._axios_nails_Inspireds.bind(this);
    this.style={
      selfCom_Inspired_: {
        width: '100%',
        position: 'absolute',
        top: '0',
        left: '0'
      },
      selfCom_Inspired_nails_: {
        width: '100%',
        position: "absolute",
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        padding: '2vh 0 0 0'
      },
    }
  }

  _construct_UnitInit(match, location){
    let urlQuery = querystring.parse(location.search);
    let unitInit= Object.assign(this.state.unitsBasic[match.params.id], {marksify: true, initMark: urlQuery.mark, layer: this.state.marksBasic[urlQuery.mark].layer});
    return unitInit;
  }

  _render_Inspireds(){
    const self = this;
    let inspireds=[],
        reserved = (
          <div
            key={'key_Inspired_nails_titleReserved'}
            style={Object.assign({}, {width: '34%'}, commonStyle.titleReserved)}>
          </div>
        );

    self.state.unitsList.forEach(function(unitKey, index){
      let unitBasic = self.state.unitsBasic[unitKey];
      self.state.unitsBasic.marksList.forEach((markKey, index)=>{
        let markBasic = self.state.marksBasic[markKey];
        inspireds.push(
          <div
            style={commonStyle.frameNail}>
            <NailInspired
              {...self.props}
              key={'key_Inspired_nails_'+index}
              markId={markKey}
              unitId={unitKey}
              unitBasic={unitBasic}
              markBasic={markBasic}/>
          </div>
        )
      })
    })

    inspireds.unshift(reserved);
    return inspireds;
  }

  _axios_nails_Inspireds(){
    const self = this;
    this.setState({axios: true});

    axios.get('/router/inspire/embedded', {
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      cancelToken: self.axiosSource.token
    }).then(function(res){
      let resObj = JSON.parse(res.data);
      let resObj = JSON.parse(res.data);
      self.setState({
        axios: false,
        unitsList: resObj.main.unitsList,
        marksList: resObj.main.marksList,
        unitsBasic: resObj.main.unitsBasic,
        marksBasic: resObj.main.marksBasic
      })
      //send the nouns used by all shareds to the redux reducer
      self.props._submit_NounsList_new(resObj.main.nounsListMix);
      self.props._submit_UsersList_new(resObj.main.usersList);
    }).catch(function (thrown) {
      if (axios.isCancel(thrown)) {
        cancelErr(thrown);
      } else {
        this.setState((prevState, props)=>{
          return {axios:false}
        }, ()=>{
          let message = uncertainErr(thrown);
          if(message) alert(message);
        });
      }
    });
  }

  componentDidMount(){
    this._axios_nails_Inspireds();
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
        style={this.style.selfCom_Inspired_}>
        <div
          style={this.style.selfCom_Inspired_nails_}>
          {this._render_Inspireds()}
        </div>
        <div
          style={Object.assign({}, {width: '35%',right: '-2%'}, commonStyle.titleReserved)}>
          <TitleInspired
            {...this.props}/>
        </div>
        <Route path={this.props.match.path+"/units/:id"} render={(props)=> <Unit {...props} _construct_UnitInit={this._construct_UnitInit} _refer_von_unit={this.props._refer_leaveSelf}/>}/>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {
    _submit_NounsList_new: (arr) => { dispatch(handleNounsList(arr)); },
    _submit_UsersList_new: (arr) => { dispatch(handleUsersList(arr)); }
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Inspired));
