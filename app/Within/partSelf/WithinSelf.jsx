import React from 'react';
import {
  Switch,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import SharedWrapper from './Shared/Wrapper.jsx';

class Self extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      withinCom_Around_: {
        maxWidth: '99vw',
        boxSizing: 'border-box'
      },
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    return(
      <div
        style={this.style.withinCom_Around_}>
        <div
          className={classnames(styles.boxRow, styles.boxRowTop)}
          style={{margin: '4px 0'}}>
          <span
            className={classnames("fontContentPlain", "weightBold", "colorAssistGold")}
            style={{marginBottom: '12px', width: '100%', display: 'block'}}>
            {this.props.i18nUIString.catalog["title_Publications"]}</span>
        </div>
        <Route path={this.props.match.path+'/shareds'} render={(props)=> <SharedWrapper {...props} {...this.props}/>}/>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    tokenStatus: state.token,
    userInfo: state.userInfo,
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
)(Self));
