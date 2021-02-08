import React from 'react';
import {
  Link,
  Redirect,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import stylesFont from '../stylesFont.module.css';
import stylesNail from "../../stylesNail.module.css";
import NailFeedWide from '../../../Components/Nails/NailFeedWide/NailFeedWide.jsx';
import NailFeedMobile from '../../../Components/Nails/NailFeedMobile/NailFeedMobile.jsx';
import {axios_get_UnitsBasic} from '../../../utils/fetchHandlers.js';
import {
  handleUsersList,
} from "../../../redux/actions/general.js";
import {
  cancelErr,
  uncertainErr
} from "../../../utils/errHandlers.js";

class GuideNails extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      unitsBasic: {},
      marksBasic: {}
    };
    this.axiosSource = axios.CancelToken.source();
    this._set_unitBasic = this._set_unitBasic.bind(this);
    this._render_GuideNails = this._render_GuideNails.bind(this);
  }

  _set_unitBasic(unitsList){
    const self = this;
    this.setState({axios: true});

    axios_get_UnitsBasic(this.axiosSource.token, unitsList)
    .then((resObj)=>{
      //after res of axios_Units: call get nouns & users
      self.props._submit_UsersList_new(resObj.main.usersList);
      //and final, update the data of units to state
      self.setState((prevState, props)=>{
        return ({
          axios: false,
          unitsBasic: {...prevState.unitsBasic, ...resObj.main.unitsBasic},
          marksBasic: {...prevState.marksBasic, ...resObj.main.marksBasic}
        });
      });
    })
    .catch(function (thrown) {
      self.setState({axios: false});
      if (axios.isCancel(thrown)) {
        cancelErr(thrown);
      } else {
        let message = uncertainErr(thrown);
        if(message) alert(message);
      }
    });

  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){
    this._set_unitBasic( (this.props.guideChoice=="welcome") ? [this.props.guidingNailsId[0]]: [this.props.guidingNailsId[1]] );
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  _render_GuideNails(){
    let unitId = this.props.guidingNailsId[ (this.props.guideChoice=="welcome") ? 0 : 1];
    if (!(unitId in this.state.unitsBasic)) return; //skip if the info of the unit not yet fetch
    // for mobile device, use one special Nail
    let cssVW = window.innerWidth;
    if(cssVW < 860) {
      return (
        <div
          className={classnames(stylesNail.boxNail, stylesNail.custNailWide)}>
          <NailFeedMobile
            {...this.props}
            leftimg={false}
            unitId={unitId}
            customNodesTitle={this.props.guideChoice}
            linkPath={this.props.location.pathname + ((this.props.location.pathname == '/') ? 'unit' : '/unit')}
            unitBasic={this.state.unitsBasic[unitId]}
            marksBasic={this.state.marksBasic} />
        </div>
      );
    };
    // for laptop / desktop, change nail by cycles
    return (
      <div
        className={classnames(stylesNail.boxNail, stylesNail.custNailWide)}>
        <NailFeedWide
          {...this.props}
          leftimg={ false}
          unitId={unitId}
          customNodesTitle={this.props.guideChoice}
          linkPath={this.props.location.pathname + ((this.props.location.pathname == '/') ? 'unit' : '/unit')}
          unitBasic={this.state.unitsBasic[unitId]}
          marksBasic={this.state.marksBasic}/>
      </div>
    );
  }

  render(){
    // the reset would not be render before the belonged corner was set
    return (
      <div
        className={classnames(styles.comGuideNails)}>
        <div
          className={classnames(styles.boxTitle)}>
          <span
            className={classnames(stylesFont.fontHint, stylesFont.weightBold, stylesFont.colorAssistGold)}>
            {this.props.i18nUIString.catalog[ (this.props.guideChoice=="welcome")? "title_welcome": 'title_instruction']}
          </span>
        </div>
        <div
          className={classnames(
            styles.boxModule,
            styles.boxModuleSmall
          )}>
          {this._render_GuideNails()}
        </div>
      </div>
    )
  }

}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    guidingNailsId: state.guidingNailsId,
    i18nUIString: state.i18nUIString,
    belongsByType: state.belongsByType,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_UsersList_new: (arr) => { dispatch(handleUsersList(arr)); },
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(GuideNails));
