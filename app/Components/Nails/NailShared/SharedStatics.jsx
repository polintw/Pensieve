import React from 'react';
import {
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import {
  cancelErr,
  uncertainErr
} from "../../../utils/errHandlers.js";

const styleMiddle = {
  spanCommon: {
    display: 'block',
    boxSizing: 'border-box',
    textAlign: 'center',
  },
  fontNumDis: {
    fontSize: '2.56rem',
    letterSpacing: '0.1rem',
    fontWeight: '600',
    lineHeight: '2.3rem',
    color: '#FAFAFA',
  }
}

class SharedStatics extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      countReach: null,
      countBroad: null
    };
    this.axiosSource = axios.CancelToken.source();
    this._axios_get_AuthorStatics = this._axios_get_AuthorStatics.bind(this);
    this.style={

    };
  }

  _axios_get_AuthorStatics(){
    /*
    ignore the req for lightning ver.
    const self = this;
    this.setState({axios: true});

    axios.get('/router/share/'+this.props.unitId+"/statics?sr=summary", {
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      cancelToken: self.axiosSource.token
    }).then((res)=>{
      self.setState({axios: false});
      let resObj = JSON.parse(res.data);

      self.setState({
        countReach: resObj.main.countReach,
        countBroad: resObj.main.countBroad
      })
    }).catch(function (thrown) {
      self.setState({axios: false});
      if (axios.isCancel(thrown)) {
        cancelErr(thrown);
      } else {
        let message = uncertainErr(thrown);
        if(message) alert(message);
      }
    });
    */
  }

  componentDidMount(){
    this._axios_get_AuthorStatics();
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    };
  }

  render(){
    return(
      <div
        className={classnames(styles.comStatics)}>
        {
          this.state.countBroad &&
          <div
            className={classnames(styles.comStatics_boxWrap)}>
            <span
              style={Object.assign({}, styleMiddle.spanCommon,styleMiddle.fontNumDis)}>{this.state.countBroad}</span>
            <span
              className={classnames(styles.comStatics_fontTitle)}
              style={Object.assign({}, styleMiddle.spanCommon)}>
              {this.props.i18nUIString.catalog["descript_Unit_Author_broad"][1]}</span>
          </div>
        }
        <div
          className={classnames(styles.comStatics_boxWrap)}
          style={{marginRight: '0'}}>
          <span
            style={Object.assign({}, styleMiddle.spanCommon,styleMiddle.fontNumDis)}>{this.state.countReach}</span>
          <span
            className={classnames(styles.comStatics_fontTitle)}
            style={Object.assign({}, styleMiddle.spanCommon)}>
            {this.props.i18nUIString.catalog["descript_Unit_Author_read"][1]}</span>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    unitCurrent: state.unitCurrent
  }
}

export default withRouter(connect(
  mapStateToProps,
  null
)(SharedStatics));
