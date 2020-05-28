import React from 'react';
import {
  Route,
  Switch,
  withRouter,
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import WithinSign from './partSign/WithinSign.jsx';
import NavWithin from '../Components/NavWithin/NavWithin.jsx';
import NavOptions from '../Components/NavOptions/NavOptions.jsx';

class Within_Sign extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      Within_Around_backplane:{
        width: '100%',
        height: '100%',
        position: 'fixed',
        backgroundColor: '#FCFCFC'
      },
    }
  }


  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    return(
      <div>
        <div style={this.style.Within_Around_backplane}></div>
        <div
          className={classnames(styles.comWithinSign)}>
          <div
            className={classnames(styles.boxNavOptions)}>
            <NavOptions {...this.props} _refer_to={()=>{}}/>
          </div>
          <div
            className={styles.boxWithinSign}>
            <WithinSign {...this.props}/>
          </div>


          <div
            className={classnames(styles.boxNavAround)}>
            <NavWithin {...this.props} _refer_to={()=>{window.location.assign('/')}}/>
          </div>
        </div>

      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {

  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Within_Sign));
