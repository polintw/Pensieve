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
import NavOptionsUnsign from '../Components/NavOptions/NavOptionsUnsign.jsx';

class Within_Sign extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._refer_von_Sign = this._refer_von_Sign.bind(this);
    this.style={
      Within_Around_backplane:{
        width: '100%',
        height: '100%',
        position: 'fixed',
        backgroundColor: '#FCFCFC'
      },
    }
  }

  _refer_von_Sign(identifier, route){
    window.location.assign(route)
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
          <Switch>
            <Route path="/cosmic/explore/unit" render={(props)=> UnsignWithinCosmic(props, this) }/>
            <Route path="/" render={(props)=> UnsignWithin(props, this) }/>
          </Switch>
        </div>

      </div>
    )
  }

}

const UnsignWithinCosmic = ( routeProps, parent) => {
  // this component need to follow the style of Within_Cosmic,
  // but the 'main controller' was different
  return (
    <div>
      <div
        className={classnames(styles.boxNavOptionsCosmic)}>
        <NavOptionsUnsign {...routeProps} _refer_to={parent._refer_von_Sign}/>
      </div>
      <div
        className={classnames(styles.boxAroundContent)}>
        <div
          className={classnames(
            styles.boxContentFilledLeft)} />
        <div
          className={classnames(styles.boxAroundContentCenter)}>
          <Switch>
            <Route render={(props)=> null}/>

          </Switch>
        </div>
        <div
          className={classnames(
            styles.boxContentFilledRight)} />
      </div>
      <div
        className={classnames(styles.boxNavWithinCosmic)}>
        <NavWithin {...routeProps} _refer_to={()=>{window.location.assign('/')}}/>
      </div>
    </div>
  )
}

const UnsignWithin = ( routeProps, parent) => {
  return (
    <div>
      <div
        className={classnames(styles.boxNavOptions)}>
        <NavOptionsUnsign {...routeProps} _refer_to={parent._refer_von_Sign}/>
      </div>
      <div
        className={styles.boxWithinSign}>
        <WithinSign {...routeProps}/>
      </div>
      <div
        className={classnames(styles.boxNavAround)}>
        <NavWithin {...routeProps} _refer_to={()=>{window.location.assign('/')}}/>
      </div>
    </div>
  )
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
