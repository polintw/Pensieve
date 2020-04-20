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

class ChainMessage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      editingOpen: false,
      onCreate: false,
    };
    this._render_HintMessage = this._render_HintMessage.bind(this);
    this._handleClick_plainOpen = this._handleClick_plainOpen.bind(this);
    this._handleMouseOn_Create = ()=> this.setState((prevState,props)=>{return {onCreate: prevState.onCreate?false:true}});
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

  _render_HintMessage(recKeys){
    if(recKeys.length == 0){ // if no belongsByType was set
      return (
        <div
          className={classnames(styles.boxBlankHint, stylesFont.fontTitleHint, stylesFont.colorLightHint)}>
          {this.props.i18nUIString.catalog["guidingChain_noBelongSet"]}
        </div>
      )
    } else if (this.props.chainList.listOrderedChain.length < 1 && recKeys.length >0){
      return (
        <div
          className={classnames(styles.boxBlankHint, stylesFont.fontTitleHint, stylesFont.colorLightHint)}>
          <span>{this.props.i18nUIString.catalog["guidingChain_noSharedEst."][0]}</span>
        </div>
      )
    }else{
      return null
    }
  }

  render(){
    const recKeys = !!this.props.belongsByType.setTypesList? this.props.belongsByType.setTypesList: [];
    return(
      <div
        className={classnames(styles.comChainMessage)}>
        {this._render_HintMessage(recKeys)}
        {
          (this.props.chainList.listOrderedChain.length < 1 && recKeys.length >0) && //that's, has Belong, but never shared and has read all
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
              _submit_Share_New={this.props._submit_Share_New}
              _refer_von_Create={this.props._refer_von_cosmic}/>
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    belongsByType: state.belongsByType,
    chainList: state.chainList
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(ChainMessage));
