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
    this._render_type = this._render_type.bind(this);
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
      <Link
        to={"/cosmic/nodes/"+nodeId}
        className={classnames('plainLinkButton', styles.boxNode)}
        onMouseEnter={this._handleMouseOn_Node}
        onMouseLeave={this._handleMouseOn_Node}>
        <div
          className={classnames(styles.spanNode)}
          style={{fontSize: '1.7rem'}}>
          {
            this.state.onNode &&
            <span style={{
                width: '74%', position: 'absolute', bottom: '10%', left: '5%',
                borderBottom: 'solid 1px #ff7a5f'
              }}/>
          }
          {nodeId in this.props.nounsBasic ? (
            this.props.nounsBasic[nodeId].name) : (
              null
            )}
          </div>
        </Link>
    )
  }

  _render_type(){
    return (
      <div
        title={this.props.i18nUIString.catalog["descript_BelongTypeInteract"][0]+this.props.type+this.props.i18nUIString.catalog["descript_BelongTypeInteract"][1]}
        className={classnames(styles.boxTitleType)}>
        <span
          className={classnames(styles.spanType)}
          style={{lineHeight: '3rem'}}>
          {this.props.type}</span>
      </div>
    )
  }

  _render_statics(){
    return (
      <div>
        <span
          style={{display: 'block'}}>
          {this.props.i18nUIString.catalog["category__Belong_usersCount"][0]}
          {this.props.i18nUIString.catalog["category__Belong_usersCount"][1]}
        </span>
        <span
          style={{fontSize: '1.7rem'}}>
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
          className={classnames(styles.boxCategory)}>
          {this._render_type()}
        </div>
        <div
          className={classnames(styles.boxCornerTitle)}>
          {this._render_nodeLink()}
        </div>
        <div
          className={classnames(styles.boxStatics)}>
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
