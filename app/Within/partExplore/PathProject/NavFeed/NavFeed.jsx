import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import NavBtnRow from '../../../../Components/NavFilter/NavBtnRow.jsx';
import NavFilterMode from '../../../../Components/NavFilter/NavFilterMode.jsx';

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
        <NavBtnRow
          {...this.props}
          viewFilter={this.viewFilter}/>
        {
          this.viewFilter &&
          <div
            className={classnames(styles.boxFilterNav)}>
            <NavFilterMode/>
          </div>
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
