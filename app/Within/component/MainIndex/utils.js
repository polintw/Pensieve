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
          className={classnames(styles.heightNarrow, styles.boxWide)}>
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
          className={classnames(styles.heightNarrow, styles.boxNarrow)}>
          <NailThumb
            {...pare.props}
            unitId={unitId}
            unitBasic={pare.state.unitsBasic[unitId]}
            marksBasic={pare.state.marksBasic}/>
        </div>
      )
      break;
    case 2:
      return (
        <div
          key={'key_CosmicMain_Nails_'+unitId}
          className={classnames(styles.heightFlat, styles.boxFlat)}>
          <NailFlatDisplay
            {...pare.props}
            unitId={unitId}
            unitBasic={pare.state.unitsBasic[unitId]}
            marksBasic={pare.state.marksBasic}/>
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
    case 0:
      return (
        <div
          key={'key_CosmicMain_NailsSparation_'+index}
          className={classnames(styles.boxFillVertical, styles.heightNarrow)}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 305"
            className={classnames('centerAlignChild', styles.decoSeparationVerti)}>
            <defs><style>{".cls-1-strokeSeparation{fill:none;stroke:#c4c4c4;stroke-linecap:round;stroke-miterlimit:10;opacity:0.78;}"}</style></defs>
            <g id="圖層_2" data-name="圖層 2">
              <g id="圖層_1-2" data-name="圖層 1">
                <line className="cls-1-strokeSeparation" x1="0.5" y1="304.5" x2="0.5" y2="0.5"/></g></g></svg>
        </div>
      )
      break;
    case 1:
      return (
        <div
          key={'key_CosmicMain_NailsSparation_'+index}
          className={classnames(styles.boxFillHoriz)}
          style={{width: '55%', marginLeft: Number.isInteger(index/2) ? '3.1%': '41.9%'}}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 561 1"
            className={classnames('centerAlignChild', styles.decoSeparationHorz)}>
            <defs><style>{".cls-1-strokeSeparationHorz{fill:none;stroke:#c4c4c4;stroke-linecap:round;stroke-miterlimit:10;opacity:0.78;}"}</style></defs>
            <g id="圖層_2" data-name="圖層 2">
              <g id="圖層_1-2" data-name="圖層 1">
                <line className="cls-1-strokeSeparationHorz" x1="0.5" y1="0.5" x2="560.5" y2="0.5"/></g></g></svg>
        </div>
      )// width and marginLeft of div combined to be 96.9% to match the border of the img in NailThumb
      break;
    case 2:
      return (
        <div
          key={'key_CosmicMain_NailsSparation_'+index}
          className={classnames(styles.boxFillVertical, styles.heightFlat)}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 305"
            className={classnames('centerAlignChild', styles.decoSeparationVerti)}> //there is a weired bug here, svg stroke would dissapear at some point, perhaps is come from the browser
            <defs><style>{".cls-1-strokeSeparation-"+index+"{fill:none;stroke:#c4c4c4;stroke-linecap:round;stroke-miterlimit:10;opacity:0.78;}"}</style></defs>
            <g id="圖層_2" data-name="圖層 2">
              <g id="圖層_1-2" data-name="圖層 1">
                <line className={"cls-1-strokeSeparation-"+index} x1="0.5" y1="304.5" x2="0.5" y2="0.5"/></g></g></svg>
        </div>
      )
      break;
    case 3:
      return (
        <div
          key={'key_CosmicMain_NailsSparation_'+index}
          className={classnames(styles.boxFillHoriz)}
          style={{height: '57px'}}></div>
      )
      break;
    case 6:
      return (
        <div
          key={'key_CosmicMain_NailsSparation_'+index}
          className={classnames(styles.boxFillHoriz)}
          style={{height: '63px'}}></div>
      )
      break;
    default:
      return false
  }
}
