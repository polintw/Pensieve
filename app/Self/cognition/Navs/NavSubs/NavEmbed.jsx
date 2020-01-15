import React from 'react';
import {
  Route,
  Link,
  withRouter,
  Switch
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import TitleBroads from '../../component/Titles/TitleBroads.jsx';
import TitleInspired from '../../component/Titles/TitleInspired.jsx';

class NavEmbed extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      mouseOn: false
    };
    this._handleEnter_Option = this._handleEnter_Option.bind(this);
    this._handleLeave_Option = this._handleLeave_Option.bind(this);
    this.style={

    }
  }

  _handleEnter_Option(e){
    this.setState({
      mouseOn: e.currentTarget.getAttribute('value')
    })
  }

  _handleLeave_Option(e){
    this.setState({
      mouseOn: ''
    })
  }

  render(){
    return(
      <div
        className={classnames(styles.comNavEmbed)}>
        <nav
          className={classnames(styles.boxNav)}>
          <Link
            to={this.props.match.url+"/inspireds"}
            value={'inspired'}
            className={classnames(
              'plainLinkButton',
              styles.boxLink,
              {[styles.boxLinkActive]: (this.state.mouseOn=='inspired')}
            )}
            onMouseEnter={this._handleEnter_Option}
            onMouseLeave={this._handleLeave_Option}>
            <span
              className={classnames(styles.spanText, styles.fontLink)}>
              {"Inspired"}</span>
          </Link>
          <Link
            to={this.props.match.url+"/broads"}
            value={'broads'}
            className={classnames(
              'plainLinkButton',
              styles.boxLink,
              {[styles.boxLinkActive]: (this.state.mouseOn=='broads')}
            )}
            onMouseEnter={this._handleEnter_Option}
            onMouseLeave={this._handleLeave_Option}>
            <span
              className={classnames(styles.spanText, styles.fontLink)}>
              {"Broaded"}</span>
          </Link>
        </nav>
        <div style={{width: '100%', borderBottom: 'solid 1px #a8a8a8', margin: '0.54rem 0 1.56rem'}}/>
        <div
          className={classnames(styles.boxTitle)}>
          <Switch>
            <Route path={this.props.match.path+"/inspireds"} render={(props)=> <TitleInspired {...props}/>}/>
            <Route path={this.props.match.path+"/broads"} render={(props)=> <TitleBroads {...props}/>}/>
          </Switch>
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

export default withRouter(connect(
  mapStateToProps,
  null
)(NavEmbed));
