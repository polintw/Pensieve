import React from 'react';
import {
  Link,
  withRouter,
  Redirect
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import stylesFont from '../stylesFont.module.css';
import Layers from './Layers.jsx';
import LayersSmall from './LayersSmall.jsx';
import EntityOnSubcate from '../Entity/EntityOnSubcate.jsx';
import EntitySubcateTitle from '../Entity/EntitySubcateTitle.jsx';

class Theater extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onIconClose: false
    };
    this.unitInit = this.props._construct_UnitInit(this.props.match, this.props.location);
    this._handleEnter_Icon = this._handleEnter_Icon.bind(this);
    this._handleLeave_Icon = this._handleLeave_Icon.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    //due to update to unitId only still Redirect to a new URL
    //check again to re-define the URL
    if(
      !this.props.location.pathname.includes('explore/unit') && // first, if not from independt page
      !(this.props.location.pathname.includes('/path') && this.props.location.search.includes('subCate=')) // second, not under a subCate in /path
    ) window.history.replaceState(this.props.location.state, '', '/cosmic/explore/unit?unitId='+this.unitId+'&unitView=theater');
    //Note that, replaceState would also change the behavior of 'back' by browser, (only back to the new path)
    //we need to modify the behavior manually one day by 'popstate' iterate by the replaceState
  }

  componentDidMount(){
    //replace the URL display in the browser bar under 2 conditions:
    if(
      !this.props.location.pathname.includes('explore/unit') && // first, if not from independt page
      !(this.props.location.pathname.includes('/path') && this.props.location.search.includes('subCate=')) // second, not under a subCate in /path
    ) window.history.replaceState(this.props.location.state, '', '/cosmic/explore/unit?unitId='+this.unitId+'&unitView=theater');
    //Note that, replaceState would also change the behavior of 'back' by browser, (only back to the new path)
    //we need to modify the behavior manually one day by 'popstate' iterate by the replaceState
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    };
  }

  render(){
    let params = new URLSearchParams(this.props.location.search); //we need value in URL query
    this.unitId = params.get('unitId');

    return(
      <div
        className={classnames(styles.comTheater)}>
        <div
          className={classnames("smallDisplayBox")}
          style={{padding: '0 5%', textAlign: 'right'}}>
          <span
            className={classnames(
              "fontContent",
              {
                ["colorLightGrey"]: !this.state.onIconClose,
                ["colorWhite"]: this.state.onIconClose,
              })}
            style={{display: 'inline-block', padding: '0 0 16px'}}
            onTouchStart={this._handleEnter_Icon}
            onTouchEnd={this._handleLeave_Icon}
            onMouseEnter={this._handleEnter_Icon}
            onMouseLeave={this._handleLeave_Icon}>
            {this.props.i18nUIString.catalog['submit_close']}
          </span>
        </div>
        {
          (!!this.props.unitEntity && this.props.unitEntity.subCate) &&
          <div
            className={classnames(styles.boxEntitySubcateTitle)}>
            <EntitySubcateTitle
              {...this.props}
              unitEntity= {this.props.unitEntity}/>
          </div>
        }
        <div
          className={classnames(styles.boxTheaterLayers, styles.boxTheaterLayersSmall)}
          onClick={(event) => { event.stopPropagation(); }}>
          <LayersSmall
            {...this.props}
            initStatus={this.unitInit}/>
        </div>
        <div
          className={classnames(styles.boxTheaterLayers, styles.boxTheaterLayersRegular)}
          onClick={(event) => { event.stopPropagation(); }}>
          <Layers
            {...this.props}
            initStatus={this.unitInit}/>
        </div>
        {
          (!!this.props.unitEntity && this.props.unitEntity.subCate) &&
          <div
            className={classnames(styles.boxLayerSwitch, "wideDisplayFlex")}>
            <div
              className={classnames(styles.boxTheaterSubcate)}
              onClick={(event) => { event.stopPropagation(); }}>
              <EntityOnSubcate
                {...this.props}
                unitEntity= {this.props.unitEntity}/>
            </div>
          </div>
        }
        <div
          className={classnames(
            styles.boxLayerSwitch, "smallDisplayBox")}>
            {
              (!!this.props.unitEntity && this.props.unitEntity.subCate) &&
              <div
                className={classnames(styles.boxTheaterSubcate)}
                onClick={(event) => { event.stopPropagation(); }}>
                <EntityOnSubcate
                  {...this.props}
                  unitEntity= {this.props.unitEntity}/>
              </div>
            }
        </div>
      </div>
    )
  }

  _handleEnter_Icon(event){
    this.setState({
      onIconClose: true
    })
  }

  _handleLeave_Icon(event){
    this.setState({
      onIconClose: false
    })
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitSubmitting: state.unitSubmitting,
    i18nUIString: state.i18nUIString
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Theater));
