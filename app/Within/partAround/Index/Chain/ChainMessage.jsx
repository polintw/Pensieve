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
      <div>
        {this._render_HintMessage()}
      </div>
    )
  }

  _render_HintMessage(){
    /*
    More like a 'situation board'
    1) no shared: ------
    2) userShared + resToShared: "Your Shared" + "Responded by ____"
    3) sharedPrimer + latestShared: "" + "Responded succesfully"
    4) latestShared: "Shared succesfully"
    5) resToShared + resToRespond: "Respond to yours" + "Responded by _____"
    */
    if(this.props.sharedsList.list.length == 0){ // 1) no shareds at all
      return (
        <span
          className={classnames(stylesFont.fontContent, stylesFont.colorEditLightBlack)}>
          {this.props.i18nUIString.catalog["message_Chain_noShareds"]}
        </span>
      );
    }
    else if(this.props.chainList.listOrderedChain.length == 0){ // 2) shareds but no responds, most common condition
      return (
        <div
          className={classnames(stylesFont.colorEditLightBlack)}>
          <span
            className={classnames(stylesFont.fontContent)}>
            {this.props.i18nUIString.catalog["message_Chain_noChain"][0]}
          </span>
          <div
            style={{display: 'inline-block'}}>
            <AccountPalette
              styleFirst={{
                fontSize: '1.4rem', fontWeight: '400',
              }}
              styleLast={{
                display: 'none'
              }}
              userId={this.props.userInfo.id}/>
          </div>
          <span
            className={classnames(stylesFont.fontContent)}>
            {this.props.i18nUIString.catalog["message_Chain_noChain"][1]}
          </span>
        </div>
      );
    }
    else{
      /*
      3) new shared, not a responds: latestShared
      4) new shareds responds to primer: sharedPrimer +latestShared
      5) responds to your shared: userShared + resToShared
      6) responds to a responds: resToShared + resToRespond
      */
      let user;
      if( !(this.props.chainList.listOrderedChain[0] in this.props.unitsBasic) || !(this.props.chainList.listOrderedChain[1] in this.props.unitsBasic)) return;
      switch (this.props.chainList.listInfo[this.props.chainList.listOrderedChain[0]]) {
        case 'latestShared':
          return (
            <span
              className={classnames(stylesFont.fontContent, stylesFont.colorEditLightBlack)}>
              {this.props.i18nUIString.catalog["message_Chain_byChainInfo"][0]}
            </span>
          );
          break;
        case 'sharedPrimer':
          user = this.props.unitsBasic[this.props.chainList.listOrderedChain[0]].authorId;
          return (
            <div
              className={classnames(stylesFont.colorEditLightBlack)}>
              <span
                className={classnames(stylesFont.fontContent)}>
                {this.props.i18nUIString.catalog["message_Chain_byChainInfo"][1][0]}
              </span>
              <div
                className={classnames(stylesFont.colorAssistGold)}
                style={{display: 'inline-block'}}>
                <AccountPalette
                  styleFirst={{
                    fontSize: '1.4rem', fontWeight: '400',
                  }}
                  styleLast={{
                    display: 'none'
                  }}
                  userId={user}/>
              </div>
              <span
                className={classnames(stylesFont.fontContent)}>
                {this.props.i18nUIString.catalog["message_Chain_byChainInfo"][1][1]}
              </span>
            </div>
          );
          break;
        case 'userShared':
          user = this.props.unitsBasic[this.props.chainList.listOrderedChain[1]].authorId;
          return (
            <div
              className={classnames(stylesFont.colorEditLightBlack)}>
              <div
                className={classnames(stylesFont.colorAssistGold)}
                style={{display: 'inline-block'}}>
                <AccountPalette
                  styleFirst={{
                    fontSize: '1.4rem', fontWeight: '400',
                  }}
                  styleLast={{
                    display: 'none'
                  }}
                  userId={user}/>
              </div>
              <span
                className={classnames(stylesFont.fontContent)}>
                {" "+this.props.i18nUIString.catalog["message_Chain_byChainInfo"][2]}
              </span>
            </div>
          );
          break;
        case 'resToShared':
          user = this.props.unitsBasic[this.props.chainList.listOrderedChain[0]].authorId;
          return (
            <div
              className={classnames(stylesFont.colorEditLightBlack)}>
              <span
                className={classnames(stylesFont.fontContent)}>
                {this.props.i18nUIString.catalog["message_Chain_byChainInfo"][3][0]}
              </span>
              <div
                className={classnames(stylesFont.colorAssistGold)}
                style={{display: 'inline-block'}}>
                <AccountPalette
                  styleFirst={{
                    fontSize: '1.4rem', fontWeight: '400',
                  }}
                  styleLast={{
                    display: 'none'
                  }}
                  userId={user}/>
              </div>
              <span
                className={classnames(stylesFont.fontContent)}>
                {this.props.i18nUIString.catalog["message_Chain_byChainInfo"][3][1]}
              </span>
            </div>
          );
          break;
        default:
        return (
          <div
            className={classnames(stylesFont.colorEditLightBlack)}>
            <span
              className={classnames(stylesFont.fontContent)}>
              {this.props.i18nUIString.catalog["message_Chain_noChain"][0]}
            </span>
            <div
              style={{display: 'inline-block'}}>
              <AccountPalette
                styleFirst={{
                  fontSize: '1.4rem', fontWeight: '400',
                }}
                styleLast={{
                  display: 'none'
                }}
                userId={this.props.userInfo.id}/>
            </div>
            <span
              className={classnames(stylesFont.fontContent)}>
              {this.props.i18nUIString.catalog["message_Chain_noChain"][1]}
            </span>
          </div>
        )
      };
    }
  }

}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    chainList: state.chainList,
    sharedsList: state.sharedsList
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
