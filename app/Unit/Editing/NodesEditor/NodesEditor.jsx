import React from 'react';
import {
  withRouter,
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import AssignOptions from '../components/AssignOptions/AssignOptions.jsx';

class NodesEditor extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      nodesSet: this.props.nodesSet, // start from nodesSet passed from props
      selectedList: [], // all id of selectd nodes
      homeSelection: null, //node id as selection of homeland
      residSelection: null, //node id as selection of residence
      freeSelection: null //node id as selection of free search
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
          {this.props.i18nUIString.catalog["guidingCreateShare_NodesEditor"]}
        </div>
        <div
          className={classnames(styles.seperationBottom)}>
          <div>
            <div>
              {this.props.i18nUIString.catalog["subTitle_CreateShare_AssignTypes"][0]}
            </div>
            <div>
              <AssignOptions
                assignType={'homeland'}
                selected={this.state.homeSelection}
                allSelection={this.state.selectedList}/>
            </div>
          </div>

        </div>
        <div>
          {"Done"}
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
