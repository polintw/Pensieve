import React from 'react';
import {
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import stylesFont from '../stylesFont.module.css';
import SvgLogo from '../../../Components/Svg/SvgLogo.jsx';

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
