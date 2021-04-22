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
import SubcateBtnNext from './SubcateBtnNext.jsx';
import VisitRegister from '../Theater/components/VisitRegister/VisitRegister.jsx';

class EntityOnSubcate extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  render(){
    return(
      <div
        className={classnames(styles.comEntitySubcate)}>
        <div
          className={classnames(styles.boxVisitRegister)}>
          <VisitRegister
            {...this.props}/>
        </div>
        <div>
          <SubcateBtnNext
            {...this.props}/>
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

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(EntityOnSubcate));
