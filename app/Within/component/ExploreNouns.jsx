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
  comExplore: {
    width: '100%',
    position: 'relative',
    boxSizing: 'border-box'
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

  _render_nouns_usedList(){
    let list = this.state.listUsed.map((nounId, index)=>{
      return (
        <div>
          {this.props.nounsBasic[nounId].name}
        </div>
      )
    });
    return list;
  }

  _render_nouns_randomList(){
    let list = this.state.listRandom.map((nounId, index)=>{
      return (
        <div>
          {this.props.nounsBasic[nounId].name}
        </div>
      )
    });
    return list;
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
        style={styleMiddle.comExplore}>
        <div>
          {this._render_nouns_usedList()}
        </div>
        <div>{"or be the First revealing these place! "}</div>
        <div>
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
