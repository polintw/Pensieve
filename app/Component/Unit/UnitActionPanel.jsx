import React from 'react';
import {
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import cxBind from 'classnames/bind';
import AuthorPanel from './AuthorPanel.jsx';
import ViewerPanel from './ViewerPanel.jsx';

class UnitActionPanel extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      Com_UnitActionPanel_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        padding: '1%, 5%'
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
         this.props.unitCurrent.identity=="author" ?(
           <AuthorPanel
             _set_Modalmode={this.props._set_Modalmode}/>
         ):(
           <ViewerPanel/>
         )
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
