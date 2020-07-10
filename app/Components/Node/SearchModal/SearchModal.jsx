import React from 'react';
import {
  Link,
  withRouter,
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import {NodeSearchModule} from '../NodeSearchModule.jsx';
import {updateNodesBasic} from '../../../redux/actions/general.js'

class SearchModal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onButton: false
    };
    this._set_choiceFromSearch = this._set_choiceFromSearch.bind(this);
    this._handleClick_SearchModal_switch = this._handleClick_SearchModal_switch.bind(this);
    this._handleEnter_button = this._handleEnter_button.bind(this);
    this._handleLeave_button = this._handleLeave_button.bind(this);
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
            className={classnames("fontSubtitle","colorOptionsBlack")}
            style={{lineHeight: "1.5"}}>
            {this.props.i18nUIString.catalog["descript_BelongSet_SearchBytType"][0]}
          </span>
          <span
            className={classnames("fontSubtitle" ,"colorOptionsBlack", "weightBold")}
            style={{lineHeight: "1.5"}}>
            { (this.props.settingType=="residence") ? this.props.i18nUIString.catalog['category_Belongs_'][1] : this.props.i18nUIString.catalog['category_Belongs_'][0]}
          </span>
          <div
            style={{display: 'inline-block', position: 'relative', float: 'right'}}
            onClick={this._handleClick_SearchModal_switch}>
            <span
              value={'close'}
              className={classnames(
                styles.spanClose, "fontContent",
                {
                  ["colorGrey"]: !this.state.onButton,
                  ["colorDescripBlack"]: this.state.onButton
                }
              )}
              onMouseEnter={this._handleEnter_button}
              onMouseLeave={this._handleLeave_button}>
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

  _handleEnter_button(e){
    this.setState({
      onButton: e.currentTarget.getAttribute('value')
    })
  }

  _handleLeave_button(e){
    this.setState({
      onButton: false
    })
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
