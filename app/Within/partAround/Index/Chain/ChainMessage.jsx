import React from 'react';
import {
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import stylesFont from '../../stylesFont.module.css';
import AccountPalette from '../../../../Components/AccountPalette.jsx';

class ChainMessage extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._text_toNodes = this._text_toNodes.bind(this);
    this._render_HintMessage = this._render_HintMessage.bind(this);
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
          styles.boxModule,
          styles.boxModuleSmall)}>
        {this._render_HintMessage()}
      </div>
    )
  }

  _render_HintMessage(){
    /*
    More like a 'situation board'
    1) X no respond: ------
    2) userShared + resToShared: "Your Shared" + "Responded [by ____]"
    3) sharedPrimer + latestShared: "Your Last Read" + "Responded to it [succesfully]"
    4) latestShared: "Shared [succesfully]" + ""
    5) resToShared + resToRespond: "Respond to yours" + "Responded [by _____]"
    */
    let titleDOM = [];
    // modification for small screen
    let cssVW = window.innerWidth; // px of vw in pure integer

    switch (this.props.chainList.listInfo[this.props.chainList.listOrderedChain[0]]) {
      case "userShared":
        titleDOM.push(
          (
            <div
              key={"key_ChainNailTitle_0"}
              className={classnames(styles.boxNailTitle)}>
              <span
                className={classnames(stylesFont.fontHint, stylesFont.weightBold, stylesFont.colorAssistGold)}>
                {this.props.i18nUIString.catalog["message_Chain_byChainInfo"][0]}
              </span>
              <span
                className={classnames(stylesFont.fontHint, stylesFont.colorEditLightBlack)}>
                {this._text_toNodes(0)}
              </span>
            </div>
          ),
          (
            <div
              key={"key_ChainNailTitle_1"}
              className={classnames(styles.boxNailTitle)}>
              <span
                className={classnames(stylesFont.fontHint, stylesFont.weightBold, stylesFont.colorAssistGold)}>
                {this.props.i18nUIString.catalog["message_Chain_byChainInfo"][1]}
              </span>
              <div
                className={classnames(stylesFont.colorEditLightBlack)}
                style={{display: 'inline-block'}}>
                <AccountPalette
                  styleFirst={{fontSize: '1.4rem', fontWeight: '400'}}
                  userId={this.props.unitsBasic[this.props.chainList.listOrderedChain[1]].authorId}/>
              </div>
            </div>
          )
        )
        break;
      case "sharedPrimer":
        titleDOM.push(
          (
            <div
              key={"key_ChainNailTitle_0"}
              className={classnames(styles.boxNailTitle)}>
              <span
                className={classnames(stylesFont.fontHint, stylesFont.weightBold, stylesFont.colorAssistGold)}>
                {this.props.i18nUIString.catalog["message_Chain_byChainInfo"][3]}
              </span>
            </div>
          ),
          (
            <div
              key={"key_ChainNailTitle_1"}
              className={classnames(styles.boxNailTitle)}>
              <span
                className={classnames(stylesFont.fontHint, stylesFont.weightBold, stylesFont.colorAssistGold)}>
                {this.props.i18nUIString.catalog["message_Chain_byChainInfo"][4]}
              </span>
              <span
                className={classnames(stylesFont.fontHint, stylesFont.colorEditLightBlack)}>
                {this.props.i18nUIString.catalog["message_Chain_byChainInfo"][7]}
              </span>
            </div>
          )
        );
        if(cssVW < 860) {
          titleDOM = [];
          titleDOM.push(
            (
              <div
                key={"key_ChainNailTitle_0"}
                className={classnames(styles.boxNailTitle)}>
                <span
                  className={classnames(stylesFont.fontHint, stylesFont.weightBold, stylesFont.colorAssistGold)}>
                  {this.props.i18nUIString.catalog["message_Chain_byChainInfo"][2]}
                </span>
              </div>
            ),
            (
              <div
                key={"key_ChainNailTitle_1"}
                className={classnames(styles.boxNailTitle)}>
                <span
                  className={classnames(stylesFont.fontHint, stylesFont.weightBold, stylesFont.colorAssistGold)}>
                  {this.props.i18nUIString.catalog["message_Chain_byChainInfo"][3]}
                </span>
                <span
                  className={classnames(stylesFont.fontHint, stylesFont.colorEditLightBlack)}>
                  {this.props.i18nUIString.catalog["message_Chain_byChainInfo"][7]}
                </span>
              </div>
            )
          )
        }
        break;
      case "latestShared":
        titleDOM.push(
          (
            <div
              key={"key_ChainNailTitle_0"}
              className={classnames(styles.boxNailTitle)}>
              <span
                className={classnames(stylesFont.fontHint, stylesFont.weightBold, stylesFont.colorAssistGold)}>
                {this.props.i18nUIString.catalog["message_Chain_byChainInfo"][5]}
              </span>
              <span
                className={classnames(stylesFont.fontHint, stylesFont.colorEditLightBlack)}>
                {this.props.i18nUIString.catalog["message_Chain_byChainInfo"][7]}
                {this._text_toNodes(0)}
              </span>
            </div>
          ),
        )
        break;
      case "resToShared":
        titleDOM.push(
          (
            <div
              key={"key_ChainNailTitle_0"}
              className={classnames(styles.boxNailTitle)}>
              <span
                className={classnames(stylesFont.fontHint, stylesFont.weightBold, stylesFont.colorAssistGold)}>
                {this.props.i18nUIString.catalog["message_Chain_byChainInfo"][6]}
              </span>
            </div>
          ),
          (
            <div
              key={"key_ChainNailTitle_1"}
              className={classnames(styles.boxNailTitle)}>
              <span
                className={classnames(stylesFont.fontHint, stylesFont.weightBold, stylesFont.colorAssistGold)}>
                {this.props.i18nUIString.catalog["message_Chain_byChainInfo"][1]}
              </span>
              <div
                className={classnames(stylesFont.colorEditLightBlack)}
                style={{display: 'inline-block'}}>
                <AccountPalette
                  styleFirst={{fontSize: '1.4rem', fontWeight: '400'}}
                  userId={this.props.unitsBasic[this.props.chainList.listOrderedChain[1]].authorId}/>
              </div>
            </div>
          )
        )
        break;
      case "newInspired":
        titleDOM.push(
          (
            <div
              key={"key_ChainNailTitle_0"}
              className={classnames(styles.boxNailTitle)}>
              <span
                className={classnames(stylesFont.fontHint, stylesFont.weightBold, stylesFont.colorAssistGold)}>
                {this.props.i18nUIString.catalog["message_Chain_byChainInfo"][8]}
              </span>
              <span
                className={classnames(stylesFont.fontHint, stylesFont.colorEditLightBlack)}>
                {this.props.i18nUIString.catalog["message_Chain_byChainInfo"][9]}
              </span>
            </div>
          )
        );
        if(this.props.chainList.listOrderedChain.length > 1){
          titleDOM.push(
            (
              <div
                key={"key_ChainNailTitle_1"}
                className={classnames(styles.boxNailTitle)}>
                <span
                  className={classnames(stylesFont.fontHint, stylesFont.weightBold, stylesFont.colorAssistGold)}>
                  {this.props.i18nUIString.catalog["message_Chain_byChainInfo"][8]}
                </span>
                <span
                  className={classnames(stylesFont.fontHint, stylesFont.colorEditLightBlack)}>
                  {this.props.i18nUIString.catalog["message_Chain_byChainInfo"][9]}
                </span>
              </div>
            )
          )
        };
        break;
      default:

    }

    return titleDOM;
  }

  _text_toNodes(listOrder){
    let nodesList = this.props.unitsBasic[this.props.chainList.listOrderedChain[listOrder]].nounsList;
    let firstNodeId = nodesList[0];
    let firstNodeName = (firstNodeId in this.props.nounsBasic) ? (
      this.props.nounsBasic[firstNodeId].name) : null ;
    let returnText = this.props.i18nUIString.catalog["message_Chain_toNodes"][0] + firstNodeName;
    if(nodesList.length > 1) returnText += this.props.i18nUIString.catalog["message_Chain_toNodes"][1];

    return returnText;
  }

}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    nounsBasic: state.nounsBasic,
    chainList: state.chainList,
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
