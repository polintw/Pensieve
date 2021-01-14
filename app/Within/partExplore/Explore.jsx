import React from 'react';
import {
  Route,
  Switch,
  withRouter,
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import AtNode from './AtNode/Wrapper.jsx';
import SeeUser from './SeeUser/Wrapper.jsx';
import PathProject from './PathProject/Wrapper.jsx';
import UnitExplore from '../../Unit/UnitExplore/UnitExplore.jsx';

class Explore extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={

    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    return(
      <div
        className={styles.comExplore}>
        <Switch>
          <Route path={this.props.match.path+"/node"} render={(props)=> <AtNode {...props} _refer_to={this.props._refer_von_cosmic}/>}/>
          <Route path={this.props.match.path+"/user"} render={(props)=> <SeeUser {...props} _refer_to={this.props._refer_von_cosmic}/>}/>
          <Route path={this.props.match.path+"/path/:pathName"} render={(props)=> <PathProject {...props} _refer_to={this.props._refer_von_cosmic}/>}/>

          <Route path={this.props.match.path+"/unit"} render={(props)=> <UnitExplore {...props} _refer_von_unit={this.props._refer_von_cosmic}/>}/>
        </Switch>
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
)(Explore));
