import React from 'react';
import {
  Route,
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import stylesMain from "../styles.module.css"; //Notice, we use shared css file here for easier control
import Wish from './components/Wish.jsx';
import Willing from './components/Willing.jsx';
import Belongs from '../Belongs/Belongs.jsx';

class Wrapper extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      display: 0,
      onSideControl: null
    };
    this._render_panel = this._render_panel.bind(this);
    this._handleClick_set_display = this._handleClick_set_display.bind(this);
    this._handleMouseOn_SideControl = this._handleMouseOn_SideControl.bind(this);
    this.style={

    }
  }

  _handleMouseOn_SideControl(event){
    let side = event.currentTarget.getAttribute('side');
    this.setState({onSideControl: !!this.state.onSideControl ? null : side});
  }

  _handleClick_set_display(e){
    e.stopPropagation();
    e.preventDefault();
    //distinguish which one clicked
    let sideDelta = (e.currentTarget.getAttribute('side') == 'left') ? (-1) : 1;
    this.setState((prevState, props)=>{
      let nextDisplay = prevState.display + sideDelta;
      //no change if already at the boundry
      if(nextDisplay < 0 || nextDisplay> 2) nextDisplay = prevState.display;

      return {
        display: nextDisplay
      };
    })
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  _render_panel(){
    switch (this.state.display) {
      case 0:
        return (
          <Wish/>
        )
        break;
      case 1:
        return (
          <Willing/>
        )
        break;
      case 2:
        return (
          <Belongs
            _refer_von_cosmic={this.props._refer_von_cosmic}/>
        )
        break;
      default:
        return
    }
  }

  render(){
    return(
      <div
        className={classnames(styles.wrapperMatchSet)}>
        {this._render_panel()}
        <div
          side={'left'}
          className={classnames(
            styles.boxSideControl,
            {[styles.boxActSideontrol]: (this.state.onSideControl == 'left')}
          )}
          style={{left: '0', fontSize:'1.37rem'}}
          onMouseEnter={this._handleMouseOn_SideControl}
          onMouseLeave={this._handleMouseOn_SideControl}
          onClick={this._handleClick_set_display}>{"〈"}</div>
        <div
          side={'right'}
          className={classnames(
            styles.boxSideControl,
            {[styles.boxActSideontrol]: (this.state.onSideControl == 'right')}
          )}
          style={{right: '0', fontSize:'1.37rem'}}
          onMouseEnter={this._handleMouseOn_SideControl}
          onMouseLeave={this._handleMouseOn_SideControl}
          onClick={this._handleClick_set_display}>{"〉"}</div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
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
)(Wrapper));
