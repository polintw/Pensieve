import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import SubcatesList from '../Subcate/SubcatesList.jsx';
import TitleSubcate from '../Subcate/TitleSubcate.jsx';

class NavFeed extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    let urlParams = new URLSearchParams(this.props.location.search); //we need value in URL query
    this.viewFilter = urlParams.has('_filter_nodes');
    this.filterNode = urlParams.has('filterNode');
    if(urlParams.has('subCate')){
      this.currentSubCate = urlParams.get('subCate');
    } else this.currentSubCate = false;

    return(
      <div
        className={classnames(styles.comNavFeed)}>
        <div>
          <span
            className={classnames(
              "fontContent", "weightBold", "colorAssistGold")}>
            { this.props.i18nUIString.catalog["title_NavAtNode_"] }
          </span>
        </div>
        {
          (!this.viewFilter && !this.filterNode && !this.currentSubCate) &&
          <SubcatesList
            {...this.props}/>
        }
        {
          this.currentSubCate &&
          <TitleSubcate
            {...this.props}/>
        }
      </div>
    )
  }

}

const mapStateToProps = (state)=>{
  return {
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
)(NavFeed));
