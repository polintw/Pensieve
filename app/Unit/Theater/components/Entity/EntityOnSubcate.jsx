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
import {
  _axios_get_unitSubCate
} from './axios.js';
import {
  handleNounsList,
} from "../../../redux/actions/general.js";
import {
  cancelErr,
  uncertainErr
} from '../../../utils/errHandlers.js';

class EntityOnSubcate extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,

    };
    this.axiosSource = axios.CancelToken.source();
    this._set_unitSubCate = this._set_unitSubCate.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){
    this._set_unitSubCate();
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    let urlParams = new URLSearchParams(this.props.location.search); //we need value in URL query
    if(urlParams.has('filterNode')){
      this.filterNode = urlParams.get('filterNode');
    } else this.filterNode = null;
    if(urlParams.has('_filter_nodes')){
      this.viewFilter = true;
    } else this.viewFilter = false;

    return(
      <div>

      </div>
    )
  }

  _set_unitSubCate(){
    const self = this;
    this.setState({axios: true});

    _axios_get_unitSubCate(this.axiosSource.token, {
      unitId: this.props.unitCurrent.unitId,
      subCateId: this.props.unitEntity.pathSubCate.currentSubCateId,
      subCateParent: 'pathProject'
    })
    .then((resObj)=>{

      self.setState((prevState, props)=>{
        return {
          axios: false,

        };
      });

    })
    .catch(function (thrown) {
      self.setState({axios: false});
      if (axios.isCancel(thrown)) {
        cancelErr(thrown);
      } else {
        let message = uncertainErr(thrown);
        if(message) alert(message);
      }
    });
  }

}


const mapStateToProps = (state)=>{
  return {
    tokenStatus: state.token,
    i18nUIString: state.i18nUIString,
    unitCurrent: state.unitCurrent,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(EntityOnSubcate));
