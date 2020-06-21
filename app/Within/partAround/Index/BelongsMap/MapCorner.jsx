import React from 'react';
import {
  Link,
  withRouter,
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import stylesFont from '../../stylesFont.module.css';
import {
  _axios_GET_usersCount
} from '../../../utils.js';
import SvgPin from '../../../../Components/Svg/SvgPin.jsx';

class MapCorner extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      usersCount: null
    };
    this.axiosSource = axios.CancelToken.source();
    this._set_usersCount = this._set_usersCount.bind(this);
    this._render_nodeLink = this._render_nodeLink.bind(this);
  }

  _set_usersCount(){
    const self = this;
    this.setState({axios: true});
    let queryObj={
      limitCorner: this.props.typeNodeId,
      countCat: [this.props.typeReverse]
    };

    _axios_GET_usersCount(
      this.axiosSource.cancelToken,
      this.props.nodeId,
      queryObj
    )
    .then((resObj) => {
      self.setState((prevState, props)=>{
        return {
          axios: false,
          usersCount: resObj.main.countsByTypes[this.props.typeReverse] //the count going to display is the one reverse to the 'view tab type'
        }
      });
    }).catch(function (thrown) {
      self.setState({axios: false});
      if (axios.isCancel(thrown)) {
        cancelErr(thrown);
      } else {
        let message = uncertainErr(thrown);
        if(message) alert(message);
      }
    });
  }


  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {
    this._set_usersCount();
  }

  componentWillUnmount() {

  }

  _render_nodeLink(){
    const nodeId = this.props.nodeId;

    return (
      <div
        className={classnames( styles.boxNode)}>
        <span
          className={classnames(
            styles.spanNode,
            stylesFont.fontNodesTitle,
            stylesFont.colorEditBlack
          )}>
          {nodeId in this.props.nounsBasic ? (
            this.props.nounsBasic[nodeId].name) : (
              null
            )}
        </span>
      </div>
    )
  }

  render(){

    return(
      <div
        className={classnames(styles.comMapCorner)}>
        <div
          className={classnames(styles.boxMapCount)}>
          <div
            className={classnames(styles.boxNodePin)}>
            <div
              style={{width: "30px", height: "45px"}}>
              <SvgPin
                mouseOn={false}/>
            </div>
          </div>
          <div
            className={classnames(styles.boxMapCountNum)}>
            <span
              className={classnames(styles.spanMapCount, 'fontTitleHuge', 'weightBold', 'colorDescripBlack')}>
              {this.state.usersCount}
            </span>
          </div>
        </div>
        <div
          className={classnames(styles.boxStatics)}>
          <div
            className={classnames(styles.boxNodeSub)}>
            <span className={classnames(styles.spanNodeSub, 'fontContent', 'colorEditLightBlack')}>
              {
                (this.props.currentType =="homeland") ?
                this.props.i18nUIString.catalog["category__Belong_usersCount"][0] :
                this.props.i18nUIString.catalog["category__Belong_usersCount"][1]
              }
            </span>
          </div>
          {this._render_nodeLink()}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
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
)(MapCorner));
