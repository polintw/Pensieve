import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import {SvgArrowToTop} from '../../../../Components/Svg/SvgArrow.jsx';
import SvgFilterNode from '../../../../Components/Svg/SvgFilter_Node.jsx';
import SvgArrowStick from '../../../../Components/Svg/SvgArrowStick.jsx';

class Nav extends React.Component {
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
      <div className={styles.comNav}>
        <div
          className={classnames(styles.boxTitle, styles.boxProjectInfo)}>
          <span
            className={classnames(
              "fontContentPlain", "weightBold", "colorAssistGold")}>
              { this.props.i18nUIString.catalog["title_NavAtNode_"] }
            </span>
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
)(Nav));
