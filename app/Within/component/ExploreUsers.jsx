import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import {
  handleNounsList
} from '../../redux/actions/general.js';
import {
  cancelErr,
  uncertainErr
} from "../../utils/errHandlers.js";

const styleMiddle = {
  comExploreNouns: {
    height: ''
  },
  boxUsedList: {
    height: '',
    minHeight: '36vh',
    padding: '3% 4%',
    margin: '0 0 2%',
    textAlign: 'center'
  },
  boxRandomList: {
    height: '',
    textAlign: 'center',
    margin: '3% 0 0'
  },
  boxSubtitle: {
    height: '',
    padding: '3%',
    textAlign: 'center'
  },
  boxUsedItem: {
    display: 'inline-block',
    width: '24%',
    position: 'relative',
    boxSizing: 'border-box',
    padding: '0 5%',
    margin: '3% 0',
    cursor: 'pointer'
  },
  boxRendomItem: {
    display: 'inline-block',
    position: 'relative',
    boxSizing: 'border-box',
    padding: '0 5%',
    margin: '4% 2%',
    whiteSpace: 'nowrap',
    cursor: 'pointer'
  },
  spanMore: {
    display: 'inline-block',
    color: '#4085a0',
    cursor: 'pointer'
  },
  fontSubtitle: {
    fontSize: '1.45rem',
    fontWeight: '700',
    letterSpacing: '0.1rem',
    whiteSpace: 'nowrap',
    textAlign: 'center',
  },
  fontListItem: {
    fontSize: '1.32rem',
    letterSpacing: '0.12rem',
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
    _submit_NounsList_new: (arr, callBack) => { dispatch(handleNounsList(arr)).then(()=>{if(callBack) callBack();}); }
  }
}

class NounsBlock extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    }
    this._render_nouns_randomList = this._render_nouns_randomList.bind(this);
  }

  _render_nouns_randomList(){
    let list = this.props.nounsList.map((nounId, index)=>{
      return (
        <div
          key={"key_Explore_randomNouns_"+index}
          style={styleMiddle.boxRendomItem}>
          <Link
            to={"/cosmic/nouns/"+nounId}
            className={'plainLinkButton'}>
            <span
              style={styleMiddle.fontListItem}>
              {this.props.nounsBasic[nounId].name}
            </span>
          </Link>
        </div>
      )
    })

    return list;
  }

  render(){
    return (
      <div>
        {this._render_nouns_randomList()}
      </div>
    )
  }
}


class ExploreUsers extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      listUsed: [],
      listRandom: []
      //the random list was composed of many sub array
      //each array represent a 'block' of nouns list
    };
    this.axiosSource = axios.CancelToken.source();
    this._axios_nouns_explore = this._axios_nouns_explore.bind(this);
    this._axios_nouns_exploreMore = this._axios_nouns_exploreMore.bind(this);
    this._render_nouns_Block = this._render_nouns_Block.bind(this);
    this._render_nouns_usedList = this._render_nouns_usedList.bind(this);
    this._handleClick_Explore_more = this._handleClick_Explore_more.bind(this);
    this.style={

    }
  }

  _axios_nouns_explore(){
    const self = this;
    this.setState({axios: true});

    axios({
      method: 'get',
      url: '/router/explore/nouns',
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      cancelToken: self.axiosSource.cancelToken
    }).then(function (res) {
      self.setState({axios: false});

      let resObj = JSON.parse(res.data);
      let nounsArr = resObj.main.nounsListUsed.concat(resObj.main.nounsListRandom),
          callBack = ()=>{
            self.setState((prevState, props)=>{
              prevState.listRandom.push(resObj.main.nounsListRandom);
              return {
                listUsed: resObj.main.nounsListUsed,
                listRandom: prevState.listRandom
              }
            });
          };

      self.props._submit_NounsList_new(nounsArr, callBack);

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

  _axios_nouns_exploreMore(){
    const self = this;
    this.setState({axios: true});

    axios({
      method: 'get',
      url: '/router/explore/nouns/more',
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      cancelToken: self.axiosSource.cancelToken
    }).then(function (res) {
      self.setState({axios: false});

      let resObj = JSON.parse(res.data);
      let nounsArr = resObj.main.nounsListRandom,
          callBack = ()=>{
            self.setState((prevState, props)=>{
              prevState.listRandom.push(resObj.main.nounsListRandom);
              return {listRandom: prevState.listRandom}
            });
          };

      self.props._submit_NounsList_new(nounsArr, callBack);

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

  _handleClick_Explore_more(event){
    event.stopPropagation();
    event.preventDefault();
    this.setState((prevState, props)=>{
      prevState.listRandom.push([]);
      return {listRandom: prevState.listRandom}
    });
    this._axios_nouns_exploreMore();
  }

  _render_nouns_usedList(){
    let list = this.state.listUsed.map((nounId, index)=>{
      return (
        <div
          key={"key_Explore_usedNouns_"+index}
          style={Object.assign({}, styleMiddle.boxUsedItem, {padding: '1% 3%', margin: '2% 0px'})}>
          <Link
            to={"/cosmic/nouns/"+nounId}
            className={'plainLinkButton'}>
            <span
              style={styleMiddle.fontListItem}>
              {this.props.nounsBasic[nounId].name}</span>
          </Link>
        </div>
      )
    });
    return list;
  }

  _render_nouns_Block(){
    let list = this.state.listRandom.map((nounsBlock, index)=>{
      return (
        <NounsBlock
          key={"key_Explore_Block"+index}
          nounsList={nounsBlock}
          nounsBasic={this.props.nounsBasic}/>
      ) // nounsBasic is saved in reducer,
        // so should be called directly if the NounsBlock was imported from a independent file
    });
    //the 'more' button at the bottom
    list.push(
      <div
        key={"key_Explore_randomNouns_more"}
        style={{position: 'relative', boxSizing: 'border-box', padding: '3%', textAlign: 'center'}}>
        <span
          style={Object.assign({}, styleMiddle.fontListItem, styleMiddle.spanMore)}
          onClick={this._handleClick_Explore_more}>
          {" more "}
        </span>
      </div>
    )
    //add a footer as ending
    list.push(
      <div
        key={"key_Explore_randomNouns_footer"}
        style={{height: '81px', position: 'relative'}}></div>)

    return list;
  }

  componentDidMount() {
    //load nouns from attribution
    //and random nouns as recommandation
    this._axios_nouns_explore();
  }

  componentWillUnmount() {
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    return(
      <div
        className={'boxRelativeFull'}
        style={styleMiddle.comExploreNouns}>
        <div
          className={'boxRelativeFull'}
          style={styleMiddle.boxUsedList}>
          {this._render_nouns_usedList()}
        </div>
        <div
          className={'boxRelativeFull'}
          style={Object.assign({}, styleMiddle.boxSubtitle, styleMiddle.fontSubtitle)}>
          {"or be the First revealing these place! "}</div>
        <div
          className={'boxRelativeFull'}
          style={(styleMiddle.boxRandomList)}>
          {this._render_nouns_Block()}
        </div>
      </div>
    )
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(ExploreUsers));
