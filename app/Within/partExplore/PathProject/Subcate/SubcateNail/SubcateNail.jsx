import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import {
  domain
} from '../../../../../../config/services.js';

class SubcateNail extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      overNail: false
    };
    this._handleOut_btn = this._handleOut_btn.bind(this);
    this._handleOver_btn = this._handleOver_btn.bind(this);
    this._render_nailImages = this._render_nailImages.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  _render_nailImages(){
    let imagesDOM = this.props.subCateInfo.unitsListBySerial.map((unitId, index)=>{
      let imgSrcCover = domain.protocol+ '://'+domain.name+'/router/img/'+this.props.unitsBasic[unitId].pic_layer0+'?type=thumb';
      return (
        <div
          key={"key_subcateNail_unitsImage_"+index}
          className={classnames(styles.boxImgContainer)}
          style={{backgroundImage: 'url('+ imgSrcCover +')'}}/>
      );
    });
    return imagesDOM;
  }

  render(){
    let toSearch = new URLSearchParams(this.props.location.search); //we need value in URL query
    toSearch.set("subCate", this.props.subCateId);
    toSearch.set('unitView', "pathsubcate");
    toSearch.set('unitId', this.props.subCateInfo.unitsListBySerial[0]);
    let linkPath = this.props.location.pathname +  '/unit';

    return (
      <div
        className={classnames(styles.comSubcatesNail)}>
        <Link
          to={{
            pathname: linkPath,
            search: toSearch.toString(),
            state: { from: this.props.location }
          }}
          className={classnames(
            'plainLinkButton', styles.linkSubcate,
            {[styles.linkSubcateMouseOver]: this.state.overNail}
          )}
          onTouchStart={this._handleOver_btn}
          onTouchEnd={this._handleOut_btn}
          onMouseOver={this._handleOver_btn}
          onMouseOut={this._handleOut_btn}>
          <div
            className={classnames(styles.boxSubcateText)}>
            <div
              className={classnames(styles.boxSubcateTitle)}>
              <span
                className={classnames(
                  "fontNodesEqual", "weightBold", 'lineHeight15',
                  {
                    ['colorGrey']: !this.state.overNail,
                    ['colorEditBlack']: this.state.overNail,
                  }
                )}>
                {"@"}
              </span>
              <span
                className={classnames(
                  "fontNodesEqual", "weightBold", 'lineHeight15', 'colorEditBlack'
                )}>
                { this.props.subCateInfo.name }
              </span>
            </div>
            <div
              className={classnames(styles.boxSubcateDescript)}>
              <span
                className={classnames(
                  "fontContentPlain", 'colorEditBlack'
                )}>
                {this.props.subCateInfo.description}
              </span>
            </div>
          </div>
          <div
            className={classnames(
              styles.boxImgsNail,
              {[styles.boxImgsNailMouseOver]: this.state.overNail}
            )}>
            <div
              className={styles.boxImgsFrame}>
              {this._render_nailImages()}
            </div>
          </div>
        </Link>
      </div>
    )
  }

  _handleOver_btn(e) {
    e.stopPropagation();
    this.setState({ overNail: true })
  }

  _handleOut_btn(e) {
    e.stopPropagation();
    this.setState({ overNail: false })
  }

}


const mapStateToProps = (state)=>{
  return {
    tokenStatus: state.token,
    i18nUIString: state.i18nUIString,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(SubcateNail));
