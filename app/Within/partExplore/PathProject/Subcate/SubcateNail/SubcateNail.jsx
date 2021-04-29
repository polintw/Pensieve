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
      overBtnSubcate: false
    };
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
        <div style={{
            position: 'absolute', width:'100%', height: '100%', top: '0', left: '0',
            backgroundColor:'rgba(217, 232, 255, 0.15)',
            backgroundImage: 'url('+ imgSrcCover +')',
            backgroundSize: 'cover',
            backgroundPosition: '50% 50%',
            backgroundRepeat: 'no-repeat',
            opacity: '0.18'
          }}/>
      );
    });
    return imagesDOM;
  }

  render(){
    let toSearch = new URLSearchParams(this.props.location.search); //we need value in URL query
    toSearch.set("subCate", this.props.subCateId);
    toSearch.set('unitView', "theater");
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
          )}
          subcateid={this.props.subCateId}
          onTouchStart={this._handleOver_btn}
          onTouchEnd={this._handleOut_btn}
          onMouseOver={this._handleOver_btn}
          onMouseOut={this._handleOut_btn}>
          <div>
            <span
              className={classnames(
                "fontContentPlain", "weightBold",
              )}>
              {"@" + this.props.subCateInfo.name}
            </span>
          </div>
          <div
            className={classnames(styles.boxNail)}>
            <div
              className={styles.boxImg}>
              {this._render_nailImages()}
            </div>
          </div>
        </Link>
      </div>
    )
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
