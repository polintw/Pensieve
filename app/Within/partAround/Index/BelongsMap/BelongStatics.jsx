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
} from './utils.js';


class BelongStatics extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      onNode: false,
      infoCount: {totalUserCount: null},
    };
    this.axiosSource = axios.CancelToken.source();
    this._set_infoCount = this._set_infoCount.bind(this);
    this._render_statics = this._render_statics.bind(this);
    this._render_nodeLink = this._render_nodeLink.bind(this);
    this._handleMouseOn_Node = ()=> this.setState((prevState,props)=>{return {onNode: prevState.onNode?false:true}});
  }

  _set_infoCount(){
    const self = this;
    this.setState({
      axios: true,
      infoCount: {} //going to renew, so we refresh the render first
    });
    let queryObj = {countCat: this.props.type}; //get count by current map type

    _axios_GET_usersCount(
      this.axiosSource.cancelToken,
      this.props.belongsByType[this.props.type],
      queryObj
    ) //it req the total num registered to this corner
    .then((resObj) => {
      self.setState((prevState, props)=>{
        return {
          axios: false,
          infoCount: Object.assign({}, prevState.infoCount, {totalUserCount: resObj.main.countsByTypes[self.props.type]})
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
    if(prevProps.belongsByType[this.props.type] != this.props.belongsByType[this.props.type]){ //the node was edit and different
      this._set_infoCount();
    };
    if(prevProps.type != this.props.type){ //the comp would not render when jumping by Nav, have to manual trigger
      this._set_infoCount();
    };
  }

  componentDidMount() {
    this._set_infoCount();
  }

  componentWillUnmount() {

  }

  _render_nodeLink(){
    //determine the id of current node
    const nodeId = this.props.belongsByType[this.props.type];

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

  _render_statics(){
    return (
      <div
        className={classnames(styles.boxBelongStatSubtitle, 'fontContent', 'colorEditLightBlack')}>
        <span>
          {this.props.i18nUIString.catalog["category__Belong_usersCount"][0]}
          {this.props.i18nUIString.catalog["category__Belong_usersCount"][1]}
        </span>
        <span className={styles.spanBelongStatCount}>
          {this.state.infoCount.totalUserCount}
        </span>
      </div>
    )
  }

  render(){

    return(
      <div
        className={classnames(styles.comBelongStatics)}>
        <div
          className={classnames(styles.boxStaticsDescript)}>
          <span
            className={classnames('colorStandard', 'fontContentPlain')}>
            { this.props.i18nUIString.catalog["link_BelongsMap_Nav"][(this.props.type =="residence") ? 2 : 1] }
          </span>
        </div>
        <div
          className={classnames(styles.boxCornerTitle)}>
          {this._render_nodeLink()}
          {this._render_statics()}
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
)(BelongStatics));
