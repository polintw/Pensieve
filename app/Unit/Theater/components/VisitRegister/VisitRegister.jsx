import React from 'react';
import {
  Link,
  Switch,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import ModalList from './ModalList.jsx';
import {

} from './axios.js';
import {
  cancelErr,
  uncertainErr
} from '../../../../utils/errHandlers.js';

class VisitRegister extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      modalListify: false
    };
    this.axiosSource = axios.CancelToken.source();
    this._handleClick_Register = this._handleClick_Register.bind(this);
    this._handleEnter_btnNext = this._handleEnter_btnNext.bind(this);
    this._handleLeave_btnNext = this._handleLeave_btnNext.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){

  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    return(
      <div>
        <div
          onClick={this._handleClick_Register}>
          {"Name on the wall"}
        </div>
        {
          this.state.modalListify &&
          <ModalList/>
        }
      </div>
    )
  }

  _handleClick_Register(event){
    event.preventDefault();
    event.stopPropagation();
    this.setState({
      modalListify: true
    });
  }

  _handleEnter_btnNext(e){
    this.setState({onbtnNext: true})
  }

  _handleLeave_btnNext(e){
    this.setState({onbtnNext: false})
  }

}


const mapStateToProps = (state)=>{
  return {
    tokenStatus: state.token,
    i18nUIString: state.i18nUIString,
    unitCurrent: state.unitCurrent,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(VisitRegister));
