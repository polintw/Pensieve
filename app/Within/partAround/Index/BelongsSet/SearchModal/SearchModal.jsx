import React from 'react';
import {
  Link,
  withRouter,
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import stylesFont from "../../../stylesFont.module.css"; //Notice, we use shared css file here for easier control
import {updateNodesBasic} from '../../../../../redux/actions/general.js'
import {NodeSearchModule} from '../../../../../Components/Node/NodeSearchModule.jsx';

class SearchModal extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._set_choiceFromSearch = this._set_choiceFromSearch.bind(this);
    this._handleClick_SearchModal_switch = this._handleClick_SearchModal_switch.bind(this);
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
    this.props._set_choiceAnType(nodeBasic.id, this.props.settingType);
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
            className={classnames(stylesFont.fontDescrip ,stylesFont.colorOptionsBlack)}
            style={{lineHeight: "1.5"}}>
            {this.props.i18nUIString.catalog["descript_BelongSet_SearchBytType"][0]}
          </span>
          <span
            className={classnames(stylesFont.fontDescrip ,stylesFont.colorOptionsBlack)}
            style={{lineHeight: "1.5"}}>
            { (this.props.settingType=="residence") ? "current stay" : this.props.settingType}
          </span>
          <div
            style={{display: 'inline-block', position: 'relative', float: 'right'}}
            onClick={this._handleClick_SearchModal_switch}>
            <span
              className={classnames(styles.spanClose, stylesFont.fontContent, stylesFont.colorGrey)}>
              {'close'}
            </span>
          </div>

        </div>
        <div
          className={classnames(styles.boxSearchInput)}>
          <NodeSearchModule
            type={"inputDirect"}
            mountFocus={false}
            reversed = {false}
            relative = {true}
            _set_nodeChoice={this._set_choiceFromSearch}
            _set_SearchModal_switch={this.props._set_ModalOnly}/>
        </div>

      </div>
    )
  }

  _handleClick_SearchModal_switch(e){
    e.preventDefault();e.stopPropagation();
    this.props._set_searchModal();
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
