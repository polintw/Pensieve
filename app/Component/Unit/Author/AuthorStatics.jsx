import React from 'react';
import {
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import {
  cancelErr,
  uncertainErr
} from "../../../utils/errHandlers.js";

const styleMiddle = {
  spanSubtitle: {
    display: 'block',
    boxSizing: 'border-box',
    margin: '0 0 1rem',
    textAlign: 'left',
  },
  spanNumDis: {
    display: 'block',
    boxSizing: 'border-box',
    textAlign: 'right'
  },
  fontSubtitle: {
    fontSize: '1.2rem',
    letterSpacing: '0.142rem',
    fontWeight: '400',
    color: '#FAFAFA',
  },
  fontNumDis: {
    fontSize: '2.1rem',
    letterSpacing: '0.2rem',
    fontWeight: '400'
  }
}

class AuthorStatics extends React.Component {
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

    axios.get('/router/share/'+this.props.unitCurrent.unitId+"/statics?sr=summary", {
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      cancelToken: self.axiosSource.token
    }).then((res)=>{
      self.setState({axios: false});
      let resObj = JSON.parse(res.data);

      self.setState({countReach: resObj.countReach})
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
            style={Object.assign({}, styleMiddle.spanSubtitle, styleMiddle.fontSubtitle)}>reach</span>
          <span
            style={Object.assign({}, styleMiddle.spanNumDis,styleMiddle.fontNumDis)}>{this.state.countReach}</span>
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
)(AuthorStatics));
