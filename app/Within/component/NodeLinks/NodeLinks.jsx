import React from 'react';
import {
  Route,
  Switch,
  Link,
  withRouter,
  Redirect
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import NailRegular from '../../../Component/Nails/NailRegular/NailRegular.jsx';
import {
  handleNounsList,
  handleUsersList
} from "../../../redux/actions/general.js";

const styleMiddle = {
  boxBlocks: {
    width: '100%',
    minHeight: '5rem',
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
    fontSize: '1.45rem',
    fontWeight: '700',
    letterSpacing: '0.1rem',
    whiteSpace: 'nowrap',
    textAlign: 'center',
    color: '#AAAAAA'
  }
}

class NodeLinks extends React.Component {
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
    this._render_nouns_Block = this._render_nouns_Block.bind(this);
    this._axios_nouns_singular = this._axios_nouns_singular.bind(this);
    this.style={

    }
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
        //we don't push anything and keep it as previous if the res was empty,
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
    //check if the unitsBlock list still empty
    if(!this.state.unitsBlock[0]) return(
      <div
        style={Object.assign({}, styleMiddle.fontPlaceholder, {boxSizing: 'border-box',margin: '13% 0'})}>
        {this.props.i18nUIString.catalog["hintEmptyNode"]}
      </div>
    );
    //use Block to render if not empty
    let units = [];
    this.state.unitsBlock.forEach((block,blockIndex)=>{ //spread the list of blocks
      block.forEach((unitId,unitIndex)=>{ //then sprean each block
        units.push( //push each unit to return array directly
          <div
            key={'key_Cosmic_NodeLink_'+unitIndex}
            className={classnames(
              styles.boxNail, styles.boxRegular)}>
              <NailRegular
                {...this.props}
                unitId={unitId}
                linkPath={this.props.match.url+'/unit'}
                unitBasic={this.state.unitsBasic[unitId]}
                marksBasic={this.state.marksBasic}/>
            </div>
        );
        let remainder = (unitIndex+1) % 2; //cauculate remainder to decide whether a interspace was needed or not
        if(remainder==0) units.push(
          <div
            key={'key_Cosmic_NodeLink_interspace_'+unitIndex}
            className={classnames(styles.boxFillHoriz)}
            ></div>
        )
      })
    })

    return units;
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

  componentDidMount() {
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
      <div
        className={classnames('boxRelativeFull', styles.comNodeLink)}>
        <div
          className={classnames(styles.boxBlock)}>
          {this._render_nouns_Block()}
        </div>
        <div style={styleMiddle.footer}></div>

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
)(NodeLinks));
