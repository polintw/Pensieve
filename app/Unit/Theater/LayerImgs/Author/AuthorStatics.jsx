import React from 'react';
import {
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./stylesStatics.module.css";
import { SvgBulbInspired } from '../../../../Components/Svg/SvgBulb.jsx';
import {
  cancelErr,
  uncertainErr
} from "../../../../utils/errHandlers.js";

const _axios_get_AuthorStatics = (cancelToken, unitId, pathObj) => {
  let staticsPath = (pathObj.path == 'inspired') ? 'inspired' : 'sum';
  let params = {};
  if(!!pathObj.params) pathObj.params.forEach((param, index) => {
    params[param.key] = param.value;
  });
  return axios.get('/router/share/' + unitId + "/statics/" + staticsPath, {
    headers: {
      'charset': 'utf-8',
      'token': window.localStorage['token']
    },
    params: params,
    cancelToken: cancelToken
  }).then(function (res) {
    let resObj = JSON.parse(res.data); //still parse the res data prepared to be used below
    return resObj;
  }).catch(function (thrown) {
    throw thrown;
  });
}


class AuthorStatics extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axiosInspired: false,
      axiosRead: false,
      axiosLoad: false,
      countIsnpired: null,
      countRead: null,
      countLoad: null
    };
    this.axiosSource = axios.CancelToken.source();
    this._set_staticRead = this._set_staticRead.bind(this);
    this._set_staticLoad = this._set_staticLoad.bind(this);
    this._set_staticInspired = this._set_staticInspired.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    //becuase there is chance we jump to another Unit from Primer
    //so we check if the unit has changed by props.unitCurrent, diff and not null
    if (this.props.unitCurrent.unitId !== prevProps.unitCurrent.unitId && this.props.unitCurrent.unitId.length > 0) {
      this._set_staticInspired();
      this._set_staticRead();
      this._set_staticLoad();
    }
  }

  componentDidMount(){
    this._set_staticInspired();
    this._set_staticRead();
    this._set_staticLoad();
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    };
  }

  render(){
    return(
      <div
        className={classnames(styles.comStaticsSmall)}>
        <div
          className={classnames(styles.boxSet)}>
          <div>
            <span
              className={classnames("fontTitle", "colorEditBlack", "weightBold")}>
              {this.state.countLoad}
            </span>
          </div>
          <div
            className={classnames(styles.boxSetSubtitle)}>
            <span className={classnames('fontContentPlain', 'colorEditLightBlack')}>
              {this.props.i18nUIString.catalog["subTitle_Unit_AuthorStatics"][2]}
            </span>
            <br />
            <span className={classnames('fontContentPlain', 'colorEditLightBlack')}>
              {this.props.i18nUIString.catalog["text_read"]}
            </span>
          </div>
        </div>
        <div
          className={classnames(styles.boxSet)}>
          <div>
            <span
              className={classnames("fontTitle", "colorEditBlack", "weightBold")}>
              {this.state.countRead}
            </span>
          </div>
          <div
            className={classnames(styles.boxSetSubtitle)}>
            <span className={classnames('fontContentPlain', 'colorEditLightBlack')}>
              {this.props.i18nUIString.catalog["subTitle_Unit_AuthorStatics"][1]}
            </span>
            <br/>
            <span className={classnames('fontContentPlain', 'colorEditLightBlack')}>
              {this.props.i18nUIString.catalog["text_users"]}
            </span>
          </div>
        </div>
        <div
          className={classnames(styles.boxSet)}>
          <div
            className={classnames(styles.boxInspiredBulb)}>
            <SvgBulbInspired
              bulbPattern={'dark'}
              mouseReact={false} />
          </div>
          <div
            style={{paddingLeft: '24px'}}>
            <span
              className={classnames("fontTitle", "colorEditBlack", "weightBold")}>
              {this.state.countIsnpired}
            </span>
          </div>
          <div
            className={classnames(styles.boxSetSubtitle)}>
            <span className={classnames('fontContentPlain', 'colorEditLightBlack')}>
              {this.props.i18nUIString.catalog["subTitle_Unit_AuthorStatics"][0]}
            </span><br />
            <span className={classnames('fontContentPlain', 'colorEditLightBlack')}>
              {this.props.i18nUIString.catalog["text_users"]}
            </span>
          </div>
        </div>
      </div>
    )
  }

  _set_staticInspired() {
    const self = this;
    this.setState({ axiosInspired: true });

    _axios_get_AuthorStatics(this.axiosSource.token, this.props.unitCurrent.unitId, {
      path: 'inspired', params: [{key: 'sum', value: true}]
    })
      .then((resObj) => {
        self.setState({
          axiosInspired: false,
          countIsnpired: resObj.main.sum
        });
      }).catch(function (thrown) {
        self.setState({ axios: false });
        if (axios.isCancel(thrown)) {
          cancelErr(thrown);
        } else {
          let message = uncertainErr(thrown);
          if (message) alert(message);
        }
      });
  }

  _set_staticRead() {
    const self = this;
    this.setState({ axiosRead: true });

    _axios_get_AuthorStatics(this.axiosSource.token, this.props.unitCurrent.unitId, {
      path: 'sum', params: [{ key: 'target', value: "engaged" }]
    })
      .then((resObj) => {
        self.setState({
          axiosRead: false,
          countRead: resObj.main.sum
        });
      }).catch(function (thrown) {
        self.setState({ axios: false });
        if (axios.isCancel(thrown)) {
          cancelErr(thrown);
        } else {
          let message = uncertainErr(thrown);
          if (message) alert(message);
        }
      });
  }

  _set_staticLoad() {
    const self = this;
    this.setState({ axiosLoad: true });

    _axios_get_AuthorStatics(this.axiosSource.token, this.props.unitCurrent.unitId, {
      path: 'sum', params: [{ key: 'target', value: "loaded"}]
    })
      .then((resObj) => {
        self.setState({
          axiosLoad: false,
          countLoad: resObj.main.sum
        });
      }).catch(function (thrown) {
        self.setState({ axios: false });
        if (axios.isCancel(thrown)) {
          cancelErr(thrown);
        } else {
          let message = uncertainErr(thrown);
          if (message) alert(message);
        }
      });
  }
}

const mapStateToProps = (state)=>{
  return {
    i18nUIString: state.i18nUIString,
    unitCurrent: state.unitCurrent
  }
}

export default withRouter(connect(
  mapStateToProps,
  null
)(AuthorStatics));
