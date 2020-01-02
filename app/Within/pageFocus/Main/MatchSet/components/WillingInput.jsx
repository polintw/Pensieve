import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import stylesMatch from '../styles.module.css';
import stylesMain from "../../styles.module.css"; //Notice, we use shared css file here for easier control
import {NodeSearchModule} from '../../../../../Component/NodeSearchModule.jsx';


class WillingInput extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      settingModal: false,
      onType: false
    };
    this._handleClick_willing_set = this._handleClick_willing_set.bind(this);
    this._handleMouseOn_Type = ()=> this.setState((prevState,props)=>{return {onType: prevState.onType?false:true}});
    this._set_settingModal = ()=> this.setState((prevState, index)=>{return {settingModal: prevState.settingModal? false: true}});
    this.style={

    }
  }

  _handleClick_willing_set(event){
    event.preventDefault();
    event.stopPropagation();
    //could open node search if the box was empty
    if(!this.props.axios) this._set_settingModal();
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
        className={classnames(stylesMatch.boxNodeWilling)}>
        {
          this.state.settingModal &&
          <div
            className={classnames(stylesMatch.boxSettingModal)}>
            <div
              className={classnames(stylesMatch.boxSettingType)}>
              <span
                className={classnames(stylesMatch.spanType, stylesMain.fontType)}
                style={{lineHeight: '3rem'}}>
                {this.props.i18nUIString.catalog["catagory_MatchNodes_willing"][2]}
              </span>
            </div>
            <NodeSearchModule
              type={"option"}
              _set_nodeChoice={this.props._set_choiceFromSearch}
              _set_SearchModal_switch={this._set_settingModal}
              _handleClick_SearchModal_switch={(e)=>{e.preventDefault();e.stopPropagation();this._set_settingModal();}}/>
          </div>
        }

        <div
          className={classnames(
            stylesMatch.boxNodeType,
            stylesMain.fontType,
            {[stylesMatch.fontOnType]: this.state.onType}
          )}
          onClick={this._handleClick_willing_set}
          onMouseEnter={this._handleMouseOn_Type}
          onMouseLeave={this._handleMouseOn_Type}>
          <span>{this.props.i18nUIString.catalog["catagory_MatchNodes_willing"][0]}</span><br/>
          <span>{this.props.i18nUIString.catalog["catagory_MatchNodes_willing"][1]}</span>
        </div>

      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
    i18nUIString: state.i18nUIString,
    nounsBasic: state.nounsBasic,
    indexLists: state.indexLists
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(WillingInput));
