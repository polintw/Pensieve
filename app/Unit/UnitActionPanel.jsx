import React from 'react';
import {
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import AuthorPanel from './Author/AuthorPanel.jsx';

class UnitActionPanel extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      Com_UnitActionPanel_: {

      }
    };
  }

  componentWillUnmount(){

  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.Com_UnitActionPanel_}>
        {
          this.props.unitCurrent.identity=="author" &&
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
)(UnitActionPanel));
