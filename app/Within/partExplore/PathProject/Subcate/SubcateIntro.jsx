import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import TitleSubcate from './TitleSubcate.jsx';

class SubcateIntro extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      overBtnSubcate: false
    };
    this._handleOut_btn = this._handleOut_btn.bind(this);
    this._handleOver_btn = this._handleOver_btn.bind(this);
    this._render_subcates = this._render_subcates.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }


  render(){
    return (
      <div
        className={classnames(styles.comSubcatesList)}>

        <div
          className={classnames(styles.boxTitleSubcate)}>
          <TitleSubcate
            {...this.props}/>
        </div>
      </div>
    )
  }

  _handleOver_btn(event) {
    let subCateId = event.currentTarget.getAttribute('subcateid');
    this.setState({ overBtnSubcate: subCateId })
  }

  _handleOut_btn(event) {
    this.setState({ overBtnSubcate: false })
  }
}


const mapStateToProps = (state)=>{
  return {
    tokenStatus: state.token,
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
)(SubcateIntro));
