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

const commonStyle={
  spanButtonNavEmbed: {
    fontSize: '1.4rem',
    fontWeight: '300',
    letterSpacing: '0.1rem'
  }
}

class NavEmbed extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      selfCom_CogEmbed_nav_: {
        width: '20vw',
        boxSizing: 'border-box',
      },
      selfCom_CogEmbed_nav_span_: {
        display: 'inline-block',
        width: '27%',
        position: 'relative',
        boxSizing: 'border-box',
        margin: '0 3%',
        cursor: 'pointer'
      },
    }
  }

  render(){
    return(
      <div
        className={classnames(styles.comNavEmbed)}>
        <nav
          style={this.style.selfCom_CogEmbed_nav_}>
          <Link
            to={this.props.match.url+"/inspireds"}
            className={'plainLinkButton'}>
            <span
              style={Object.assign({}, commonStyle.spanButtonNavEmbed, this.style.selfCom_CogEmbed_nav_span_)}>
              {"inpired"}</span>
          </Link>
          <Link
            to={this.props.match.url+"/broads"}
            className={'plainLinkButton'}>
            <span
              style={Object.assign({}, commonStyle.spanButtonNavEmbed, this.style.selfCom_CogEmbed_nav_span_)}>
              {"Broad"}</span>
          </Link>
          <span
            style={Object.assign({}, commonStyle.spanButtonNavEmbed, this.style.selfCom_CogEmbed_nav_span_)}>
            {"dialogues"}</span>
        </nav>
        <div style={{width: '100%', borderBottom: 'solid 1px #a8a8a8', margin: '1rem 0 1.54rem'}}/>
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
