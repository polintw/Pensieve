import React from 'react';
import {
  Link,
  Switch,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import classnames from 'classnames';
import styles from "./styles.module.css";
import {

} from './axios.js';
import {
  cancelErr,
  uncertainErr
} from '../../../../utils/errHandlers.js';
import {
  outside
} from '../../../../../config/services.js'

class VisitRegister extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,

    };
    this.axiosSource = axios.CancelToken.source();

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
        {
          this.state.modalListify ? (

          ): (
            <div>

            </div>
          )
        }
      </div>
    )
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
)(ModalList));
