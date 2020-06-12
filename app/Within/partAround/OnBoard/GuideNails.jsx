import React from 'react';
import {
  Link,
  Redirect,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import stylesNail from "../stylesNail.module.css";
import stylesFont from '../stylesFont.module.css';
import NailFeedWide from '../../../Components/Nails/NailFeedWide/NailFeedWide.jsx';
import {axios_get_UnitsBasic} from '../../../utils/fetchHandlers.js';
import {
  handleUsersList,
} from "../../../../redux/actions/general.js";
import {
  cancelErr,
  uncertainErr
} from "../../../../utils/errHandlers.js";

const guidingNaildId = [];

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
  }

  _set_unitBasic(unitsList){
    const self = this;
    this.setState({axios: true});

    axios_get_UnitsBasic(this.axiosSource.token, unitsList)
    .then((resObj)=>{
      //after res of axios_Units: call get nouns & users
      self.props._submit_UsersList_new([1]);
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

  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    // the reset would not be render before the belonged corner was set
    return (
      <div
        className={classnames(styles.comGuideNails)}>
        <div
          className={classnames(styles.boxFullWide)}
          style={{margin: '4px 0 8px'}}>
          {
            ( (!("homeland" in this.props.belongsByType) || (!this.props.belongsByType['homeland'])) &&
              (!("residence" in this.props.belongsByType) || (!this.props.belongsByType["residence"]))
            ) ? (
              <div>
                <div>
                  <span
                    className={classnames(stylesFont.fontHint, stylesFont.weightBold, stylesFont.colorAssistGold)}>
                    {this.props.i18nUIString.catalog["title_welcome"]}</span>
                </div>
                <div
                  className={classnames(
                    styles.boxModule,
                    styles.boxModuleSmall
                  )}>
                  <div
                    className={classnames(stylesNail.boxNail)}>
                    <NailFeedWide
                      {...this.props}
                      leftimg={false}
                      customNodesTitle={"welcome"}
                      unitId={guidingNaildId[0]}
                      linkPath={this.props.location.pathname + ((this.props.location.pathname == '/') ? 'unit' : '/unit')}
                      unitBasic={this.state.unitsBasic[guidingNaildId[0]]}
                      marksBasic={this.state.marksBasic}/>
                  </div>
                </div>

              </div>
            ): (
              <div>
                <div>
                  <span
                    className={classnames(stylesFont.fontHint, stylesFont.weightBold, stylesFont.colorAssistGold)}>
                    {this.props.i18nUIString.catalog["title_instruction"]}</span>
                </div>

              </div>
            )
          }
        </div>
      </div>
    )
  }

}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
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
