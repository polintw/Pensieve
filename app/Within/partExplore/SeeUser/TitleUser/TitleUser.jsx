import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import AccountPalette from '../../../../Components/AccountPalette.jsx';
import {
  domain
} from '../../../../../config/services.js';

class TitleUser extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  render(){
    return (
      <div className={styles.comTitleUser}>
        <Link
          to={'/cosmic/explore/user?userId=' + this.props.userId }
          className={classnames('plainLinkButton', styles.linkTitleText)}>
          <AccountPalette
            size={"regularBold"}
            referLink={ false }
            styleFirst={{fontSize: '2.4rem'}}
            styleLast={{fontSize: '2.4rem'}}
            userId={this.props.userId}
            authorIdentity={"user"} />
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
)(TitleUser));
