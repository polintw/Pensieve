import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import SubcateIntro from './SubcateIntro/SubcateIntro.jsx';

class SubcatesList extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      overBtnSubcate: false
    };
    this._handleOut_btn = this._handleOut_btn.bind(this);
    this._handleOver_btn = this._handleOver_btn.bind(this);
    this._render_subcate = this._render_subcate.bind(this);
    this._render_list = this._render_list.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  _render_subcate(){

    return (
      <SubcateIntro
        {...this.props}/>
    );
  }

  _render_list(){
    let subCatesDOM = this.props.subCatesInfo.subCatesList.map((subCateId, index)=>{
      return (
        <div
          key={"key_Nav_Subcates_"+index}
          subcateid={subCateId}
          onTouchStart={this._handleOver_btn}
          onTouchEnd={this._handleOut_btn}
          onMouseOver={this._handleOver_btn}
          onMouseOut={this._handleOut_btn}>
          <Link
            to={{
              pathname: this.props.match.url,
              search: '?subCate=' + subCateId,
              state: { from: this.props.location }
            }}
            className={classnames(
              'plainLinkButton', styles.linkSubcate,
              {
                ["colorWhiteGrey"]: (this.state.overBtnSubcate != subCateId),
                ["colorEditBlack"]: (this.state.overBtnSubcate == subCateId),
                [styles.mouseovlinkSubcate]: (this.state.overBtnSubcate == subCateId)
              }
            )}>
            <span
              className={classnames(
                "fontContentPlain", "weightBold",
              )}>
              {"@" + this.props.subCatesInfo.subCatesObj[subCateId].name}
            </span>
          </Link>
        </div>
      )
    });

    return subCatesDOM;
  }


  render(){
    let urlParams = new URLSearchParams(this.props.location.search); //we need value in URL query
    if(urlParams.has('subCate')){
      this.currentSubCate = urlParams.get('subCate');
    } else this.currentSubCate = false;
    return (
      <div
        className={classnames(styles.comSubcatesList)}>
        {
          this.currentSubCate ? (
            this._render_subcate()
          ): (
            this._render_list()
          )
        }
      </div>
    )
  }

  _handleOver_btn(event) {
    let subCateId = event.currentTarget.getAttribute('subcateid');
    this.setState({ overBtnSubcate: subCateId })
  }

  _handleOut_btn(event) {
    this.setState({ overBtnSubcate: false })
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
)(SubcatesList));
