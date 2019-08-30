import React from 'react';
import {
  Link,
  Redirect,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import {
  handleNounsList,
  handleUsersList
} from "../../../redux/actions/general.js";
import {
  cancelErr,
  uncertainErr
} from '../../../utils/errHandlers.js';

const styleMiddle = {
  boxFooterInfo: {
    alignSelf: 'flex-end',
    margin: '4.2rem 0 1.6rem',
    padding: '2rem 1.2rem 0',
    color: '#ababab'
  },
  spanFooterInfo: {
    display: 'inline-block',
    boxSizing: 'border-block',
    marginRight: '0.42rem'
  },
  textFooterInfo: {
    fontSize: '1.21rem',
    letterSpacing: '0.1rem',
  }
}

class Related extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      lastVisit: false,
      unitsList: [],
      unitsBasic: {},
      marksBasic: {},
    };
    this.axiosSource = axios.CancelToken.source();
    this._construct_UnitInit = this._construct_UnitInit.bind(this);
    this._render_IndexNails = this._render_IndexNails.bind(this);
    this._axios_nouns_singular = this._axios_nouns_singular.bind(this);
    this.style={
      withinCom_MainIndex_scroll_: {
        width: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box'
      },
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
        //we don't push anything and keep it as previous,
        //bexuase we need to let the render check if there is any id for this noun or not.
        if(resObj.main.unitsList.length>0) prevState.unitsBlock.push(resObj.main.unitsList);
        return({
          axios: false,
          unitsBlock: prevState.unitsBlock, //maybe this is not a good way, modifying the prevState directy
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

  _render_nouns_Block(){
    if(!this.state.unitsBlock[0]) return(
      <div
        style={Object.assign({}, styleMiddle.fontPlaceholder, {boxSizing: 'border-box',margin: '13% 0'})}>
        {"revealing the unknown to the curious people! "}
      </div>
    );

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

  componentDidUpdate(prevProps, prevState, snapshot){
    //becuase there is chance we jump from noun to noun, using the same component this one
    //so we check if the nounId has changed
    this.nounId = this.props.match.params.nounId;
    if(this.nounId !== prevProps.match.params.nounId){
      //load Units tagged to this noun
      this._axios_nouns_singular();
    };
  }

  componentDidMount(){
    //load Units tagged to this noun
    this.nounId = this.props.match.params.nounId;
    this._axios_nouns_singular();
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    return(
      <div>
        <div
          style={this.style.withinCom_MainIndex_scroll_}>
          <div
            className={classnames(styles.boxTop)}>
            <div>
              <RelatedOrigin
                {...this.props}
                unitId={this.props.match.params.id}/>
            </div>
          </div>

          <div
            className={styles.boxScroll}>
            {this._render_IndexNails()}
          </div>

          <div
            className={'boxRelativeFull'}
            style={{height: '156px'}}></div>
        </div>

      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo
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
)(Related));
