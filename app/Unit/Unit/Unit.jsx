import React from 'react';
import {
  Link,
  withRouter,
  Redirect
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import Theater from '../Theater/Theater.jsx';
import Related from '../Related/Related.jsx';
import ModalBox from '../../Component/ModalBox.jsx';
import ModalBackground from '../../Component/ModalBackground.jsx';
import {setUnitCurrent} from "../../redux/actions/general.js";
import {unitCurrentInit} from "../../redux/constants/globalStates.js";

const styleMiddle = {
  spanRelatedClose: {
    display: 'inline-block',
    margin: '0 0.54rem',
    fontSize: '1.32rem',
    fontWeight: '700',
    fontStyle: 'normal',
    lineHeight: '3rem',
    color: '#4085a0',
    cursor: 'pointer'
  }
}

class Unit extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      close: false,
      onSpanBack: false
    };
    this._close_modal_Unit = this._close_modal_Unit.bind(this);
    this._handleEnter_spanBack = this._handleEnter_spanBack.bind(this);
    this._handleLeave_spanBack = this._handleLeave_spanBack.bind(this);
    this.style={

    };
    //And! we have to 'hide' the scroll bar and preventing the scroll behavior to the page one for all
    //so dismiss the scroll ability for <body> here
    document.getElementsByTagName("BODY")[0].setAttribute("style","overflow-y:hidden;");
  }

  _handleEnter_spanBack(e){
    //don't need to stop proppagation,
    //because both the 'onMouseEnter' & 'onMouseLeave'
    //would not 'bubble'
    this.setState({
      onSpanBack: true
    })
  }

  _handleLeave_spanBack(e){
    //don't need to stop proppagation,
    //because both the 'onMouseEnter' & 'onMouseLeave'
    //would not 'bubble'
    this.setState({
      onSpanBack: false
    })
  }

  _close_modal_Unit(){
    //close the whole Unit Modal
    //different from the one in Theater, which used only for closing Theater
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
            (paramsTheater) ? (
              <Theater
                {...this.props}
                _close_theaterHeigher={this._close_modal_Unit}/>
            ): (
              <div>
                <div>

                  <Related
                    {...this.props}/>
                  <div
                    className={classnames(styles.boxSubtitle)}>
                    <span
                      style={Object.assign({}, styleMiddle.spanRelatedClose)}
                      onClick={(e)=>{e.stopPropagation();e.preventDefault();this._close_modal_Unit()}}>
                      {" close "}
                    </span>
                  </div>
                </div>
                <div
                  className={classnames(styles.boxBack)}>
                  <span
                    className={classnames(styles.spanBack)}
                    style={this.state.onSpanBack?{color: '#333333'}:{}}
                    onClick={(e)=>{e.stopPropagation();e.preventDefault();this._close_modal_Unit()}}
                    onMouseEnter={this._handleEnter_spanBack}
                    onMouseLeave={this._handleLeave_spanBack}>
                    {" X "}
                  </span>
                </div>
              </div>
            )
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
