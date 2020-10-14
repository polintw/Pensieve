import React from 'react';
import {
  withRouter,
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";

class NodesEditor extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      nodesSet: this.props.nodesSet, // start from nodesSet passed from props

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
        className={classnames(styles.comNodesEditor)}>
        <div
          className={classnames(styles.boxNodesEditTitle, styles.seperationBottom, styles.seperationTopEdge, "fontSubtitle", "colorEditLightBlack")}>
          {this.props.i18nUIString.catalog["guidingCreateShare_AssignGroup"]}
        </div>
        <div
          className={classnames(styles.boxNodesEditTags, styles.seperationBottom)}>
          {}
        </div>
        <div
          className={classnames(styles.editorRow, styles.seperationBottom)}>
          {this._render_assignNodes()}
        </div>
        <div>

        </div>

      </div>
    )
  }


}

const mapStateToProps = (state) => {
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    unitView: state.unitView,
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
)(NodesEditor));
