import React from 'react';
import classnames from 'classnames';

export function renderNodesTitle(props, styles){
  let list = props.unitBasic.nounsList;
  let nounsDOM = [];

  list.forEach((id, index)=>{
    nounsDOM.push(
      <div
        key={"key_nailcosmic_"+props.unitId+"_nouns_"+index}
        className={classnames(styles.boxNodesItem)}>
        <span
          className={classnames(styles.spanNodesItem, styles.fontNode)}
          style={{position: 'relative'}}>
          {id in props.nounsBasic ? (
            props.nounsBasic[id].name) : (
              null
            )}
        </span>
      </div>
    );

    if(!(index==(list.length-1))) nounsDOM.push(
      <div
        key={"key_nailcosmic_"+props.unitId+"_dots_"+index}
        className={classnames(styles.boxNodesItem)}
        style={{margin: "0.5rem 0 0"}}>
        <span
          className={classnames(styles.fontNode)}
          style={{position: 'relative'}}>{"．"}</span>
      </div>
    );
  })

  return nounsDOM;
}
