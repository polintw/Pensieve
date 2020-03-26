import React from 'react';
import {
  Route,
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import SigninForm from '../../Sign/component/Signin/SigninForm/SigninForm.jsx';

class WithinSign extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      steps: 'signin'
    };
    this._switch_Sign = this._switch_Sign.bind(this);
    this._render_signInDialog = this._render_signInDialog.bind(this);
  }

  _switch_Sign(aim){
    switch (aim) {
      case 'toSignUp':
        this.setState({steps: 'signup'})
        break;
      default:
        null
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  _render_signInDialog(){
    switch (this.state.steps) {
      case 'signin':
        return (
          <div>
            <SigninForm
              {...this.props}
              _switch_Sign={this._switch_Sign}/>
          </div>
        )
        break;
      case 'signup':

        break;
      default:
        return
    }
  }

  render(){
    return(
      <div
        className={styles.comWithinSign}>
        {this._render_signInDialog()}

      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo
  }
}

export default withRouter(connect(
  mapStateToProps,
  null
)(WithinSign));
