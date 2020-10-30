import React from 'react';
import {
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";

class NavFilter extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._handleClick_filter = this._handleClick_filter.bind(this)
    this._handleClick_filterClose = this._handleClick_filterClose.bind(this)
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  render(){
    return (
      <div className={styles.comNavFilter}>
        <div
          className={classnames(styles.boxProjectInfo)}>
          {
            (!this.props.viewFilter && ("description" in this.props.projectInfo)) &&
            this.props.projectInfo.description
          }
        </div>
        <div
          className={classnames(styles.boxFilter)}>
          <div
            onClick={this._handleClick_filterClose}>
            {
              this.props.viewFilter &&
              " ╳ "
            }
          </div>
          <div
            onClick={this._handleClick_filter}>
            {"Filter"}
          </div>
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
)(NavFilter));
