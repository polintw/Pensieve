import React from 'react';
import {
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import {
  cancelErr,
  uncertainErr
} from "../../utils/errHandlers.js";

class ActionBroad extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,

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

  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    };
  }

  render(){
    return(
      <div>

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
)(ActionBroad));
