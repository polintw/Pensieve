import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";

class NavSign extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
        <div>

        </div>
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(NavSign));
