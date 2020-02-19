import React from 'react';
import {
  Link,
  withRouter,
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import {updateNodesBasic} from '../../../../../redux/actions/general.js'
import {NodeSearchModule} from '../../../../../Components/Node/NodeSearchModule.jsx';

class SearchModal extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._set_choiceFromSearch = this._set_choiceFromSearch.bind(this);
    this.style={

    }
  }

  _set_choiceFromSearch(nodeBasic){
    //create obj to fit the format of state in redux
    let insertObj = {};
    insertObj[nodeBasic.id] = nodeBasic;

    //pass the node basic into redux first,
    //so the handler would not need to fetch node data from db again
    this.props._submit_Nodes_insert(insertObj);
    //no need to fetch node data from db again for any condition gave the choice a non-false value
    //has already save the data of node in reducer.

    //and pass the choice to
    this.props._set_choiceAnType(nodeBasic.id, this.props.type);
    this.props._set_searchModal();
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
        className={classnames(styles.comSearchModal)}>
        <div
          className={classnames(styles.boxTypeSetting)}>
          <span
            className={classnames(
              styles.fontDescrip,
            )}
            style={{lineHeight: '3rem'}}>
            {this.props.i18nUIString.catalog["descript_BelongSet_SearchBytType"][0]}
          </span>
          <span
            className={classnames(
              styles.fontDescrip,
            )}
            style={{lineHeight: '3rem'}}>
            {this.props.settingType}</span>
        </div>

        <NodeSearchModule
          type={"option"}
          _set_nodeChoice={this._set_choiceFromSearch}
          _set_SearchModal_switch={this.props._set_searchModal}
          _handleClick_SearchModal_switch={(e)=>{e.preventDefault();e.stopPropagation();this.props._set_searchModal();}}/>

      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_Nodes_insert: (obj) => { dispatch(updateNodesBasic(obj)); },
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchModal));
