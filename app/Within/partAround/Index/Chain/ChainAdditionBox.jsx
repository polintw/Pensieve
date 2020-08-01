import classnames from 'classnames';
import styles from "./styles.module.css";

export function _comp_EmptyBox(props, state){
  let DOMContent = null;
  switch (props.chainList.listInfo[props.chainList.listOrderedChain[0]]) {
    case "latestShared":
      DOMContent = (
        <div>
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
        <div>
          <span
            className={classnames("fontTitleSmall", "colorEditLightBlack")}>
            {props.i18nUIString.catalog["hint_Chain_waitForRespond"][0]}
          </span>
          <div>
            <div
              className={classnames("fontTitleSmall", "colorStandard")}>
              <AccountPalette
                size={"regularBold"}
                userId={props.chainList.listInfo["inspiredDetail"].lastUser}/>
            </div>
            <span
              className={classnames("fontTitleSmall", "colorEditLightBlack")}>
              {props.i18nUIString.catalog["hint_Chain_waitForRespond"][1]}
            </span>
          </div>
          <div>
            <span
              className={classnames("fontTitleSmall", "colorStandard")}>
              {props.chainList.listInfo["inspiredDetail"].sumNew}
            </span>
            <span
              className={classnames("fontTitleSmall", "colorEditLightBlack")}>
              {props.i18nUIString.catalog["hint_Chain_waitForRespond"][1]}
            </span>
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
