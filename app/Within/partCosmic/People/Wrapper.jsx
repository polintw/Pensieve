import React from 'react';
import {
  Link,
  Switch,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import NavTitle from './NavTitle/NavTitle.jsx';
import NodesMap from './NodesMap/NodesMap.jsx';
import NavCosmicMobile from '../../../Components/NavWithin/NavCosmic/NavCosmicMobile.jsx';
import {
  handleNounsList,
} from "../../../redux/actions/general.js";
import {
  cancelErr,
  uncertainErr
} from '../../../utils/errHandlers.js';

class Wrapper extends React.Component {
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
    return(
      <div>
        <div
          className={classnames("smallDisplayBox")}>
          <div
            className={classnames(styles.boxNavTop)}>
            <NavCosmicMobile/>
          </div>
        </div>
        <div
          className={classnames(styles.comNodes)}>
          <div
            className={classnames(styles.boxRow)}>
            <NavTitle {...this.props}/>
          </div>
          <div
            className={classnames(
              styles.boxRow)}>
              <div
                className={classnames(
                  styles.boxNodesMap)}>
                  <NodesMap/>
              </div>
          </div>
          <div className={classnames(styles.boxDecoBottom, "smallDisplayNone")}></div>
        </div>
      </div>
    )
  }

}


const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    nounsBasic: state.nounsBasic
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_NounsList_new: (arr) => { dispatch(handleNounsList(arr)); },
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Wrapper));
