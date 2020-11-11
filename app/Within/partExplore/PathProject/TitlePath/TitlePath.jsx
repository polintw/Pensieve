import React from 'react';
import {
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import LinkCopy from '../../../../Components/LinkCopy/LinkCopy.jsx';

class TitlePath extends React.Component {
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
      <div className={styles.comTitlePath}>
        <div className={classnames(styles.boxTitleText)}>
          <span
            className={classnames( "fontTitle", "lineHeight15", "colorEditBlack", "weightBold")}>
            {this.props.title}
          </span>
        </div>
        <div
          className={classnames(styles.boxBtnShare)}>

        </div>
      </div>
    )
  }

}


const mapStateToProps = (state)=>{
  return {
    tokenStatus: state.token,
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    nounsBasic: state.nounsBasic
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(TitlePath));
