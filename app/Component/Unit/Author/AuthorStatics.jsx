import React from 'react';
import {
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";

const styleMiddle = {
  fontSubtitle: {

  },
  fontNumDis: {

  }
}

class AuthorStatics extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      viewCount: null
    };
    this.axiosSource = axios.CancelToken.source();
    this._axios_get_AuthorStatics = this._axios_get_AuthorStatics.bind(this);
    this.style={

    };
  }

  _axios_get_AuthorStatics(){
    
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
            style={styleMiddle.fontSubtitle}>view</span>
          <span
            style={styleMiddle.fontNumDis}>{this.state.viewCount}</span>
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
