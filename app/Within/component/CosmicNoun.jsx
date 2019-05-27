import React from 'react';
import {
  Link,
  Route,
  withRouter
} from 'react-router-dom';

const styleMiddle = {
  comExplore: {

  }
}

class CosmicNoun extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,

    };
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
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.withinCom_CosmicNoun_}>
        <div
          style={this.style.withinCom_MainIndex_scroll_}>
          <div>
            {"title"}
          </div>
          <div
            style={Object.assign({left: '9%'}, styleMiddle.boxNailsCol)}>
            {this._render_nouns_Block()}
            <div style={this.style.withinCom_MainIndex_scroll_col_footer}></div>
          </div>
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
    _submit_NounsList_new: (arr, callBack) => { dispatch(handleNounsList(arr)).then(()=>{if(callBack) callBack();}); }
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(CosmicNoun));
