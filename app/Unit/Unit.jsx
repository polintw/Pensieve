import React from 'react';
import {
  Link,
  withRouter,
  Redirect
} from 'react-router-dom';
import {connect} from "react-redux";
import Theater from './Theater.jsx';
import ModalBox from '../Component/ModalBox.jsx';
import ModalBackground from '../Component/ModalBackground.jsx';
import {setUnitCurrent} from "../redux/actions/general.js";
import {unitCurrentInit} from "../redux/constants/globalStates.js";

class Unit extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      close: false
    };
    this._close_modal_Unit = this._close_modal_Unit.bind(this);
    this.style={

    };
    //And! we have to 'hide' the scroll bar and preventing the scroll behavior to the page one for all
    //so dismiss the scroll ability for <body> here
    document.getElementsByTagName("BODY")[0].setAttribute("style","overflow-y:hidden;");
  }

  _close_modal_Unit(){
    this.setState((prevState, props)=>{
      return {
        close: true
      }
    })
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    //put in render() because we would jump from Unit to Unit without remount component
    if(this.unitId !== prevProps.match.params.id) this.unitId = this.props.match.params.id;
  }

  componentDidMount(){
    //set the current Unit id to this here to let the var could be modified
    this.unitId = this.props.match.params.id;
  }

  componentWillUnmount(){
    //reset UnitCurrent before leaving
    // It's Important !! next Unit should not have a 'coverSrc' to prevent children component render in UnitModal before Unit data response!
    let unitCurrentState = Object.assign({}, unitCurrentInit);
    this.props._set_store_UnitCurrent(unitCurrentState);
    //last, recruit the scroll ability back to <body>
    document.getElementsByTagName("BODY")[0].setAttribute("style","overflow-y:scroll;");
  }


  render(){
    if(this.state.close){return <Redirect to={this.props.location.state.from}/>}

    let params = new URLSearchParams(this.props.location.search); //we need value in URL query
    let paramsTheater = params.has('theater'); //bool, true if there is 'theater'

    return(
      <ModalBox containerId="root">
        <ModalBackground onClose={()=>{}} style={{position: "fixed", backgroundColor: (!!paramsTheater)? 'rgba(11,11,11,0.98)': 'rgba(240, 238,233, 0.98)'}}>
          {
            paramsTheater &&
            <Theater
              {...this.props}/>
          }

        </ModalBackground>
      </ModalBox>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
    unitSubmitting: state.unitSubmitting
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {
    _set_store_UnitCurrent: (obj)=>{dispatch(setUnitCurrent(obj));}
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Unit));
