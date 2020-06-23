import React from 'react';
import {
  Link,
  withRouter,
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import {
  _axios_GET_usersCount
} from '../../../utils.js';

const _set_usersCount = (comp)=>{
  comp.setState({axios: true});

  _axios_GET_usersCount(
    comp.axiosSource.cancelToken,
    comp.props.nodeId,
    {countCat: ["homeland", "residence"]}
  )
  .then((resObj)=>{
    comp.setState((prevState, props)=>{
      let returnState = {
        axis: false,
        usersFrom: resObj.main.countsByTypes["homeland"],
        usersLive: resObj.main.countsByTypes["residence"]
      };
      return returnState;
    });
  })
  .catch((thrown)=>{
    comp.setState({axios: false});
    if (axios.isCancel(thrown)) {
      cancelErr(thrown);
    } else {
      let message = uncertainErr(thrown);
      if(message) alert(message);
    };
  })
}


class NodeUsers extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      usersLive: null,
      usersFrom: null
    };
    this.axiosSource = axios.CancelToken.source();
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {
    _set_usersCount(this);
  }

  componentWillUnmount() {

  }

  render(){
    return(
      <div
        className={classnames(styles.comNodeUsers)}>
        <div
          className={classnames(styles.boxSet)}>
          <div>
            <span
              className={classnames("fontTitle", "colorEditBlack", "weightBold")}>
              {this.state.usersLive}
            </span>
          </div>
          <div>
            <span className={classnames('fontContent', 'colorEditLightBlack')}>
              {this.props.i18nUIString.catalog["subtitle_NavAtNode_Num"][0]}
            </span>
          </div>
        </div>
        <div
          className={classnames(styles.boxSet)}>
          <div>
            <span
              className={classnames("fontTitle", "colorEditBlack", "weightBold")}>
              {this.state.usersFrom}
            </span>
          </div>
          <div>
            <span className={classnames('fontContent', 'colorEditLightBlack')}>
              {this.props.i18nUIString.catalog["subtitle_NavAtNode_Num"][1]}
            </span>
          </div>
        </div>

      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    i18nUIString: state.i18nUIString,
    nounsBasic: state.nounsBasic,
    belongsByType: state.belongsByType
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(NodeUsers));
