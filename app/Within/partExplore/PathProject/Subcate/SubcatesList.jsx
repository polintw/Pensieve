import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import SubcateIntro from './SubcateIntro/SubcateIntro.jsx';
import SubcateNail from './SubcateNail/SubcateNail.jsx';
import TitleSubcate from './TitleSubcate/TitleSubcate.jsx';
import {
  _axios_get_projectSubcateBasic
} from './axios.js';
import {
  cancelErr,
  uncertainErr
} from '../../../../utils/errHandlers.js';

class SubcatesList extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      subCatesList: [],
      subCatesObj: {}, // obj by key: subcate.exposedId
      unitsSubcateBasic: {}
    };
    this.axiosSource = axios.CancelToken.source();
    this._set_subcatesBasic = this._set_subcatesBasic.bind(this);
    this._render_list = this._render_list.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if(this.props.match.params['pathName'] != prevProps.match.params['pathName']){ // jump to diff. pathProject
      this._set_subcatesBasic();
    };
  }

  componentDidMount(){
    this._set_subcatesBasic();
  }

  componentWillUnmount(){

  }

  _render_list(){
    let subCatesDOM = this.state.subCatesList.map((subCateId, index)=>{
      return (
        <div
          key={"key_subcate_Nail_"+index}
          className={classnames(styles.boxListItem)}>
          <SubcateNail
            {...this.props}
            subCateId={subCateId}
            subCateInfo={this.state.subCatesObj[subCateId]}
            unitsBasic={this.state.unitsSubcateBasic}/>
        </div>
      )
    });

    return subCatesDOM;
  }


  render(){
    let urlParams = new URLSearchParams(this.props.location.search); //we need value in URL query
    if(urlParams.has('subCate')){
      this.currentSubCate = urlParams.get('subCate');
    } else this.currentSubCate = false;
    if(urlParams.has('_filter_map')){
      this.viewFilter = true;
    } else this.viewFilter = false;
    return (
      <div
        className={classnames(styles.comSubcatesList)}>
        {
          this.currentSubCate ? (
            <div
              className={classnames(styles.boxSubcateIntro)}>
              <div
                className={classnames(styles.boxTitleSubcate)}
                style={
                  this.viewFilter ? {
                    boxShadow: "0px 4px 4px -4px rgb(84 84 84 / 45%)",
                    margin: "0 0 12px",
                    paddingBottom: "8px"
                  } : {paddingBottom: '4px'}}>
                {
                  (this.currentSubCate in this.state.subCatesObj) &&
                  <TitleSubcate
                    {...this.props}
                    subCatesObj={this.state.subCatesObj}/>
                }
              </div>
              {
                (this.currentSubCate in this.state.subCatesObj) &&
                <div
                  style={{width: '100%'}}>
                  <SubcateIntro
                    {...this.props}
                    subCatesObj={this.state.subCatesObj}
                    unitsBasic={this.state.unitsSubcateBasic}/>
                </div>
              }
            </div>
          ): (
            <div
              className={classnames(styles.boxSubcatesList)}>
              {this._render_list()}
            </div>
          )
        }
        <div className={classnames(styles.boxFooter)}/>
      </div>
    )
  }

  _set_subcatesBasic(){
    const self = this;
    this.setState({axios: true});

    _axios_get_projectSubcateBasic(this.axiosSource.token, this.props.match.params['pathName'])
    .then((resObj)=>{
      self.setState((prevState, props)=>{
        return {
          axios: false,
          subCatesList: resObj.main.subCatesList,
          subCatesObj: resObj.main.subCatesObj,
          unitsSubcateBasic: {...prevState.unitsSubcateBasic, ...resObj.main.unitsSubcateBasic},
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
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(SubcatesList));
