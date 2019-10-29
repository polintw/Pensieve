import React from 'react';
import {
  Link,
  Redirect,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";

class Terms extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.refScroll = React.createRef();
    this.style={

    }
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
        className={styles.comTerms}>
        <div
          ref={this.refScroll}
          className={styles.boxScroll}>


          <div
            className={styles.boxFooter}/>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Terms));
