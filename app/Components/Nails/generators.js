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
