import React from 'react';
import classnames from 'classnames';
import styles from "./styles.module.css";
import AccountPalette from '../../../../Components/AccountPalette.jsx';

export function _comp_EmptyBox(props, state){
  let DOMContent = null;
  switch (props.chainList.listInfo[props.chainList.listOrderedChain[0]]) {
    case "latestShared":
      DOMContent = (
        <div
          className={classnames(styles.boxEmptyNailFeedInner)}>
          <span
            className={classnames("fontTitleSmall", "colorGrey")}>
            {props.i18nUIString.catalog["hint_Chain_waitForRespond"][0]}
          </span>
          <span
            className={classnames("fontTitleSmall", "colorGrey")}>
            {props.i18nUIString.catalog["hint_Chain_waitForRespond"][1]}
          </span>
        </div>
      );
      break;
    case "newInspired":
      DOMContent = (
        <div
          className={classnames(styles.boxEmptyNailFeedInner)}
          style={{justifyContent: 'flex-start', alignItems: 'flex-start'}}>
            <div>
            <div>
              <span
                className={classnames("fontContent", "colorEditLightBlack")}>
                {props.i18nUIString.catalog["hint_Chain_InspiredDetail"][5]}
              </span>
            </div>
            <div
              className={classnames("colorStandard")}>
              <AccountPalette
                size={"content"}
                styleFirst={{fontWeight: '400'}}
                userId={props.chainList.listInfo["inspiredDetail"].lastUser} />
              {
                (props.chainList.listInfo["inspiredDetail"].sumNew > 1) &&
                <span
                  className={classnames("fontContent", "colorEditLightBlack")}>
                  {props.i18nUIString.catalog["hint_Chain_InspiredDetail"][0]}
                </span>
              }
            </div>
            <div>
              <span
                className={classnames("fontContent", "colorStandard")}>
                {
                  (props.chainList.listInfo["inspiredDetail"].sumNew > 1) &&
                  (props.chainList.listInfo["inspiredDetail"].sumNew-1)
                }
              </span>
              <span
                className={classnames("fontContent", "colorEditLightBlack")}>
                {
                  (props.chainList.listInfo["inspiredDetail"].sumNew > 1) &&
                  props.i18nUIString.catalog["hint_Chain_InspiredDetail"][1]
                }
              </span>
              <span
                className={classnames("fontContent", "colorEditLightBlack")}>
                {
                  (props.chainList.listInfo["inspiredDetail"].sumNew > 1) ?
                  props.i18nUIString.catalog["hint_Chain_InspiredDetail"][3] :
                  props.i18nUIString.catalog["hint_Chain_InspiredDetail"][4]
                }
              </span>
              <span
                className={classnames("fontContent", "colorEditLightBlack")}>
                {props.i18nUIString.catalog["hint_Chain_InspiredDetail"][2]}
              </span>
            </div>
          </div>
        </div>
      );
      break;
    default:
      null
  }

  return (
    <div
      key={"key_ChainUnits_emptyBox"}
      className={classnames(styles.boxEmptyNailFeed)}>
      {DOMContent}
    </div>
  );
}
