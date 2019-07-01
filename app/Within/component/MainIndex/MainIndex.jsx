import React from 'react';
import {
  Link,
  Redirect,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./stylesMainIndex.module.css";
import Unit from '../../../Component/Unit.jsx';
import CreateShare from '../../../Component/CreateShare.jsx';
import DateConverter from '../../../Component/DateConverter.jsx';
import SvgLogo from '../../../Component/Svg/SvgLogo.jsx';
import SvgCreate from '../../../Component/Svg/SvgCreate.jsx';
import NailThumb from '../../../Component/Nails/NailThumb/NailThumb.jsx';
import NailFlatDisplay from '../../../Component/Nails/NailFlatDisplay/NailFlatDisplay.jsx';
import NailWideDisplay from '../../../Component/Nails/NailWideDisplay/NailWideDisplay.jsx';
import {
  handleNounsList,
  handleUsersList
} from "../../../redux/actions/general.js";
import {
  cancelErr,
  uncertainErr
} from '../../../utils/errHandlers.js';

const styleMiddle = {
  boxFooterInfo: {
    boxSizing: 'border-block',
    margin: '4.2rem 0 1.6rem',
    padding: '2rem 1.2rem 0',
    color: '#ababab'
  },
  spanFooterInfo: {
    display: 'inline-block',
    boxSizing: 'border-block',
    marginRight: '0.42rem'
  },
  textFooterInfo: {
    fontSize: '1.21rem',
    letterSpacing: '0.1rem',
  }
}

class MainIndex extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      unitsList: [],
      unitsBasic: {},
      marksBasic: {},
    };
    this.axiosSource = axios.CancelToken.source();
    this._axios_cosmic_IndexList = this._axios_cosmic_IndexList.bind(this);
    this._construct_UnitInit = this._construct_UnitInit.bind(this);
    this._render_IndexNails = this._render_IndexNails.bind(this);
    this.style={
      withinCom_MainIndex_scroll_: {
        width: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box'
      },
      withinCom_MainIndex_scroll_col_footer: {
        display: 'inline-block',
        width: '100%',
        height: '14vh',
        position: 'relative',
        boxSizing: 'border-box'
      },
      withinCom_MainIndex_scroll_col_Create: {
        display: 'inline-block',
        width: '99px',
        height: '28%',
        position: 'relative',
        boxSizing: 'border-box',
        margin: '0 3%',
        float: 'right'
      },
      withinCom_MainIndex_scroll_col_logo: {
        display: 'inline-block',
        height: '28%',
        position: 'relative',
        top: '3%',
        boxSizing: 'border-box',
        margin: '0px 50% 24px 19%'
      }
    }
  }

  _construct_UnitInit(match, location){
    let unitInit= {marksify: false, initMark: "all", layer: 0};
    return unitInit;
  }

  _submit_Share_New(dataObj){
    window.location.assign('/user/cognition/actions/shareds');
  }

  _axios_cosmic_IndexList(){
    const self = this;

    this.setState((prevState, props)=>{return {axios: true};}, ()=>{
      let url = '/router/cosmic/present';
      axios.get(url, {
        headers: {
          'charset': 'utf-8',
          'token': window.localStorage['token']
        },
        cancelToken: self.axiosSource.token
      }).then(function (res) {

        let resObj = JSON.parse(res.data);
        self.props._submit_NounsList_new(resObj.main.nounsListMix);
        self.props._submit_UsersList_new(resObj.main.usersList);

        self.setState((prevState, props)=>{
          return({
            axios: false,
            unitsList: resObj.main.unitsList,
            unitsBasic: resObj.main.unitsBasic,
            marksBasic: resObj.main.marksBasic
          });
        });
      }).catch(function (thrown) {
        self.setState({axios: false});
        if (axios.isCancel(thrown)) {
          cancelErr(thrown);
        } else {
          let message = uncertainErr(thrown);
          if(message) alert(message);
        }
      });
    })
  }

  componentDidMount(){
    this._axios_cosmic_IndexList();
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  _render_IndexNails(){
    this.patternRule = [[0,1],[1,0],2,2,1,1,1];
    let cycleLength = this.patternRule.length;

    const nailChart = (choice, unitId)=>{
      switch (choice) {
        case 0:
          return (
            <div
              key={'key_CosmicMain_Nails_'+unitId}
              className={classnames(styles.heightNarrow, styles.boxWide)}>
              <NailWideDisplay
                {...this.props}
                unitId={unitId}
                unitBasic={this.state.unitsBasic[unitId]}
                marksBasic={this.state.marksBasic}/>
            </div>
          )
          break;
        case 1:
          return (
            <div
              key={'key_CosmicMain_Nails_'+unitId}
              className={classnames(styles.heightNarrow, styles.boxNarrow)}>
              <NailThumb
                {...this.props}
                unitId={unitId}
                unitBasic={this.state.unitsBasic[unitId]}
                marksBasic={this.state.marksBasic}/>
            </div>
          )
          break;
        case 2:
          return (
            <div
              key={'key_CosmicMain_Nails_'+unitId}
              className={classnames(styles.heightFlat, styles.boxFlat)}>
              <div
                key={'key_CosmicMain_Nails_'+unitId}
                className={classnames(styles.heightNarrow, styles.boxNarrow)}>
                <NailFlatDisplay
                  {...this.props}
                  unitId={unitId}
                  unitBasic={this.state.unitsBasic[unitId]}
                  marksBasic={this.state.marksBasic}/>
              </div>
            </div>
          )
          break;
        default:
          return (
            <div
              key={'key_CosmicMain_Nails_'+unitId}
              className={classnames(styles.heightNarrow, styles.boxNarrow)}>
              <div
                key={'key_CosmicMain_Nails_'+unitId}
                className={classnames(styles.heightNarrow, styles.boxNarrow)}>
                <NailThumb
                  {...this.props}
                  unitId={unitId}
                  unitBasic={this.state.unitsBasic[unitId]}
                  marksBasic={this.state.marksBasic}/>
              </div>
            </div>
          )
      }
    };
    const separationLine = (remainder, index)=>{
      switch (remainder) {
        case 0:
          return (
            <div
              key={'key_CosmicMain_NailsSparation_'+index}
              className={classnames(styles.decoVertical, styles.heightNarrow)}>

            </div>
          )
          break;
        case 1:
          return (
            <div
              key={'key_CosmicMain_NailsSparation_'+index}
              className={classnames(styles.decoHorizon)}>

            </div>
          )
          break;
        case 2:
          return (
            <div
              key={'key_CosmicMain_NailsSparation_'+index}
              className={classnames(styles.decoVertical, styles.heightFlat)}>

            </div>
          )
          break;
        default:
          return false
      }
    }

    let nailsIndex = []; //don't use .map() because we probably need to push twice in one round
    this.state.unitsList.forEach((unitId, index)=>{
      let remainder = index % cycleLength;
      let nailChoice = this.patternRule[remainder];
      if(remainder < 2) nailChoice = Number.isInteger(index/2) ? nailChoice[1] : nailChoice[0];

      let nail = nailChart(nailChoice, unitId);
      nailsIndex.push(nail);
      //diff remainder again for rendering 'separation line'
      let optionalLine = separationLine(remainder, index);
      if(optionalLine) nailsIndex.push(optionalLine);
    })

    return nailsIndex;
  }

  render(){
    let date = new Date();

    return(
      <div>
        <div
          style={this.style.withinCom_MainIndex_scroll_}>
          <div
            className={classnames(styles.boxTop)}>
            <div
              style={this.style.withinCom_MainIndex_scroll_col_logo}>
              <SvgLogo/>
            </div>
            <div
              className={'boxInlineRelative fontGillSN boxTopDate'}>
              <DateConverter
                place={'title'}
                datetime={date.getTime()}/>
            </div>
            <div
              style={this.style.withinCom_MainIndex_scroll_col_Create}>
              <SvgCreate
                place={false}/>
              <CreateShare
                _submit_Share_New={this._submit_Share_New}
                _refer_von_Create={this.props._refer_von_cosmic}/>
            </div>
          </div>
          <div
            className={styles.boxNails}>
            {this._render_IndexNails()}
            <div
              style={styleMiddle.boxFooterInfo}>
              <span style={Object.assign({}, styleMiddle.spanFooterInfo, styleMiddle.textFooterInfo)}>{"Cornerth."}</span>
              <br></br>
              <br></br>
              <span style={Object.assign({}, styleMiddle.spanFooterInfo, styleMiddle.textFooterInfo)}>{"about"}</span>
              <span style={Object.assign({}, styleMiddle.spanFooterInfo, styleMiddle.textFooterInfo)}>{"．"}</span>
              <span style={Object.assign({}, styleMiddle.spanFooterInfo, styleMiddle.textFooterInfo)}>{"contact"}</span>
              <span style={Object.assign({}, styleMiddle.spanFooterInfo, styleMiddle.textFooterInfo)}>{"．"}</span>
              <span style={Object.assign({}, styleMiddle.spanFooterInfo, styleMiddle.textFooterInfo)}>{"join"}</span>
            </div>
            <div style={this.style.withinCom_MainIndex_scroll_col_footer}></div>
          </div>
        </div>
        <Route
          path={this.props.match.path+"/units/:id"}
          render={(props)=> <Unit {...props} _construct_UnitInit={this._construct_UnitInit} _refer_von_unit={this.props._refer_von_cosmic}/>}/>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_NounsList_new: (arr) => { dispatch(handleNounsList(arr)); },
    _submit_UsersList_new: (arr) => { dispatch(handleUsersList(arr)); }
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(MainIndex));
