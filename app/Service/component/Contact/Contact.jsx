import React from 'react';
import {
  Link,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
const {
  domain,
  email,
  outside
} = require('../../../../config/services.js');

class Contact extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.refCom = React.createRef();
    this._render_text = this._render_text.bind(this);
  }


  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){
    if (this.refCom.scrollTop != 0) {
      window.scrollTo(0, 0)
    }
  }

  componentWillUnmount(){

  }

  _render_text(){
    let textDOM = this.props.i18nUIString.catalog["text_Contact"].map((section, index)=>{
      let paragraphDOM = section.map((text, indexSec)=>{
        return (
          <p
            key={"key_text_section_"+ index+ "_paragraph_"+indexSec}>
            {text}</p>
        )
      });

      return (
        <section
          key={"key_textSection_"+ index}>
          {paragraphDOM}
        </section>
      )
    });
    let emailDOM = (
      <section
        key={"key_textSection_email"}>
        <ul style={{listStyle: 'none'}}>
          <li style={{color: 'rgb(69, 135, 160)'}}>
            {email.userContact}
          </li>
        </ul>
      </section>
    )
    let facebookDOM = (
      <section
        key={"key_textSection_pinterest"}>
        <ul style={{listStyle: 'none'}}>
          <a
            href={outside.facebookTW}
            target={"_blank"}
            style={{color: 'rgb(69, 135, 160)'}}>
            {"Cornerth.TW on Facebook"}
          </a>
        </ul>
      </section>
    )
    textDOM.splice(1, 0, emailDOM);
    textDOM.splice(4, 0, facebookDOM);

    return textDOM;
  }

  render(){
    return(
      <div
        ref={this.refCom}
        className={styles.comContact}>
        <div
          className={classnames(styles.boxScroll, styles.fontScroll)}>
          <h2>{"Contact us"}</h2>
          {this._render_text()}
          <div
            className={styles.boxFooter}/>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Contact));
