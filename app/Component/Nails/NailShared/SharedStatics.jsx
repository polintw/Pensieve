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
  spanSubtitle: {
    display: 'block',
    boxSizing: 'border-box',
    margin: '0 0 0.87rem',
    textAlign: 'right',
    cursor: 'default'
  },
  spanNumDis: {
    display: 'block',
    boxSizing: 'border-box',
    marginLeft: '1rem',
    textAlign: 'right',
    cursor: 'default'
  },
  fontSubtitle: {
    fontSize: '1.54rem',
    letterSpacing: '0.12rem',
    fontWeight: '400',

  },
  fontNumDis: {
    fontSize: '3.2rem',
    letterSpacing: '0.12rem',
    fontWeight: '400',
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
      <div
        className={classnames(styles.boxStatics)}>
        <div>
          <span
            style={Object.assign({}, styleMiddle.spanNumDis,styleMiddle.fontNumDis)}>{this.state.countReach}</span>
          <span
            className={classnames('fontSumOpt')}
            style={Object.assign({}, styleMiddle.spanSubtitle, {color: '#FAFAFA'})}>read</span>
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
