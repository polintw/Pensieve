import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import SvgFilterNode from '../Svg/SvgFilter_Node.jsx';
import SvgArrowStick from '../Svg/SvgArrowStick.jsx';

class NavBtnRow extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      onFilterNode: false,
    };
    this._handleClick_filter = this._handleClick_filter.bind(this);
    this._handleLeave_FilterNode = this._handleLeave_FilterNode.bind(this);
    this._handleEnter_FilterNode = this._handleEnter_FilterNode.bind(this);
    this._handleClick_filterClose = this._handleClick_filterClose.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  render(){
    let urlParams = new URLSearchParams(this.props.location.search); //we need value in URL query

    return (
      <div className={styles.comNavBtnRow}>
        <div
          className={classnames(styles.boxFilter)}>
          {
            this.props.viewFilter &&
            <div
              onClick={this._handleClick_filterClose}>
              {
                <div
                  className={classnames(styles.boxSvgArrowStick)}
                  onMouseEnter={this._handleEnter_FilterNode}
                  onMouseLeave={this._handleLeave_FilterNode}>
                  <SvgArrowStick
                    customstyle={this.state.onFilterNode ? (
                      {
                        cls1: "{fill:none;stroke:#ff8168;stroke-linecap:round;stroke-linejoin:round;stroke-width:18px;}",
                        cls2: "{fill:#ff8168}"
                      }
                    ) : (
                      {
                        cls1: "{fill:none;stroke:rgb(69, 135, 160);stroke-linecap:round;stroke-linejoin:round;stroke-width:18px;}",
                        cls2: "{fill:rgb(69, 135, 160)}"
                      }
                    )} />
                  </div>
                }
              </div>
            }
            {
              !this.props.viewFilter &&
              <div
                className={classnames(styles.boxIconsFilter)}>
                <Link
                  to={this.props.location.pathname}
                  className={classnames('plainLinkButton', styles.boxIconFilterNode)}
                  onClick={this._handleClick_filter}
                  onMouseEnter={this._handleEnter_FilterNode}
                  onMouseLeave={this._handleLeave_FilterNode}>
                  <SvgFilterNode
                    customstyle={this.state.onFilterNode ? "{fill: #ff8168;}" : "{fill: rgb(69, 135, 160);}"} />
                </Link>
              </div>
            }
        </div>
      </div>
    )
  }

  _handleClick_filter(event){
      event.preventDefault();
      event.stopPropagation();

    this.props._set_viewFilter('filter')
  }

  _handleClick_filterClose(event){
    event.preventDefault();
    event.stopPropagation();
    this.props._set_viewFilter(null)
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
