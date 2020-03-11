import React from 'react';
import classnames from 'classnames';

export function renderNodesRows(props, styles){
  let list = props.unitBasic.nounsList;
  let nounsDOM = [];

  list.forEach((id, index)=>{
    nounsDOM.push(
      <div
        key={"key_nailNodes_"+props.unitId+"_nouns_"+index}
        className={classnames('boxNailNodesItem', styles.boxNodesItem)}>
        <span
          className={classnames('fontNailNode', styles.fontNode)}
          style={{position: 'relative'}}>
          {id in props.nounsBasic ? (
            props.nounsBasic[id].name) : (
              null
            )}
        </span>
      </div>
    );
  })

  return nounsDOM;
}
