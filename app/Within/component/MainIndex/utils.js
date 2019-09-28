import React from 'react';
import classnames from 'classnames';
import styles from "./stylesMainIndex.module.css";
import NailThumb from '../../../Component/Nails/NailThumb/NailThumb.jsx';
import NailFlatDisplay from '../../../Component/Nails/NailFlatDisplay/NailFlatDisplay.jsx';
import NailWideDisplay from '../../../Component/Nails/NailWideDisplay/NailWideDisplay.jsx';

export function nailChart(choice, unitId, pare){
  switch (choice) {
    case 0:
      return (
        <div
          key={'key_CosmicMain_Nails_'+unitId}
          className={classnames(styles.boxNail, styles.heightNarrow, styles.boxWide)}>
          <NailWideDisplay
            {...pare.props}
            unitId={unitId}
            unitBasic={pare.state.unitsBasic[unitId]}
            marksBasic={pare.state.marksBasic}/>
        </div>
      )
      break;
    case 1:
      return (
        <div
          key={'key_CosmicMain_Nails_'+unitId}
          className={classnames(styles.boxNail, styles.heightNarrow, styles.boxNarrow)}>
          <NailThumb
            {...pare.props}
            unitId={unitId}
            unitBasic={pare.state.unitsBasic[unitId]}
            marksBasic={pare.state.marksBasic}/>
        </div>
      )
      break;
    case 2:
      let index = pare.state.unitsList.indexOf(unitId);
      //we render 2 Flat at once,
      //so the Id of second one, retrieve from original unitsList by current unitId's index
      return (
        <div
          className={classnames(styles.boxColumn)}>
          <div
            key={'key_CosmicMain_Nails_'+ unitId}
            className={classnames(styles.boxNail, styles.heightFlat, styles.boxFlat)}>
            <NailFlatDisplay
              {...pare.props}
              unitId={unitId}
              unitBasic={pare.state.unitsBasic[unitId]}
              marksBasic={pare.state.marksBasic}/>
          </div>
          <div
            key={'key_CosmicMain_Nails_'+pare.state.unitsList[(index+1)]}
            className={classnames(styles.boxNail, styles.heightFlat, styles.boxFlat)}>
            <NailFlatDisplay
              {...pare.props}
              unitId={pare.state.unitsList[(index+1)]}
              unitBasic={pare.state.unitsBasic[pare.state.unitsList[(index+1)]]}
              marksBasic={pare.state.marksBasic}/>
          </div>
        </div>
      )
      break;
    default:
      return (
        <div
          key={'key_CosmicMain_Nails_'+unitId}
          className={classnames(styles.heightNarrow, styles.boxNarrow)}>
          <NailThumb
            {...pare.props}
            unitId={unitId}
            unitBasic={pare.state.unitsBasic[unitId]}
            marksBasic={pare.state.marksBasic}/>
        </div>
      )
  }
};


export function separationLine(remainder, index){
  switch (remainder) {
    case 2:
      return (
        <div
          key={'key_CosmicMain_NailsSparation_'+index}
          className={classnames(styles.boxFillHoriz)}
          style={{height: '47px'}}></div>
      )
      break;
    case 4:
      return (
        <div
          key={'key_CosmicMain_NailsSparation_'+index}
          className={classnames(styles.boxFillHoriz)}
          style={{height: '47px'}}></div>
      )
      break;
    case 7:
      return (
        <div
          key={'key_CosmicMain_NailsSparation_'+index}
          className={classnames(styles.boxFillHoriz)}
          style={Number.isInteger(index/2) ? {width: '55%', marginLeft: '3.1%', marginRight: '40%'}:{width: '55%', marginLeft: '41.9%'}}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 561 1"
            className={classnames('centerAlignChild', styles.decoSeparationHorz)}>
            <defs><style>{".cls-1-strokeSeparationHorz{fill:none;stroke:#c4c4c4;stroke-linecap:round;stroke-miterlimit:10;opacity:0.78;}"}</style></defs>
            <g id="圖層_2" data-name="圖層 2">
              <g id="圖層_1-2" data-name="圖層 1">
                <line className="cls-1-strokeSeparationHorz" x1="0.5" y1="0.5" x2="560.5" y2="0.5"/></g></g></svg>
        </div>
      )// width and marginLeft of div combined to be 96.9% to match the border of the img in NailThumb
      break;
    case 10:
      return (
        <div
          key={'key_CosmicMain_NailsSparation_'+index}
          className={classnames(styles.boxFillHoriz)}
          style={{height: '47px'}}></div>
      )
      break;
    default:
      return false
  }
}

export function axios_cosmic_IndexList(cancelToken){
  let url = '/router/feed/focus';

  return axios.get(url, {
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
}

export function axios_visit_Index(cancelToken){
  let url = '/router/visit/index';

  return axios({ //use confic directly to assure the patch was not influenced by empty .body obj
    url:url,
    method: "patch",
    headers: {
      'charset': 'utf-8',
      'token': window.localStorage['token']
    },
    cancelToken: cancelToken
    //close if there is no error response
  }).catch(function (thrown) {
    throw thrown;
  });
}

export function axios_visit_GET_last(cancelToken){
  let url = '/router/visit/index';

  return axios({ //use confic directly to assure the patch was not influenced by empty .body obj
    url:url,
    method: "get",
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
}
