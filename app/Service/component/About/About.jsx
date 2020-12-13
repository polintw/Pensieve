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
  domain
} = require('../../../../config/services.js');

class About extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.refCom = React.createRef();
    this._render_text = this._render_text.bind(this);
    this._render_contibutors = this._render_contibutors.bind(this);
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

  _render_contibutors(){
    let textDOM = this.props.i18nUIString.catalog["text_contributors"].map((section, index)=>{
      let paragraphDOM = section.map((text, indexSec)=>{
        return (
          <div
            key={"key_text_section_contributors_"+ index+ "_paragraph_"+indexSec}>
            {text}</div>
        )
      });

      return (
        <section
          key={"key_textSection_contributiors_"+ index}
          style={{fontSize: '1.6rem', padding: '5% 0'}}>
          {paragraphDOM}
        </section>
      )
    });

    return textDOM;
  }

  _render_text(){
    let textDOM = this.props.i18nUIString.catalog["text_about"].map((section, index)=>{
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

    return textDOM;
  }

  render(){
    return(
      <div
        ref={this.refCom}
        className={styles.comAbout}>
        <div
          className={classnames(styles.boxScroll, styles.fontScroll)}>
          <h2>{"About us"}</h2>
          {this._render_text()}
          <section>
            <img
              src={'http://' +domain.name + '/png/illu_About_Map.png'}
              style={{height:"auto", width:" 100%", boxSizing: "border-box", padding: "5%"}}/>
          </section>
          {this._render_contibutors()}
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
)(About));
