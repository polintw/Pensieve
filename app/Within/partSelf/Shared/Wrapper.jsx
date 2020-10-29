import React from 'react';
import {
  Link,
  Switch,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import {
  axios_visit_GET_last,
  axios_visit_Index
} from './utils.js';

import UnitScreen from '../../../Unit/UnitScreen/UnitScreen.jsx';
import {
  setWithinFlag
} from "../../../redux/actions/within.js";
import {
  cancelErr,
  uncertainErr
} from '../../../utils/errHandlers.js';

class Wrapper extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      lastVisit: false,
    };
    this.axiosSource = axios.CancelToken.source();
    this._createdRespond = this._createdRespond.bind(this);
    this._construct_UnitInit = this._construct_UnitInit.bind(this);
    this._render_FooterHint = this._render_FooterHint.bind(this);
  }

  _construct_UnitInit(match, location){
    let unitInit= {marksify: false, initMark: "all", layer: 0};
    return unitInit;
  }

  _createdRespond(){
    this.props._set_WithinFlag(true, "chainFetRespond");
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){
    const self = this;
    this.setState({axios: true});

    //get the last visit situation for child component
    axios_visit_GET_last(self.axiosSource.token)
    .then(function(lastVisitRes){
      self.setState({
        axios: false,
        lastVisit: lastVisitRes.main.lastTime
      });
      axios_visit_Index(this.axiosSource.token);
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

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    return(
      <div>
        <div
          className={classnames(styles.comSelfWrapper)}>
          <div
            className={classnames(styles.boxRow, styles.boxRowTop)}>

          </div>
          <div
            className={classnames(styles.boxRow)}>

          </div>
          <div
            className={classnames(styles.boxRow, styles.boxFooter)}>
            {
              this._render_FooterHint()
            }
          </div>
        </div>

        <Route
          path={((this.props.location.pathname =="/") ? '' : this.props.location.pathname.slice(0, -5))+ '/unit' }
          render={(props)=> {
            return (
              <UnitScreen
                {...props}
                _createdRespond= {this._createdRespond}
                _construct_UnitInit={this._construct_UnitInit}
                _refer_von_unit={this.props._refer_von_cosmic}/>
            )
          }
        }/>
      </div>
    )
  }

  _render_FooterHint(){
    return (
      <span
        className={classnames(styles.spanFooterHint, "fontTitleSmall", "colorLightGrey")}>
        {this.props.i18nUIString.catalog['descript_AroundIndex_footer']}</span>
    );
  }
}


const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    belongsByType: state.belongsByType,
    sharedsList: state.sharedsList
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _set_WithinFlag: (bool, flag) => {dispatch(setWithinFlag(bool, flag)); }
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Wrapper));
