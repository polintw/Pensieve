import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import SvgFilterNode from '../../../../Components/Svg/SvgFilter_Node.jsx';

class NavBtnRow extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      onFilterNode: false,
    };
    this._handleLeave_FilterNode = this._handleLeave_FilterNode.bind(this);
    this._handleEnter_FilterNode = this._handleEnter_FilterNode.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  render(){
    let toSearch = new URLSearchParams(this.props.location.search); //we need value in URL query
    // Notice! Currently this component was special and only for Subcate/SubcateIntro
    toSearch.append("_filter_map", true);
    let filterLinkObj = {
      pathname: this.props.location.pathname,
      search: toSearch.toString(),
      state: {from: this.props.location}
    };

    return (
      <div className={styles.comNavBtnRow}>
        <div
          className={classnames(styles.boxFilter)}>
          <div
            className={classnames(styles.boxIconsFilter)}>
            <Link
              to={filterLinkObj}
              className={classnames('plainLinkButton', styles.boxIconFilterNode)}
              onTouchStart={this._handleEnter_FilterNode}
              onTouchEnd={this._handleLeave_FilterNode}
              onMouseEnter={this._handleEnter_FilterNode}
              onMouseLeave={this._handleLeave_FilterNode}>
              <SvgFilterNode
                customstyle={this.state.onFilterNode ? "{fill: #ff8168;}" : "{fill: rgb(69, 135, 160);}"} />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  _handleEnter_FilterNode(e){
    this.setState((prevState, props)=>{
      return {
        onFilterNode: true
      }
    })
  }

  _handleLeave_FilterNode(e){
    this.setState((prevState, props)=>{
      return {
        onFilterNode: false
      }
    })
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
)(NavBtnRow));
