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
    padding: '5%',
    margin: '0 0 3%'
  },
  boxRandomList: {
    height: '',
    textAlign: 'center'
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
    margin: '3% 2%',
    whiteSpace: 'nowrap',
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

class ExploreNouns extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      listUsed: [],
      listRandom: []
    };
    this.axiosSource = axios.CancelToken.source();
    this._axios_nouns_explore = this._axios_nouns_explore.bind(this);
    this._render_nouns_usedList = this._render_nouns_usedList.bind(this);
    this._render_nouns_randomList = this._render_nouns_randomList.bind(this);
    this.style={

    }
  }

  _axios_nouns_explore(){
    const self = this;
    this.setState({axios: true});

    axios({
      method: 'get',
      url: '/router/nouns/explore',
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
            self.setState({
              listUsed: resObj.main.nounsListUsed,
              listRandom: resObj.main.nounsListRandom
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

  _render_nouns_usedList(){
    let list = this.state.listUsed.map((nounId, index)=>{
      return (
        <div
          key={"key_Explore_usedNouns_"+index}
          style={styleMiddle.boxUsedItem}>
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

  _render_nouns_randomList(){
    let list = this.state.listRandom.map((nounId, index)=>{
      return (
        <div
          key={"key_Explore_randomNouns_"+index}
          style={styleMiddle.boxRendomItem}>
          <span
            style={styleMiddle.fontListItem}>
            {this.props.nounsBasic[nounId].name}
          </span>
        </div>
      )
    });
    //add a footer at the bottom
    list.push(
      <div
        key={"key_Explore_randomNouns_footer"}
        style={{height: '54px', position: 'relative'}}></div>)
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
          {this._render_nouns_randomList()}
        </div>
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
    _submit_NounsList_new: (arr, callBack) => { dispatch(handleNounsList(arr)).then(()=>{if(callBack) callBack();}); }
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(ExploreNouns));
