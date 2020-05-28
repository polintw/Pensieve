import React from 'react';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import stylesFont from '../../stylesFont.module.css';

class SignupSuccess extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      SignupSuccess_: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        width: '100%',
        boxSizing: 'border-box',
        paddingTop: "12vh",
        marginBottom: "7.6vh"
      }
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    return(
      <div
        style={this.style.SignupSuccess_}>
        <div>
          <span
            className={classnames(stylesFont.fontTitle, stylesFont.colorStandard)}>
            {this.props.i18nUIString.catalog["title_Signup_Success"]}
          </span>
        </div>
        <div
          className={classnames(stylesFont.fontContent, stylesFont.colorSignBlack)}>
          <p>{this.props.i18nUIString.catalog["guidingSign_Signup_Success"][0]}</p>
          <p>{this.props.i18nUIString.catalog["guidingSign_Signup_Success"][1]}</p>
        </div>
      </div>
    )
  }
}


const mapStateToProps = (state)=>{
  return {
    i18nUIString: state.i18nUIString,
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {

  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignupSuccess);
