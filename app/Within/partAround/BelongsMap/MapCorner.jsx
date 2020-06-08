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

class MapCorner extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onNode: false,
      usersCount: null
    };
    this.axiosSource = axios.CancelToken.source();
    this._set_usersCount = this._set_usersCount.bind(this);
    this._render_statics = this._render_statics.bind(this);
    this._render_nodeLink = this._render_nodeLink.bind(this);
    this._handleMouseOn_Node = ()=> this.setState((prevState,props)=>{return {onNode: prevState.onNode?false:true}});
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

  _render_statics(){
    return (
      <div>
        <span
          style={{display: 'block'}}>
          {this.props.i18nUIString.catalog["category__Belong_usersCount"][0]}
          {this.props.i18nUIString.catalog["category__Belong_usersCount"][1]}
        </span>
        <span>
          {this.state.usersCount}
        </span>
      </div>
    )
  }

  render(){

    return(
      <div
        className={classnames(styles.comMapCorner)}>
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
)(MapCorner));
