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
    fontSize: '2.3rem',
    letterSpacing: '0.1rem',
    fontWeight: '600',
    lineHeight: '2rem',
    color: '#FAFAFA',
  }
}

class SharedStatics extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      countReach: null
    };
    this.axiosSource = axios.CancelToken.source();
    this._axios_get_AuthorStatics = this._axios_get_AuthorStatics.bind(this);
    this.style={

    };
  }

  _axios_get_AuthorStatics(){
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

      self.setState({countReach: resObj.main.countReach})
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
      <div>
        <div>
          <span
            style={Object.assign({}, styleMiddle.spanCommon,styleMiddle.fontNumDis)}>{this.state.countReach}</span>
          <span
            className={classnames(styles.fontStaticTitle)}
            style={Object.assign({}, styleMiddle.spanCommon)}>read</span>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent
  }
}

export default withRouter(connect(
  mapStateToProps,
  null
)(SharedStatics));
