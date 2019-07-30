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
    this.style={

    }
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if(prevProps.lastVisit!==this.props.lastVisit && this.props.lastVisit){
      const self = this;
      this.setState({axios: true});

      axios_Main_Banner(this.axiosSource.token, this.props.lastVisit)
        .then((bannerObj)=>{

          self.setState({
            axios: false,
            greet: true //temp method, before the real customized data constructed
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
                  {"Welcome back"}</span>
              </div>
            }
          </div>
        </div>
        <div>
          <div
            className={classnames(styles.boxName)}>
            <div style={{display: 'inline-block', marginRight: '1rem'}}>
              <span className={classnames(styles.fontSubtitle, styles.fontHello)}>
                {"Hello, "}</span>
            </div>
            <div style={{display: 'inline-block', marginRight: '2.5rem'}}>
              <AccountPlate
                size={'regular'}
                accountFisrtName={this.props.userInfo.firstName}
                accountLastName={this.props.userInfo.lastName}/>
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
