import React from 'react';
import {
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import stylesFont from '../stylesFont.module.css';
import BelongSet from './BelongSet.jsx';
import {
  _axios_PATCH_belongRecords
} from '../Index/BelongsSet/utils.js';
import {
  cancelErr,
  uncertainErr
} from "../../../utils/errHandlers.js";

class Wrapper extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axiosPatch: false,
      nodesBasic: {},
      belongs: { homeland: false, residence: false}
    };
    this.axiosSource = axios.CancelToken.source();
    this._set_nodesByTypes = this._set_nodesByTypes.bind(this);
    this._handleClick_onBoardSubmit = this._handleClick_onBoardSubmit.bind(this);
  }

  _set_nodesByTypes(nodeBasic, type){
    this.setState((prevState, props)=>{
      //create obj to fit the format of state
      let updatedBasic= Object.assign({}, prevState.nodesBasic);
      /*
      2 conditions: update a new one, or delete the current one.
      we start from the deleted one.
      */
      if(!nodeBasic){
        prevState.belongs[type] = false;
      }
      else{
        let insertObj = {};
        insertObj[nodeBasic.id] = nodeBasic;
        updatedBasic = Object.assign({}, prevState.nodesBasic, insertObj);
        // then put the node into 'belongs' by type
        prevState.belongs[type] = nodeBasic.id;
      }

      return {
        nodesBasic: updatedBasic,
        belongs: prevState.belongs
      }
    })
  }

  _handleClick_onBoardSubmit(event){
    event.preventDefault();
    event.stopPropagation();
    //most important, check if we were under patching
    if(this.state.axiosPatch) return;

    //check if any belong was input
    if(!!this.state.belongs.homeland || !!this.state.belongs.residence){
      let belongsKeys = Object.keys(this.state.belongs);
      let patchPromises = belongsKeys.map((key)=>{
        // we alloweduser submit only one node, so ignore unset category
        if(!this.state.belongs[key]) return ()=>{Promise.resolve()};
        let submitObj = {
          category: key,
          nodeId: this.state.belongs[key]
        };
        return new Promise((resolve, reject) => _axios_PATCH_belongRecords(this.axiosSource.cancelToken, submitObj).then((resObj)=>resolve(resObj)).catch((err)=> reject(err)) );
      });

      const self = this;
      self.setState({ axiosPatch: true });

      Promise.all(patchPromises)
      .then(function (results) {
        //successfully updated,
        self.setState({ axiosPatch: false });
        // now reload the page to fetch the new belongs set
        window.location.reload();

      }).catch(function (thrown) {
        self.setState({ axiosPatch: false });
        if (axios.isCancel(thrown)) {
          cancelErr(thrown);
        } else {
          let message = uncertainErr(thrown);
          if (message) alert(message);
        }
      });

    }

  }

  componentDidMount() {

  }

  componentWillUnmount(){
    if (this.state.axiosPatch) {
      this.axiosSource.cancel("component will unmount.")
    }
  }


  render(){
    let submitBlocked = (!(this.state.belongs['homeland'] || this.state.belongs['residence']) || this.state.axiosPatch) ? true:false;

    return(
      <div
        className={styles.comOnBoardWrapper}>
        <div
          className={classnames(styles.boxRelativeRow, styles.rowTop)}>
          <div className={classnames(styles.boxLogo)}></div>
        </div>
        <div
          className={classnames(styles.boxRelativeRow, styles.rowGreet)}>
          <div
            className={classnames(styles.boxFlexColumn, styles.boxGreet)}>
            <div
              className={classnames(styles.boxGreetTitle)}>
              <span
                className={classnames(stylesFont.fontTitle, stylesFont.colorCoral)}
                style={{ marginRight: "0.87rem" }}>
                {this.props.i18nUIString.catalog["title_onBoard_Welcome"]}
              </span>
              <span
                className={classnames(stylesFont.fontTitle, stylesFont.colorCoral)}>
                {this.props.userInfo.firstName + "!"}
              </span>
            </div>
            <div
              className={classnames(styles.boxGreetContent, styles.boxFlexColumn)}>
              <span
                className={classnames(stylesFont.fontDescrip, styles.colorDescripBlack)}
                style={{ lineHeight: 1.88 }}>
                {this.props.i18nUIString.catalog["descript_onBoard_Intro"][0]}
              </span>
              <span
                className={classnames(stylesFont.fontDescrip, styles.colorDescripBlack)}
                style={{ lineHeight: 1.88 }}>
                {this.props.i18nUIString.catalog["descript_onBoard_Intro"][1]}
              </span>
            </div>
          </div>
        </div>
        <div
          className={classnames(styles.boxRelativeRow, styles.rowForm)}>
          <div
            className={classnames(styles.boxFlexColumn, styles.boxForm)}>
            <div
              className={classnames(styles.boxFormSubTitle)}>
              <span
                className={classnames(stylesFont.fontDescrip, stylesFont.colorDescripBlack)}
                style={{ lineHeight: 1.88 }}>
                {this.props.i18nUIString.catalog["descript_onBoard_BelongsHint"][0]}
              </span>
            </div>
            <div
              className={classnames(styles.boxFormTitle)}>
              <span
                className={classnames(stylesFont.fontTitleNotice, stylesFont.colorNoticeBlack)}>
                {this.props.i18nUIString.catalog["descript_onBoard_BelongsHint"][1]}
              </span>
            </div>
            <div
              className={classnames(styles.boxFlexColumn, styles.boxFormBelongs)}>

              <div
                className={classnames(styles.boxFormBelongsRow)}
                style={{marginBottom: "2.19vh"}}>
                <span
                  className={classnames(styles.spanFormBelongsType, stylesFont.fontDescrip ,stylesFont.colorDescripBlack, stylesFont.weightBold)}
                  style={{lineHeight: "1.5"}}>
                  {this.props.i18nUIString.catalog["category_Belongs_"][0]}
                </span>
                <span
                  className={classnames(styles.spanFormBelongsDescrip, stylesFont.fontDescrip ,stylesFont.colorDescripBlack)}
                  style={{lineHeight: "1.5"}}>
                  {this.props.i18nUIString.catalog["guideing_onBoard_BelongsHint"][0]}
                </span>
                <div
                  className={classnames(styles.boxFormBelongSet)}>
                  <BelongSet
                    belongs={this.state.belongs}
                    settingType={"homeland"}
                    nodesBasic= {this.state.nodesBasic}
                    _set_nodesByTypes={this._set_nodesByTypes}/>
                </div>
              </div>
              <div
                className={classnames(styles.boxFormBelongsRow)}>
                <span
                  className={classnames(styles.spanFormBelongsType, stylesFont.fontDescrip ,stylesFont.colorDescripBlack, stylesFont.weightBold)}
                  style={{lineHeight: "1.5"}}>
                  {this.props.i18nUIString.catalog["category_Belongs_"][1]}
                </span>
                <span
                  className={classnames(styles.spanFormBelongsDescrip, stylesFont.fontDescrip ,stylesFont.colorDescripBlack)}
                  style={{lineHeight: "1.5"}}>
                  {this.props.i18nUIString.catalog["guideing_onBoard_BelongsHint"][1]}
                </span>
                <div
                  className={classnames(styles.boxFormBelongSet)}>
                  <BelongSet
                    belongs={this.state.belongs}
                    settingType={"residence"}
                    nodesBasic={this.state.nodesBasic}
                    _set_nodesByTypes={this._set_nodesByTypes} />
                </div>
              </div>

            </div>

          </div>
        </div>
        <div
          className={classnames(styles.boxRelativeRow, styles.rowButton)}>
          <div
            className={classnames(
              styles.boxButton,
              {[styles.boxButtonBlocked]: submitBlocked}
            )}
            onClick={this._handleClick_onBoardSubmit}>
            <span
              className={classnames(
                stylesFont.fontSubmit ,
                stylesFont.colorWhite)}>
              {this.props.i18nUIString.catalog["submit_onBoard_next"]}
            </span>
          </div>
        </div>

      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
  }
}

export default withRouter(connect(
  mapStateToProps,
  null
)(Wrapper));
