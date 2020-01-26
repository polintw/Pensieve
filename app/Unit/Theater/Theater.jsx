import React from 'react';
import {
  Link,
  withRouter,
  Redirect
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import UnitModal from '../UnitModal.jsx';
import UnitEditing from '../UnitEditing.jsx';
import WarningModal from '../../Component/Dialog/WarningModal.jsx';

class Theater extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      close: false,
      mode: this.props.unitMode?this.props.unitMode:"viewer",
      warningModal: false,
      warningType: null,
      onSpanBack: false,
    };
    this.unitInit = this.props._construct_UnitInit(this.props.match, this.props.location);
    this._render_UnitMode = this._render_UnitMode.bind(this);
    this._close_theater = this._close_theater.bind(this);
    this._handleEnter_spanBack = this._handleEnter_spanBack.bind(this);
    this._handleLeave_spanBack = this._handleLeave_spanBack.bind(this);
    this._handleClick_heigherBack = this._handleClick_heigherBack.bind(this);
    this._set_WarningModal_positive = this._set_WarningModal_positive.bind(this);
    this._set_WarningModal_negative = this._set_WarningModal_negative.bind(this);
    this._set_Modalmode = (mode)=>{this.setState((prevState, props)=>{return {mode: mode}})};

    this.style={

    };
  }

  _handleEnter_spanBack(e){
    this.setState({
      onSpanBack: true
    })
  }

  _handleLeave_spanBack(e){
    this.setState({
      onSpanBack: false
    })
  }

  _set_WarningModal_positive(){
    switch (this.state.warningType) {
      case 'submitting': //just close the warning modal and stay at same place
        this.setState({warningModal: false, warningType: null})
        break;
      case 'heigherTop': //confirm closing the modal
        this.setState((prevState, props)=>{return {warningModal: false, warningType: null};}, ()=>{
          this.props._close_theaterHeigher();
        })
        break;
      case 'close': //confirm closing the modal
        this.setState({close: true, warningModal: false, warningType: null})
        break;
      default:
        this.setState({warningModal: false, warningType: null})
    }
  }

  _set_WarningModal_negative(){
    switch (this.state.warningType) {
      case 'heigherTop':
        this.setState({warningModal: false, warningType: null})
        break;
      case 'close':
        this.setState({warningModal: false, warningType: null})
        break;
      default:
        this.setState({warningModal: false, warningType: null})
    }
  }

  _handleClick_heigherBack(){
    event.preventDefault();
    event.stopPropagation();
    if(this.props.unitSubmitting){this.setState({warningModal: "data is submitting, please hold on...", warningType: 'submitting'});return;};
    if(this.state.mode=='author_editing'){this.setState({warningModal: "modifications has not yet submitted, are you still going to close the it?", warningType: 'heigherTop'});return;};
    //only close if passed all above
    this.props._close_theaterHeigher();
  }

  _close_theater(){
    //handler deal with every intention to close(unmount) Theater
    if(this.props.unitSubmitting){this.setState({warningModal: "data is submitting, please hold on...", warningType: 'submitting'});return;};
    if(this.state.mode=='author_editing'){this.setState({warningModal: "modifications has not yet submitted, are you still going to close the it?", warningType: 'close'});return;};
    //only close if passed all above
    this.setState({close: true})
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    //due to update to unitId only still Redirect to a new URL
    //check again to re-define the URL
    if(!this.props.location.pathname.includes('explore/unit')) window.history.replaceState(this.props.location.state, '', '/cosmic/explore/unit?unitId='+this.unitId);
    //Note that, replaceState would also change the behavior of 'back' by browser, (only back to the new path)
    //we need to modify the behavior manually one day by 'popstate' iterate by the replaceState
  }

  componentDidMount(){
    //replace the URL display in the browser bar if not from independt page
    if(!this.props.location.pathname.includes('explore/unit')) window.history.replaceState(this.props.location.state, '', '/cosmic/explore/unit?unitId='+this.unitId);
    //Note that, replaceState would also change the behavior of 'back' by browser, (only back to the new path)
    //we need to modify the behavior manually one day by 'popstate' iterate by the replaceState
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    };
  }

  _render_UnitMode(){
    switch (this.state.mode) {
      case "author_editing":
        return (
          <UnitEditing
            mode={this.state.mode}
            _set_Modalmode={this._set_Modalmode}
            _refer_von_unit={this.props._refer_von_unit}
            _reset_UnitMount={this.props._reset_UnitMount}/>)
        break;

      case "viewer":
        return (
          <UnitModal
            mode={this.state.mode}
            initStatus={this.unitInit}
            _set_Modalmode={this._set_Modalmode}
            _close_theater={this._close_theater}
            _refer_von_unit={this.props._refer_von_unit}/>)
        break;
      default:
        return (
          <UnitModal
            mode={this.state.mode}
            initStatus={this.unitInit}
            _set_Modalmode={this._set_Modalmode}
            _close_theater={this._close_theater}
            _refer_von_unit={this.props._refer_von_unit}/>)
    }
  }

  render(){
    let params = new URLSearchParams(this.props.location.search); //we need value in URL query
    this.unitId = params.get('unitId');
    //restract unitId here agian(not from unitCurrent) just in case the unitCurrent still empty
    if(this.state.close){return <Redirect to={{
        pathname: this.props.location.pathname,
        search: '?unitId='+this.unitId,
        state: this.props.location.state //keep the state as props, perhaps need to increase 'current location' for 'back' use
      }}/>};


    return(
      <div>
        {this._render_UnitMode()}
        <div
          className={classnames(styles.boxBackTop)}
          onMouseEnter={this._handleEnter_spanBack}
          onMouseLeave={this._handleLeave_spanBack}>
          <span
            className={classnames(styles.spanBackTop)}
            style={this.state.onSpanBack?{color: '#F0F0F0'}:{}}
            onClick={this._handleClick_heigherBack}>
            {" ╳ "}
          </span>
        </div>

        {
          this.state.warningModal &&
          <WarningModal
            type={this.state.warningType}
            message={this.state.warningModal}
            _set_WarningModal_positive={this._set_WarningModal_positive}
            _set_WarningModal_negative={this._set_WarningModal_negative}/>
        }
      </div>
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

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Theater));
