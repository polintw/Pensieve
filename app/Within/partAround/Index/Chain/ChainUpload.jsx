import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import stylesFont from '../../stylesFont.module.css';
import CreateShare from '../../../../Unit/Editing/CreateShare.jsx';

class ChainUpload extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      editingOpen: false,
      onCreate: false,

    };
    this._submit_Share_New = this._submit_Share_New.bind(this);
    this._render_HintMessage = this._render_HintMessage.bind(this);
    this._handleClick_plainOpen = this._handleClick_plainOpen.bind(this);
    this._handleMouseOn_Create = ()=> this.setState((prevState,props)=>{return {onCreate: prevState.onCreate?false:true}});
  }

  _submit_Share_New(dataObj){
    //Fetch list again
    this.props._set_ChainUnits();
  }

  _handleClick_plainOpen(event){
    event.preventDefault();
    event.stopPropagation();
    this.setState({editingOpen: true});
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  _render_HintMessage(){
    let sharedify;
    for(let i=0; i < 2; i++){
      if('form' in this.props[this.props.nailsKey[i]]){
        sharedify = (this.props[this.props.nailsKey[i]].form == 'shared') ? true: false;
      }
    };
    if(!this.props.belongify){
      return (
        <div
          className={classnames(styles.boxBlankHint, stylesFont.fontHint)}>
          <span>{this.props.i18nUIString.catalog["guidingChain_Upload_noSharedEst."]}</span>
        </div>
      )
    }else if(!sharedify){ //no shared record
      return (
        <div
          className={classnames(styles.boxBlankHint, stylesFont.fontHint)}>
          <span>{this.props.i18nUIString.catalog["guidingChain_Upload_aShared"]}</span>
        </div>
      )
    }else{
      return null
    }
  }

  render(){
    return(
      <div
        className={classnames(styles.comChainUpload)}>
        {this._render_HintMessage()}
        <div
          className={classnames(styles.boxCreate)}>
          <div
            onClick={this._handleClick_plainOpen}
            onMouseEnter={this._handleMouseOn_Create}
            onMouseLeave={this._handleMouseOn_Create}>
            {"Upload"}
          </div>
          <CreateShare
            forceCreate={this.state.editingOpen}
            _submit_Share_New={this._submit_Share_New}
            _refer_von_Create={this.props._refer_von_cosmic}/>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
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
)(ChainUpload));
