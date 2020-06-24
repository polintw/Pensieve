import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import stylesFont from '../../stylesFont.module.css';
import ImgPreview from '../../../../Components/ImgPreview.jsx';
import {
  submitSharedsList
} from "../../../../redux/actions/within.js";
import {
  handleNounsList,
  handleUsersList,
} from "../../../../redux/actions/general.js";
import {
  cancelErr,
  uncertainErr
} from "../../../../utils/errHandlers.js";
import {axios_get_UnitsBasic} from '../../../../utils/fetchHandlers.js';
import {
  domain
} from '../../../../../config/services.js';

class ChainShared extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      onNail: false,
      unitsBasic: {}
    };
    this.axiosSource = axios.CancelToken.source();
    this._axios_get_shareds = this._axios_get_shareds.bind(this);
    this._set_nails_shareds = this._set_nails_shareds.bind(this);
    this._render_sharenails = this._render_sharenails.bind(this);
    this._handleEnter_sharedNail = this._handleEnter_sharedNail.bind(this);
    this._handleLeave_sharedNail = this._handleLeave_sharedNail.bind(this);
  }

  _handleEnter_sharedNail(e){
    this.setState({onNail: e.currentTarget.getAttribute('unitid')})
  }

  _handleLeave_sharedNail(e){
    this.setState({onNail: false})
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    //monitor flag for this comp.
    if(this.props.flagChainFetRespond && this.props.flagChainFetRespond != prevProps.flagChainFetRespond) this._set_nails_shareds();
  }

  componentDidMount() {
    this._set_nails_shareds();
  }

  componentWillUnmount() {
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    return(
      <div>
        <span
          className={classnames(stylesFont.fontHint, stylesFont.weightBold, stylesFont.colorAssistGold)}
          style={{marginBottom: '12px', width: '100%', display: 'block'}}>
          {this.props.i18nUIString.catalog["title_Chain_Shareds_"]}</span>
        <div
          className={classnames(styles.boxModuleShareds)}>
          {this._render_sharenails()}

        </div>
      </div>
    )
  }

  _render_sharenails(){
    const self = this;
    let listDOM = this.props.sharedsList.list.map((unitId, index)=>{
      if( !(unitId in self.state.unitsBasic)) return null; //check if unitsBasic was prepared.

      let imgSrcCover = 'https://' + domain.name +'/router/img/'+self.state.unitsBasic[unitId].pic_layer0+'?type=thumb';
      let linkSearch = ((self.props.location.search.length > 0) ? self.props.location.search+'&' : '?') +'unitId='+unitId+'&unitView=theater';
      return (
        <Link
          key={"key_SharedNails_"+index}
          unitid={unitId}
          to={{
            pathname: this.props.location.pathname + ((this.props.location.pathname == '/') ? 'unit' : '/unit'),
            search: linkSearch,
            state: {from: this.props.location}
          }}
          className={classnames(
            'plainLinkButton',
            styles.boxImg,
            {[styles.boxImgMouseOn]: (this.state.onNail == unitId)}
          )}
          onMouseEnter={this._handleEnter_sharedNail}
          onMouseLeave={this._handleLeave_sharedNail}>
          <ImgPreview
            blockName={''}
            previewSrc={ imgSrcCover }
            _handleClick_ImgPreview_preview={()=>{}}/>
          {
            (this.state.onNail == unitId) &&
            <div
              className={classnames(styles.mouseOnImg)}>
              <ImgPreview
                blockName={''}
                previewSrc={ imgSrcCover }
                _handleClick_ImgPreview_preview={()=>{}}/>
            </div>
          }
        </Link>
      )
    });

    if(this.props.sharedsList.list.length == 0){
      listDOM.push(
        <div
          key={"key_SharedNails_emptyHint"}
          style={{width: '100%', height: '51px', minHeight: '4.1vw', display: 'flex', justifyContent: 'center', alignItems: 'center'}/* follow styles.boxImg*/}>
          <span
            className={classnames(stylesFont.fontTitleSmall, stylesFont.colorGrey)}>
            {this.props.i18nUIString.catalog["message_Chain_noShareds"]}
          </span>
        </div>
      )
    }

    return listDOM;
  }

  _set_nails_shareds(){
    const self = this;
    this.setState({axios: true});

    this._axios_get_shareds()
    .then((resObj)=>{
      // shareds list was saved in redux state
      self.props._submit_list_Shareds({
        list: resObj.main.unitsList
      });

      return axios_get_UnitsBasic(self.axiosSource.token, resObj.main.unitsList) //and use the list to get the data of eahc unit
    })
    .then((resObj)=>{
      //after res of axios_Units: call get nouns & users
      self.props._submit_NounsList_new(resObj.main.nounsListMix);
      self.props._submit_UsersList_new(resObj.main.usersList);
      //and final, update the data of units to state
      self.setState((prevState, props)=>{
        return ({
          axios: false,
          unitsBasic: {...prevState.unitsBasic, ...resObj.main.unitsBasic},
          //marksBasic: {...prevState.marksBasic, ...resObj.main.marksBasic}: we don't really need this part in this comp.
        });
      });

    }).catch(function (thrown) {
      if (axios.isCancel(thrown)) {
        cancelErr(thrown);
      } else {
        self.setState((prevState, props)=>{
          return {axios:false}
        }, ()=>{
          let message = uncertainErr(thrown);
          if(message) alert(message);
        });
      }
    });
  }

  _axios_get_shareds(){
    return axios.get('/router/share/accumulated', {
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      },
      cancelToken: this.axiosSource.token
    }).then(function (res) {
      let resObj = JSON.parse(res.data); //still parse the res data prepared to be used below
      return resObj;
    }).catch(function (thrown) {
      throw thrown;
    });
  }

}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    sharedsList: state.sharedsList,
    flagChainFetRespond: state.flagChainFetRespond
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_NounsList_new: (arr) => { dispatch(handleNounsList(arr)); },
    _submit_UsersList_new: (arr) => { dispatch(handleUsersList(arr)); },
    _submit_list_Shareds: (obj) => { dispatch(submitSharedsList(obj)); }
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(ChainShared));
