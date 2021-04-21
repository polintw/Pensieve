import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import { connect } from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import WrapperImg from './LayerImgs/Wrapper.jsx';
import WrapperUnsign from './LayerImgs/WrapperUnsign.jsx';

import LayerScroll from './components/LayerScroll.jsx';

class LayersSmall extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      lockify: true,
      marksStatus: {marksify: this.props.initStatus.marksify, initMark: this.props.initStatus.initMark},
      moveCount: this.props.initStatus.layer>0 ? 100 : 0
    };
    this._set_markOpened = (bool, markKey)=>{this.setState((prevState,props)=>{return {marksStatus: {marksify: bool, initMark: markKey?markKey: "all"}};});};
    this._set_layerstatus = this._set_layerstatus.bind(this);
    this._refer_toandclose = this._refer_toandclose.bind(this);
    this._render_ScrollLayers = this._render_ScrollLayers.bind(this);
  }

  _refer_toandclose(source, identity){
    // this f() is redundent, only for switch the position of params
    this.props._refer_von_unit(identity, source);
  }

  _set_layerstatus(lockify, moveCount, marksStatus){
    this.setState((prevState, props)=>{
      return {
        lockify: lockify,
        moveCount: moveCount,
        marksStatus: marksStatus ? marksStatus: prevState.marksStatus
      }
    });
  }

  _render_ScrollLayers(){
    if(this.props.tokenStatus== 'invalid' || this.props.tokenStatus == 'lack'){
      return (
        <WrapperUnsign
          {...this.props}
          lockify={this.state.lockify}
          moveCount={this.state.moveCount}
          marksStatus={this.state.marksStatus}
          _set_markOpened={this._set_markOpened}
          _set_layerstatus={this._set_layerstatus}
          _refer_toandclose={this._refer_toandclose}/>
      )
    }else
    return (
      <WrapperImg
        {...this.props}
        lockify={this.state.lockify}
        moveCount={this.state.moveCount}
        marksStatus={this.state.marksStatus}
        _set_markOpened={this._set_markOpened}
        _set_layerstatus={this._set_layerstatus}
        _refer_toandclose={this._refer_toandclose}/>
    ); // end of 'if()'
    /*

    Beneath, are the remain of the complete version,
    which has Summary layer.
    We just ignore it in simplified ver.

    if(this.state.moveCount< 200) {

    }else{
      return (
        <div>
          {
            this.props.unitCurrent.identity=="author" ? (
               //temp method, before a true AuthorSummary was created
              <UnitAuthorSummary
                moveCount={this.state.moveCount}
                _set_layerstatus={this._set_layerstatus}
                _set_Modalmode={this.props._set_Modalmode}
                _refer_toandclose={this._refer_toandclose}/>
            ):(
              <UnitViewSummary
                moveCount={this.state.moveCount}
                _set_layerstatus={this._set_layerstatus}
                _set_Modalmode={this.props._set_Modalmode}
                _refer_toandclose={this._refer_toandclose}/>
            )
          }
        </div>
      )
    }*/
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    //check if the Modal should be cloed by Count
    if(this.state.moveCount> 201){
      if(!this.props.location.pathname.includes('explore/unit')){
        // the browser, which do not know the origin it has been modified, need to be modified again to have the pratical history,
        // which is the 'real' location before replacement during mount
        window.history.replaceState(this.props.location.state, '', this.props.location.pathname+this.props.location.search);
      };
      let nextSearch = this.props.location.search.replace("unitView=theater","unitView=related");
      this.props.history.push({
        pathname: this.props.match.path,
        search: nextSearch,
        state: {from: this.props.location}
      });
    };
    /*
    Beneath, are the remain of the complete version,
    which has Summary layer.

    if(this.state.moveCount> 250) this.props._close_theater();

    _close_theater() has been depacrated
    */
  }


  render(){
    //Notice! it's important to let the WrapperImg unmount if >200, due to we need the re-render, not just css change
    return(
      <div
        className={classnames(styles.comLayersSmall)}>
        {
          (this.props.unitCurrent.coverSrc) ? /*(
            only one layer now, even without Summary, so took away scroll effect first
            <LayerScroll
              lockify={this.state.lockify}
              moveCount={this.state.moveCount}
              markOpened={this.state.marksStatus.marksify}
              _set_layerstatus={this._set_layerstatus}>
              {this._render_ScrollLayers()}

            </LayerScroll>
          )*/
          (
            this._render_ScrollLayers()
          ): (
            <div
              style={{ backgroundColor:'rgba(217, 232, 255, 0.15)',width: '20%', height: '20%', position: 'absolute', top: '40%', left: '40%'}}/>
          )
        }
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    tokenStatus: state.token,
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
    unitSubmitting: state.unitSubmitting
  }
}

export default withRouter(connect(
  mapStateToProps,
  null
)(LayersSmall));
