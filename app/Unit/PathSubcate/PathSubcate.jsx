import React from 'react';
import {
  Link,
  withRouter,
  Redirect
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import PathSubcateCover from './PathSubcateCover.jsx'
import PathSubcateEnd from './PathSubcateEnd.jsx'
import SubcateBtnNext from '../Entity/SubcateBtnNext.jsx';

class PathSubcate extends React.Component {
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
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    };
  }

  render(){
    let urlParams = new URLSearchParams(this.props.location.search); //we need value in URL query
    const currentUnit = urlParams.get("unitId"); // use 'const' to prevent change at followed step

    if(!this.props.unitSubCate.next_confirm){
      return (
        <div
          className={classnames(styles.boxPathSubcateCenter)}>
          <div
            className={classnames(
              styles.boxPathSubcateBackBoard, styles.boxPathSubcatePlainBoard)}>
          </div>
          <div
            className={classnames(styles.boxHiddenBtnNext)}>
            <SubcateBtnNext
              {...this.props}/>
          </div>
        </div>
      )
    }
    else if(currentUnit == this.props.unitSubCate.first_unit){
      return(
        <div
          className={classnames(styles.comPathSubcate)}>
          <PathSubcateCover
            {...this.props}/>
        </div>
      );
    }
    else if(this.props.unitSubCate.next_unit == this.props.unitSubCate.first_unit){
      return (
        <div
          className={classnames(styles.comPathSubcate)}>
          <PathSubcateEnd
            {...this.props}/>
        </div>
      )
    }
  }

}

const mapStateToProps = (state)=>{
  return {
    i18nUIString: state.i18nUIString,
    unitCurrent: state.unitCurrent,
    unitSubCate: state.unitSubCate
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(PathSubcate));
