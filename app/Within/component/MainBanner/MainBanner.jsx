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
import {
  axios_Main_Banner,
} from './utils.js';
import {AccountPlate} from '../../../Component/AccountPlate.jsx';
import DateConverter from '../../../Component/DateConverter.jsx';
import CreateShare from '../../../Component/CreateShare.jsx';
import SvgCreate from '../../../Component/Svg/SvgCreate.jsx';
import {
  cancelErr,
  uncertainErr
} from '../../../utils/errHandlers.js';

class MainBanner extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      greet: false //temp use, before the real customized render constructed
    };
    this.axiosSource = axios.CancelToken.source();
    this._submit_Share_New = this._submit_Share_New.bind(this);
    this.style={

    }
  }

  _submit_Share_New(dataObj){
    window.location.assign('/user/cognition/actions/shareds/units?theater&unitId='+dataObj.unitId);
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if(prevProps.lastVisit!==this.props.lastVisit && this.props.lastVisit){
      const self = this;
      this.setState({axios: true});

      axios_Main_Banner(this.axiosSource.token, this.props.lastVisit)
        .then((bannerObj)=>{
          //there is only 'greet' or not right now
          //add more complicated check here when we increased more interact
          self.setState({
            axios: false,
            greet: bannerObj.main.greet
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
  }

  componentDidMount() {

  }

  componentWillUnmount() {
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    let date = new Date();

    return(
      <div
        className={classnames(styles.comMainBanner)}>
        <div
          className={classnames(styles.boxContent)}>
          <div
            className={classnames(styles.boxFlex)}>
            <div
              className={classnames(styles.borderBanner, styles.boxUnderline)}></div>
            {
              this.state.greet &&
              <div
                className={styles.boxGreet}>
                <span className={classnames(styles.fontSubtitle)}>
                  {this.props.i18nUIString.catalog[this.state.greet]}</span>
              </div>
            }
          </div>
        </div>
        <div>
          <div
            className={classnames(styles.boxName)}>
            <div style={{display: 'inline-block', marginRight: '1rem'}}>
              <span className={classnames(styles.fontSubtitle, styles.fontHello)}>
                {this.props.i18nUIString.catalog['helloUser']}</span>
            </div>
            <div style={{display: 'inline-block', marginRight: '2.7rem'}}>
              <AccountPlate
                size={'regular'}
                accountFisrtName={this.props.userInfo.firstName}
                accountLastName={''}/>
            </div>
            <div
              className={classnames(styles.borderBanner, styles.boxCape)}></div>
          </div>
          <div
            className={classnames(styles.boxDate, 'fontGillSN')}>
            <DateConverter
              place={'title'}
              datetime={date.getTime()}/>
          </div>
          <div
            className={classnames(styles.boxCreate)}>
            <SvgCreate
              place={false}/>
            <CreateShare
              _submit_Share_New={this._submit_Share_New}
              _refer_von_Create={this.props._refer_von_cosmic}/>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    unitCurrent: state.unitCurrent,
    mainTitle: state.mainTitle
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(MainBanner));
