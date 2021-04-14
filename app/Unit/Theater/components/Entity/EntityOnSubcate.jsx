import React from 'react';
import {
  Link,
  Switch,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import {
  _axios_get_unitSubCate
} from './axios.js';
import VisitRegister from '../VisitRegister/VisitRegister.jsx';
import {
  cancelErr,
  uncertainErr
} from '../../../../utils/errHandlers.js';
import {
  SvgArrowToRight
} from '../../../../Components/Svg/SvgArrow.jsx';

class EntityOnSubcate extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      next_confirm: false,
      next_unit: null,
      onbtnNext: false
    };
    this.axiosSource = axios.CancelToken.source();
    this._set_unitSubCate = this._set_unitSubCate.bind(this);
    this._handleClick_SubcateNext = this._handleClick_SubcateNext.bind(this);
    this._handleEnter_btnNext = this._handleEnter_btnNext.bind(this);
    this._handleLeave_btnNext = this._handleLeave_btnNext.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if(
      (this.props.unitCurrent.unitId != prevProps.unitCurrent.unitId) &&
      !!this.props.unitCurrent.unitId
    ) {
      // reset state
      this.setState({
        axios: false,
        next_confirm: false,
        next_unit: null,
        onbtnNext: false
      });
      this._set_unitSubCate();
    };
  }

  componentDidMount(){
    if(!!this.props.unitCurrent.unitId) this._set_unitSubCate();
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    return(
      <div
        className={classnames(styles.comEntitySubcate)}>
        <div
          className={classnames(styles.boxVisitRegister)}>
          <VisitRegister
            {...this.props}/>
        </div>
        {
          this.state.next_confirm &&
          <Link
            to={''}
            onClick={this._handleClick_SubcateNext}
            className={classnames('plainLinkButton', styles.linkBtnNext)}
            onTouchStart={this._handleEnter_btnNext}
            onTouchEnd={this._handleLeave_btnNext}
            onMouseEnter={this._handleEnter_btnNext}
            onMouseLeave={this._handleLeave_btnNext}
            style={this.state.onbtnNext ? {boxShadow: "0 0 5px -1px inset #fff8f7"} : {}}>
            <div
              style={{width: "30px", height: "18px", textAlign: 'center'}}>
              <SvgArrowToRight
                mouseOn={this.state.onbtnNext}
                customStyles={{fillColorMouseOn: '#FFFFFF', fillColor: '#d8d8d8'}}/>
            </div>
          </Link>
        }
      </div>
    )
  }

  _set_unitSubCate(){
    const self = this;
    this.setState({axios: true});

    _axios_get_unitSubCate(this.axiosSource.token, {
      unitId: this.props.unitCurrent.unitId,
      // only PathProject has subCate now, so keep these params simple, but ready for future scale
      subCateId: this.props.unitEntity.pathSubCate.currentSubCateId,
      subCateParent: 'pathProject'
    })
    .then((resObj)=>{
      self.setState((prevState, props)=>{
        return {
          axios: false,
          next_confirm: resObj.main.confirm,
          next_unit: resObj.main.serial_unit.nextUnit
        };
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

  _handleClick_SubcateNext(event){
    event.preventDefault();
    event.stopPropagation();
    if(!this.props.location.pathname.includes('explore/unit')){
      // the browser, which do not know the origin it has was modified, need to be modified again to have the pratical history
      window.history.replaceState(this.props.location.state, '', this.props.location.pathname+this.props.location.search);
    };
    //and Notice! history should be pushed after the replaceState has been done
    let urlParams = new URLSearchParams(this.props.location.search);
    urlParams.set('unitId', this.state.next_unit);
    urlParams.set('unitView', "theater");
    this.props.history.push({
      pathname: this.props.match.path, //should always be ".../unit" because we are always in a Unit here
      search: urlParams.toString(),
      state: {from: this.props.location}
    });
  }

  _handleEnter_btnNext(e){
    this.setState({onbtnNext: true})
  }

  _handleLeave_btnNext(e){
    this.setState({onbtnNext: false})
  }

}


const mapStateToProps = (state)=>{
  return {
    tokenStatus: state.token,
    i18nUIString: state.i18nUIString,
    unitCurrent: state.unitCurrent,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(EntityOnSubcate));
