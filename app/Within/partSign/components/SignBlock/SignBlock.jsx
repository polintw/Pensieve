import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";

class SignBlock extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
  }

  render(){
    return(
      <div
        className={classnames( styles.comSignBlock)}>
        <div>
          <span
            className={classnames( 'fontSubtitle', 'colorDescripBlack')}>
            {this.props.i18nUIString.catalog['submit_nav_Signupin']}
          </span>
        </div>
        <Link
          className={classnames( 'plainLinkButton')}
          to={'/'}>
          <span
            className={classnames( 'fontSubtitle', 'colorDescripBlack')}>
            {this.props.i18nUIString.catalog['submit_nav_Signupin']}
          </span>
        </Link>
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
)(SignBlock));
