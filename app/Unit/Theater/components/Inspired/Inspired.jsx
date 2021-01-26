import React from 'react';
import {
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import ModalEmit from '../../../../Components/ModalEmit/ModalEmit.jsx';
import {SvgBulbInspired} from '../../../../Components/Svg/SvgBulb.jsx';
import {
  cancelErr,
  uncertainErr
} from '../../../../utils/errHandlers.js';

class Inspired extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      emit: false,
      emitTimeOut: false,
      inspired: false,
      mouseOn: false
    };
    this.axiosSource = axios.CancelToken.source();
    this._set_emitModal = this._set_emitModal.bind(this);
    this._handleEnter_Btn = this._handleEnter_Btn.bind(this);
    this._handleLeave_Btn = this._handleLeave_Btn.bind(this);
    this._handleClick_Inspired = this._handleClick_Inspired.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {
    if(
      this.props.unitCurrent.unitId.length > 0 && // basically, should always 'true', because we render this component 'after' the unitCurrent was set
      (this.props.tokenStatus!= 'invalid' && this.props.tokenStatus != 'lack') // not going to fetch if false
    ){
      const self = this;
      this.setState({axios: true});

      _axios_GET_Isnpired(this.axiosSource.token,  this.props.unitCurrent.unitId)
      .then((resObj)=>{
        // res incl. inspiredify, set state by it directly
        self.setState({
          axios: false,
          inspired: resObj.main.inspiredify
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
    };
  }

  componentWillUnmount() {
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    return(
      <div
        className={classnames(styles.comInspired)}>
          <div
            title={this.props.i18nUIString.catalog["tagTitle_Unit_Inspired"]}
            className={classnames(styles.boxSvgIcon)}
            onMouseEnter={this._handleEnter_Btn}
            onMouseLeave={this._handleLeave_Btn}
            onClick={this._handleClick_Inspired}>
            <SvgBulbInspired
              bulbPattern={this.state.inspired ? 'delight': 'dark'}
              mouseReact={this.state.mouseOn}/>
          </div>
        {
          this.state.emit &&
          <div
            className={classnames(styles.boxModalEmit)}>
            <ModalEmit
              text={this.state.emit.text} />
          </div>
        }

      </div>
    )
  }

  _set_emitModal(){
    this.setState({
      emitTimeOut: true,
      emit: { text: this.state.inspired ? this.props.i18nUIString.catalog["message_Unit_InspiredModal"] : this.props.i18nUIString.catalog["submit_removed"]}
    });
    this.modalTimeOut = setTimeout(()=>{
      this.setState((prevState, props)=>{
        return {
          emitTimeOut: false,
          emit:false
        }
      })
    }, 2200)
  }

  _handleClick_Inspired(event){
    event.preventDefault();
    event.stopPropagation();
    if(this.props.tokenStatus== 'invalid' || this.props.tokenStatus == 'lack'){
      this.props._set_noTokenDialog("inspired");
      return; // stop here
    };

    const self = this;
    // and to ensure the 'emitModal' mount again, reset state before set emit text
    if(this.state.emitTimeOut) clearTimeout(this.modalTimeOut);
    this.setState({
      axios: true,
      emitTimeOut: false,
      emit: false
    });

    _axios_POST_Isnpired(this.axiosSource.token,  this.props.unitCurrent.unitId)
    .then((resObj)=>{
      // only knew success or not
      // get the current state again immediately
      return _axios_GET_Isnpired(self.axiosSource.token,  self.props.unitCurrent.unitId)
    })
    .then((resObj)=>{
      // res incl. inspiredify, set state by it directly
      self.setState((state, props)=>{
        return {
          axios: false,
          inspired: resObj.main.inspiredify
        };
      }, ()=>{
        self._set_emitModal();
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

  _handleEnter_Btn(e){
    this.setState((prevState, props)=>{
      // make sure everything was re-set
      if(this.state.emitTimeOut) clearTimeout(this.modalTimeOut);
      return {emit: false, emitTimeOut: false};
    }, ()=>{
      this.setState({
        emit: { text: this.props.i18nUIString.catalog["message_Unit_Inspired"] },
        mouseOn: true
      });
    });
  }

  _handleLeave_Btn(e){
    this.setState((prevState, props)=>{
      let timeOutDepend = prevState.emitTimeOut ? {} : {emit: false};
      let nextState = Object.assign({
        mouseOn: false
      }, timeOutDepend);

      return nextState;
    });
  }

}

const _axios_GET_Isnpired = (cancelToken, unitId)=>{
  return axios({
    method: 'get',
    url: '/router/inspired',
    params: {
      unitId: unitId
    },
    headers: {
      'charset': 'utf-8',
      'token': window.localStorage['token']
    },
    cancelToken: cancelToken
  }).then(function (res) {
    let resObj = JSON.parse(res.data);

    return resObj;
  }).catch(function (thrown) {
    throw thrown;
  });
};

const _axios_POST_Isnpired = (cancelToken, unitId)=>{
  return axios({
    method: 'post',
    url: '/router/inspired',
    params: {
      unitId: unitId
    },
    headers: {
      'charset': 'utf-8',
      'token': window.localStorage['token']
    },
    cancelToken: cancelToken
  }).then(function (res) {
    let resObj = JSON.parse(res.data);

    return resObj;
  }).catch(function (thrown) {
    throw thrown;
  });
};


const mapStateToProps = (state)=>{
  return {
    tokenStatus: state.token,
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    unitCurrent: state.unitCurrent,
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Inspired));
