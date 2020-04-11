import React from 'react';
import {
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import stylesFont from '../stylesFont.module.css';
import BelongSet from './BelongSet.jsx';
import SvgLogo from '../../../Components/Svg/SvgLogo.jsx';
import {NodeSearchModule} from '../../../Components/Node/NodeSearchModule.jsx';

class Wrapper extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    //And! we have to 'hide' the scroll bar and preventing the scroll behavior to the page one for all
    //so dismiss the scroll ability for <body> here
    document.getElementsByTagName("BODY")[0].setAttribute("style","overflow-y:hidden;");
  }

  componentDidMount() {

  }

  componentWillUnmount(){
    //recruit the scroll ability back to <body>
    document.getElementsByTagName("BODY")[0].setAttribute("style","overflow-y:scroll;");
  }


  render(){
    return(
      <div
        className={styles.comOnBoardWrapper}>
        <div
          className={classnames(styles.boxRelativeRow, styles.rowTop)}>
          <div
            className={classnames(styles.boxLogo)}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
            <SvgLogo />
          </div>
        </div>
        <div
          className={classnames(styles.boxRelativeRow, styles.rowGreet)}>
          <div
            className={classnames(styles.boxFlexColumn, styles.boxGreet)}>
            <div
              className={classnames(styles.boxGreetTitle)}>
              <span
                className={classnames(stylesFont.fontTitle, stylesFont.colorCoral)}
                style={{ marginRight: "0.87rem" }}>
                {this.props.i18nUIString.catalog["title_onBoard_Welcome"]}
              </span>
              <span
                className={classnames(stylesFont.fontTitle, stylesFont.colorCoral)}>
                {this.props.userInfo.firstName + "!"}
              </span>
            </div>
            <div
              className={classnames(styles.boxGreetContent, styles.boxFlexColumn)}>
              <span
                className={classnames(stylesFont.fontDescrip, styles.colorDescripBlack)}
                style={{ lineHeight: 1.88 }}>
                {this.props.i18nUIString.catalog["descript_onBoard_Intro"][0]}
              </span>
              <span
                className={classnames(stylesFont.fontDescrip, styles.colorDescripBlack)}
                style={{ lineHeight: 1.88 }}>
                {this.props.i18nUIString.catalog["descript_onBoard_Intro"][1]}
              </span>
            </div>
          </div>
        </div>
        <div
          className={classnames(styles.boxRelativeRow, styles.rowForm)}>
          <div
            className={classnames(styles.boxFlexColumn, styles.boxForm)}>
            <div
              className={classnames(styles.boxFormSubTitle)}>
              <span
                className={classnames(stylesFont.fontDescrip, stylesFont.colorDescripBlack)}
                style={{ lineHeight: 1.88 }}>
                {this.props.i18nUIString.catalog["descript_onBoard_BelongsHint"][0]}
              </span>
            </div>
            <div
              className={classnames(styles.boxFormTitle)}>
              <span
                className={classnames(stylesFont.fontTitleNotice, stylesFont.colorNoticeBlack)}>
                {this.props.i18nUIString.catalog["descript_onBoard_BelongsHint"][1]}
              </span>
            </div>
            <div
              className={classnames(styles.boxFlexColumn, styles.boxFormBelongs)}>
              <div
                className={classnames(styles.boxFormBelongsRow)}
                style={{marginBottom: "2.19vh"}}>
                <span
                  className={classnames(styles.spanFormBelongsType, stylesFont.fontDescrip ,stylesFont.colorDescripBlack, stylesFont.weightBold)}
                  style={{lineHeight: "1.5"}}>
                  {this.props.i18nUIString.catalog["category_Belongs_"][0]}
                </span>
                <span
                  className={classnames(styles.spanFormBelongsDescrip, stylesFont.fontDescrip ,stylesFont.colorDescripBlack)}
                  style={{lineHeight: "1.5"}}>
                  {this.props.i18nUIString.catalog["guideing_onBoard_BelongsHint"][0]}
                </span>
                <div>
                  <BelongSet
                    belongs={this.state.belongs}
                    settingType={"homeland"}/>
                </div>

              </div>
              <div
                className={classnames(styles.boxFormBelongsRow)}>
                <span
                  className={classnames(styles.spanFormBelongsType, stylesFont.fontDescrip ,stylesFont.colorDescripBlack, stylesFont.weightBold)}
                  style={{lineHeight: "1.5"}}>
                  {this.props.i18nUIString.catalog["category_Belongs_"][1]}
                </span>
                <span
                  className={classnames(styles.spanFormBelongsDescrip, stylesFont.fontDescrip ,stylesFont.colorDescripBlack)}
                  style={{lineHeight: "1.5"}}>
                  {this.props.i18nUIString.catalog["guideing_onBoard_BelongsHint"][1]}
                </span>
              </div>
            </div>

          </div>
        </div>
        <div
          className={classnames(styles.boxRelativeRow, styles.rowButton)}>
          <div
            className={classnames(styles.boxButton)}>
            <span
              className={classnames(stylesFont.fontSubmit ,stylesFont.colorWhite)}>
              {this.props.i18nUIString.catalog["submit_onBoard_start"]}
            </span>
          </div>
        </div>

      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
  }
}

export default withRouter(connect(
  mapStateToProps,
  null
)(Wrapper));
