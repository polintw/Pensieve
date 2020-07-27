import React from 'react';
import {
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
//import styles from './styles.module.css';
import SvgBulb from '../../../Components/Svg/SvgBulb.jsx';

class Inspired extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      inspired: false
    };
    this._handleEnter_Submit = this._handleEnter_Submit.bind(this);
    this._handleLeave_Submit = this._handleLeave_Submit.bind(this);
    this._handleClick_UnitRespond = this._handleClick_UnitRespond.bind(this);
  }

  _handleClick_UnitRespond(event) {
    event.preventDefault();
    event.stopPropagation();

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
        <SvgBulb
          bulbPattern={this.state.inspired ? 'bulbDelight': 'bulbDark'}/>
      </div>
    )
  }

  _handleEnter_Submit(e){
    this.setState({

    })
  }

  _handleLeave_Submit(e){
    this.setState({

    })
  }

}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    unitCurrent: state.unitCurrent,
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Inspired));
