import React from 'react';
import classnames from 'classnames';
import stylesFont from './stylesFont.module.css';

export function renderNodesRows(props, styles){
  let list = props.unitBasic.nounsList;
  let nounsDOM = [];

  list.forEach((id, index)=>{
    if(index >0) nounsDOM.push(
      <span
        key={"key_nailNodes_coma_"+index}
        className={classnames(stylesFont.fontNodesTitle, stylesFont.colorEditBlack)}>{", "}</span>
    );

    nounsDOM.push(
      <span
        key={"key_nailNodes_"+props.unitId+"_nouns_"+index}
        className={classnames(stylesFont.fontNodesTitle, stylesFont.colorEditBlack)}>
        {id in props.nounsBasic ? (
          props.nounsBasic[id].name) : (
            null
          )}
        </span>
    );
  })

  return nounsDOM;
}

export function renderNodesRowsColorReverse(props, styles){
  let list = props.unitBasic.nounsList;
  let nounsDOM = [];

  list.forEach((id, index)=>{
    if(index >0) nounsDOM.push(
      <span
        key={"key_nailNodes_coma_"+index}
        className={classnames(stylesFont.fontNodesTitle, stylesFont.colorWhite)}>{", "}</span>
    );

    nounsDOM.push(
      <span
        key={"key_nailNodes_"+props.unitId+"_nouns_"+index}
        className={classnames(stylesFont.fontNodesTitle, stylesFont.colorWhite)}>
        {id in props.nounsBasic ? (
          props.nounsBasic[id].name) : (
            null
          )}
        </span>
    );
  })

  return nounsDOM;
}

export function renderNodesRowsCustom(props, customNodesTitle){
  let nounsDOM = [];
  nounsDOM.push(
    <span
      key={"key_nailNodes_custom_"+customNodesTitle}
      className={classnames(stylesFont.fontNodesTitle, stylesFont.colorEditBlack)}>
      {
        customNodesTitle=="welcome" ?
        props.i18nUIString.catalog['title_onBoard_GuideNailTitle'][0] :
        props.i18nUIString.catalog['title_onBoard_GuideNailTitle'][1] // currently only the GuideNail use this
      }
    </span>
  );

  return nounsDOM;
}
