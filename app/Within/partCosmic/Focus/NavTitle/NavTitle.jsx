import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import NavCosmicNodes from '../../../../Components/NavWithin/NavCosmic/NavCosmicNodes.jsx';

class NavTitle extends React.Component {
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
    return(
      <div
        className={classnames(
          styles.boxTitle, styles.comNavTitle)}>
        <div>
          <span
            className={classnames(
              "fontContentPlain", "weightBold", "colorAssistGold")}>
            { this.props.i18nUIString.catalog["title_focusBoard"] }
          </span>
        </div>
        <div>
          <NavCosmicNodes/>
        </div>
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
)(NavTitle));
