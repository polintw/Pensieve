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
import UnitUnsign from '../../../Unit/UnitUnsign/UnitUnsign.jsx';
import {
  initAround
} from '../../../redux/states/statesWithin.js';
import {
  setIndexList,
} from "../../../redux/actions/within.js";

class Wrapper extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
    };
    this.axiosSource = axios.CancelToken.source();
    this._render_FooterHint = this._render_FooterHint.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){

  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
    //clear & reset to init when Unmount, make sure the list would not render anything when retrun to index
    this.props._set_IndexLists(initAround.indexLists);
  }

  _render_FeedNails(listChoice){
    let groupsDOM = [];
    const _nailsGroup = (unitGroup, groupIndex)=>{
      let nailsDOM = [];
      unitGroup.forEach((unitId, index) => {
        //render if there are something in the data
        if( !(unitId in this.state.unitsBasic)) return; //skip if the info of the unit not yet fetch
        // for mobile device, use one special Nail
        let cssVW = window.innerWidth;
        if(cssVW < 860) {
          nailsDOM.push(
            <div
              key={"key_FeedAssigned_new_" + index}
              className={classnames(stylesNail.boxNail, stylesNail.custNailWide)}>
              <NailFeedMobile
                {...this.props}
                leftimg={false}
                unitId={unitId}
                linkPath={this.props.location.pathname + ((this.props.location.pathname == '/') ? 'unit' : '/unit')}
                unitBasic={this.state.unitsBasic[unitId]}
                marksBasic={this.state.marksBasic} />
            </div>
          );
          return;
        };
        // for laptop / desktop, change nail by cycles
        let remainder3 = index % 3,
        remainder2 = index % 2; // cycle, but every 3 units has a wide, left, right in turn.

        nailsDOM.push (remainder3 ? ( // 0 would be false, which means index % 3 =0
          <div
            key={"key_FeedAssigned_new_"+index}
            className={classnames(stylesNail.boxNail)}>
            <NailFeed
              {...this.props}
              unitId={unitId}
              linkPath={this.props.location.pathname + ((this.props.location.pathname == '/') ? 'unit' : '/unit')}
              unitBasic={this.state.unitsBasic[unitId]}
              marksBasic={this.state.marksBasic}/>
          </div>
        ): (
          <div
            key={"key_FeedAssigned_new_"+index}
            className={classnames(stylesNail.boxNail, stylesNail.custNailWide)}>
            <NailFeedWide
              {...this.props}
              leftimg={ remainder2 ? true : false}
              unitId={unitId}
              linkPath={this.props.location.pathname + ((this.props.location.pathname == '/') ? 'unit' : '/unit')}
              unitBasic={this.state.unitsBasic[unitId]}
              marksBasic={this.state.marksBasic}/>
          </div>
        ));
      });
      if(listChoice=="unread" && (groupIndex+1)==this.props.indexLists.listUnread.length){ //sepcial handler for last round of listUnread
        if(this.props.indexLists.listBrowsed.length ==0){ // should add hint at a special condition: no browsed item, means no followed units after the last round
          nailsDOM.push(
            <div
              className={classnames(styles.boxDescript, stylesFont.fontTitleSmall, stylesFont.colorLightGrey)}>
              {this.props.i18nUIString.catalog['title_FeedAssigned_AllRead']}</div>
          );
        }
        else if( ((nailsDOM.length % 3) == 2) && this.props.indexLists.listBrowsed.length !=0){ // only happend if the last one was a 'lonely' one, not good looking
          nailsDOM.splice(-1, 1);
        };
      };
      if(listChoice=="browsed" && groupIndex==0 && nailsDOM.length > 0) nailsDOM.splice(1, 0, ( // 'You've all browsed' at the second place of listbrowsed
        <div
          className={classnames(styles.boxDescript, stylesFont.fontTitleSmall, stylesFont.colorLightGrey)}>
          {this.props.i18nUIString.catalog['title_FeedAssigned_AllRead']}</div>
      ));

      return nailsDOM;
    };
    let renderList = (listChoice=="unread") ? this.props.indexLists.listUnread : this.props.indexLists.listBrowsed;
    renderList.forEach((unitGroup, index)=>{
      groupsDOM.push(
        <div
          className={classnames(
            styles.boxModule,
            styles.boxModuleSmall,
          )}>
          {_nailsGroup(unitGroup, index)}
        </div>
      );
    });

    return groupsDOM;
  }

  render(){
    return(
      <div>
        <div
          className={classnames(styles.comAroundWrapper)}>
          <div
            className={classnames(styles.boxRow, styles.boxRowTop)}>

            <div
              className={classnames(styles.comChain)}>
              <div
                className={classnames(styles.boxFullWide)}
                style={{margin: '4px 0'}}>
                <div>
                  <div
                    className={classnames(styles.boxSharedTitle)}>
                    <span
                      className={classnames("fontContentPlain", "weightBold", "colorAssistGold")}>
                      {this.props.i18nUIString.catalog["title_Chain_Shareds_"]}</span>
                  </div>
                  <div
                    className={classnames(styles.boxSharedsDisplay)}>
                    <div
                      className={classnames(styles.boxModuleShareds)}>

                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
          <div
            className={classnames(styles.boxRow)}>

            <div
              className={classnames(styles.comNavFeed, styles.boxTitle)}>
              <div
                style={{display:'flex'}}>
                <div
                  topath={"gathering"}>
                  <span
                    className={classnames(
                      "fontContentPlain", "weightBold", "colorAssistGold")}>
                    {this.props.i18nUIString.catalog["title_FeedAssigned_"] }
                  </span>
                </div>
              </div>
            </div>

            {this._render_FeedNails()}
          </div>
          <div
            className={classnames(styles.boxRow, styles.boxFooter)}>
            {this._render_FooterHint()}
          </div>
        </div>

        <Route
          path={((this.props.location.pathname =="/") ? '' : this.props.location.pathname.slice(0, -5))+ '/unit' }
          render={(props)=> {
            return (
              <UnitUnsign {...props} _refer_von_unit={this.props._refer_to}/>
            )
          }
        }/>
      </div>
    )
  }

  _render_FooterHint(){
    return (
      <span
        className={classnames(styles.spanFooterHint, "fontTitleSmall", "colorLightGrey")}>
        {this.props.i18nUIString.catalog['descript_AroundIndex_footer']}</span>
    );
  }
}


const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    indexLists: state.indexLists,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _set_IndexLists: (obj) => { dispatch(setIndexList(obj)); },
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Wrapper));
