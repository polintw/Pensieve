import React from 'react';
import {
  Link,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import {
  /*
  import api req module here
  */
} from '../axios.js';
import {
  handleNounsList,
} from "../../../../redux/actions/general.js";
import {
  cancelErr,
  uncertainErr
} from '../../../../utils/errHandlers.js';

class PeopleList extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,

    };
    this.axiosSource = axios.CancelToken.source();

  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  render(){
    return(
      /*
      put the HTML part here
      */
    )
  }

}


const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    nounsBasic: state.nounsBasic
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_NounsList_new: (arr) => { dispatch(handleNounsList(arr)); },
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(PeopleList));
