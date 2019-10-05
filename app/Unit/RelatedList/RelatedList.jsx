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
import NailRegular from '../../Component/Nails/NailRegular/NailRegular.jsx';
import {
  handleNounsList,
  handleUsersList
} from "../../redux/actions/general.js";
import {
  cancelErr,
  uncertainErr
} from '../../utils/errHandlers.js';

const styleMiddle = {

}

class RelatedList extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      fetchCount: 0,
      unitsBlock: [],
      //unitsBlock is a arr composed of multiple unitsList(also an arr)
      unitsBasic: {},
      marksBasic: {},
    };
    this.axiosSource = axios.CancelToken.source();
    this._render_Block_relatedList = this._render_Block_relatedList.bind(this);
    this._axios_GET_relatedFeed = this._axios_GET_relatedFeed.bind(this);
    this.style={

    }
  }

  _axios_GET_relatedFeed(){
    const self = this;
    this.setState({axios: true});

    axios({
      method: 'get',
      url: '/router/feed/unit/related',
      params: {unitId: this.props.unitId, fetchCount: this.state.fetchCount},
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
        //because we need to let the render check if there is any id for this noun or not.
        if(resObj.main.unitsList.length>0) prevState.unitsBlock.push(resObj.main.unitsList);
        return({
          axios: false,
          fetchCount: prevState.fetchCount+1,
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

  _render_Block_relatedList(){
    //before the data fetch or if any empty condition
    if(!this.state.unitsBlock[0]) return(
      <div>

      </div>
    );
    //use Block to render if not empty
    let units = [];
    this.state.unitsBlock.forEach((block,blockIndex)=>{ //spread the list of blocks
      block.forEach((unitId,unitIndex)=>{ //then sprean each block
        units.push( //push each unit to return array directly
          <div
            key={'key_Cosmic_RelatedList_'+unitIndex}
            className={classnames(
              styles.boxNail, styles.boxRegular)}>
              <NailRegular
                {...this.props}
                unitId={unitId}
                linkPath={this.props.match.url}
                unitBasic={this.state.unitsBasic[unitId]}
                marksBasic={this.state.marksBasic}/>
            </div>
        );
        let remainder = (unitIndex+1) % 2; //cauculate remainder to decide whether a interspace was needed or not
        if(remainder==0) units.push(
          <div
            key={'key_Cosmic_RelatedList_interspace'+unitIndex}
            className={classnames(styles.boxFillHoriz)}
            ></div>
        )
      })
    })

    return units;

  }

  componentDidUpdate(prevProps, prevState, snapshot){
    //becuase there is chance we jump to another Unit from Related but using the same component
    //so we check if the unit has changed
    if(this.props.unitId !== prevProps.unitId){
      this._axios_GET_relatedFeed();
    };
  }

  componentDidMount(){
    this._axios_GET_relatedFeed();
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    return(
      <div
        className={classnames(styles.comRelatedList)}>
        {this._render_Block_relatedList()}
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
)(RelatedList));
