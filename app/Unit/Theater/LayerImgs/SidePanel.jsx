import React from 'react';
import {
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import AuthorPanel from '../components/Author/AuthorPanel.jsx';

class SidePanel extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={

    };
  }

  componentWillUnmount(){

  }

  render(){
    return(
      <div>
        {
          (this.props.unitCurrent.identity=="author") &&
          <AuthorPanel
            _set_Modalmode={this.props._set_Modalmode}/>
        }
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
)(SidePanel));
