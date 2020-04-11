import React from 'react';
import {
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import stylesFont from '../stylesFont.module.css';
import {NodeSearchModule} from '../../../Components/Node/NodeSearchModule.jsx';

class BelongSet extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._set_choiceFromSearch = this._set_choiceFromSearch.bind(this);

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
    this.setState({
      dialog: true,
      chosenNode: choice,
      settingType: type,
      searchModal: false
    });
  }


  componentDidMount() {

  }

  componentWillUnmount(){

  }


  render(){
    return(
      <div
        className={styles.comBelongSet}>
        {
          this.props.belongs[this.props.settingType] ? (
            <div>
              {this.props.belongs[this.props.settingType]}
            </div>
          ):(
            <NodeSearchModule
              type={"option"}
              _set_nodeChoice={this._set_choiceFromSearch}
              _set_SearchModal_switch={()=>{}}
              _handleClick_SearchModal_switch={(e)=>{e.preventDefault();e.stopPropagation();}}/>
          )
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

export default withRouter(connect(
  mapStateToProps,
  null
)(BelongSet));
