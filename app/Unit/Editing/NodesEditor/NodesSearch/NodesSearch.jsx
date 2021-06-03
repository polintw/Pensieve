import React from 'react';
import {
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import {NodeSearchModule} from '../../../../Components/NodesSearch/NodeSearchModule.jsx';
import {
  handleNounsList,
} from "../../../../redux/actions/general.js";

class NodesSearch extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._set_choiceFromSearch = this._set_choiceFromSearch.bind(this);
  }

  _set_choiceFromSearch(nodeBasic){
    this.props._submit_NounsList_new([nodeBasic.id]);
    //pass the choice to parent's state
    this.props._set_nodeByNodeBasic(nodeBasic);
  }

  componentDidMount() {

  }

  componentWillUnmount(){

  }

  render(){
    return(
      <div
        className={styles.comNodesSearch}>
        <NodeSearchModule
          type={"inputDirect"}
          mountFocus={false}
          reversed = {false}
          _set_nodeChoice={this._set_choiceFromSearch}
          _set_SearchModal_switch={()=>{}}
          _handleClick_SearchModal_switch={(e)=>{e.preventDefault();e.stopPropagation();}}/>
      </div>
    )
  }

}

const mapStateToProps = (state)=>{
  return {
    i18nUIString: state.i18nUIString,
    nounsBasic: state.nounsBasic,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_NounsList_new: (arr) => { dispatch(handleNounsList(arr)); },
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(NodesSearch));
