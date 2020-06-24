import React from 'react';
import { connect } from "react-redux";
import {
  Link,
} from 'react-router-dom';
import classnames from 'classnames';
//import styles from './styles.module.css';
import stylesFont from '../../stylesFont.module.css';
import AccountPalette from '../../../Components/AccountPalette.jsx';
import {
  _axios_getUnitPrimer,
  _axios_getUnitSrc,
} from '../../utils.js';
import {
  setUnitCurrent,
  handleUsersList,
  updateUsersBasic
} from "../../../redux/actions/general.js";
import {
  cancelErr,
  uncertainErr
} from '../../../utils/errHandlers.js';

class Primer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      onPrimerLine: false
    };
    this.axiosSource = axios.CancelToken.source();
    this._set_UnitCurrentPrimer = this._set_UnitCurrentPrimer.bind(this);
    this._handleEnter_primerLine = this._handleEnter_primerLine.bind(this);
    this._handleLeave_primerLine = this._handleLeave_primerLine.bind(this);
    this._handleClick_Primerhref = this._handleClick_Primerhref.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    // req for a primer if (.primerify)
    if(!prevProps.unitCurrent.primerify && this.props.unitCurrent.primerify) this._set_UnitCurrentPrimer();
  }

  componentDidMount(){
    // req for a primer if (.primerify)
    if(this.props.unitCurrent.primerify) this._set_UnitCurrentPrimer();
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    };
  }

  render(){
    return !!window.localStorage['token'] ? (
      <div
        className={classnames(stylesFont.fontContent, stylesFont.colorGrey)}
        style={{lineHeight: 'unset'}}>
        <span style={{cursor: 'default'}}>{this.props.i18nUIString.catalog["descript_Unit_Primer"][0]}</span>
        {
          /*
          actually this is should  be a <div>, or any other than <Link>.
          we just under time pressure to have a detaul replacement.
          */
          (this.props.unitCurrent.primer.primerId.length > 0) &&
          <Link
            to={''}
            onClick={this._handleClick_Primerhref}
            className={classnames('plainLinkButton', stylesFont.colorStandard)}
            style={{
              display: 'inline-block',
              textDecoration: this.state.onPrimerLine? "underline": "none"
            }}
            onMouseEnter={this._handleEnter_primerLine}
            onMouseLeave={this._handleLeave_primerLine}>
            <div
              style={{display: 'inline-block'}}>
              <AccountPalette
                styleFirst={{
                  fontSize: '1.4rem', fontWeight: '400',
                  textDecoration: this.state.onPrimerLine? "underline": "none"
                }}
                styleLast={{
                  fontSize: '1.4rem',
                  textDecoration: this.state.onPrimerLine? "underline": "none"
                }}
                userId={this.props.unitCurrent.primer.authorPrimer}/>
            </div>
            <span>{this.props.i18nUIString.catalog["descript_Unit_Primer"][1]}</span>
          </Link>
        }
      </div>
    ) : (
      <div
        className={classnames(stylesFont.fontContent, stylesFont.colorEditLightBlack)}>
        <span>{this.props.i18nUIString.catalog["descript_Unit_Primer"][2]}</span>
      </div>
    )
  }

  _handleClick_Primerhref(event){
    event.preventDefault();
    event.stopPropagation();
    if(!this.props.location.pathname.includes('explore/unit')){
      // the browser, which do not know the origin it has was modified, need to be modified again to have the pratical history
      window.history.replaceState(this.props.location.state, '', this.props.location.pathname+this.props.location.search);
    };
    //and Notice! history should be pushed after the replaceState has been done
    let urlParams = new URLSearchParams(this.props.location.search);
    urlParams.set('unitId', this.props.unitCurrent.primer.primerId);
    urlParams.set('unitView', "theater");
    this.props.history.push({
      pathname: this.props.match.path, //should always be ".../unit" because primer only used in a Unit
      search: urlParams.toString(),
      state: {from: this.props.location}
    });

  }

  _set_UnitCurrentPrimer(){
    //First, this is a token based req in a token free allowed comp.
    if( !window.localStorage['token'] ) return;

    const self = this;
    this.setState({axios: true});

    _axios_getUnitPrimer(this.axiosSource.token, this.props.unitCurrent.unitId)
    .then((resObj)=>{
      self.props._submit_UsersList_new([resObj.main.authorId]); //still, get the user info
      self.props._set_store_UnitCurrent({ //pass the info about primer to redux state
        primer: {primerId: resObj.main.exposedId, authorPrimer: resObj.main.authorId}
      });
      // here we have next step to get the src of the cover img
      return _axios_getUnitSrc(self.axiosSource.token, resObj.main.exposedId);
    })
    .then((resObj)=>{
      self.setState({axios: false});
      self.props._set_store_UnitCurrent({ //pass the info about primer to redux state
        primerSrc: resObj.main['pic_layer0']
      });
    })
    .catch(function (thrown) {
      self.setState({axios: false});
      if (axios.isCancel(thrown)) {
        cancelErr(thrown);
      } else {
        let message = uncertainErr(thrown);
        if(message) alert(message);
      }
    });
  }

  _handleEnter_primerLine(e){
    this.setState({onPrimerLine: true})
  }

  _handleLeave_primerLine(e){
    this.setState({onPrimerLine: false})
  }

}

const mapStateToProps = (state) => {
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    unitCurrent: state.unitCurrent,
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {
    _submit_UsersList_new: (arr) => { dispatch(handleUsersList(arr)); },
    _set_store_UnitCurrent: (obj)=>{dispatch(setUnitCurrent(obj));}
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Primer);
