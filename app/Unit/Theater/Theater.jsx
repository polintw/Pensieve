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
import LayerSwitch from './components/LayerSwitch/LayerSwitch.jsx';
import EntityOnSubcate from './components/Entity/EntityOnSubcate.jsx';

class Theater extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.unitInit = this.props._construct_UnitInit(this.props.match, this.props.location);
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    //due to update to unitId only still Redirect to a new URL
    //check again to re-define the URL
    if(!this.props.location.pathname.includes('explore/unit')) window.history.replaceState(this.props.location.state, '', '/cosmic/explore/unit?unitId='+this.unitId+'&unitView=theater');
    //Note that, replaceState would also change the behavior of 'back' by browser, (only back to the new path)
    //we need to modify the behavior manually one day by 'popstate' iterate by the replaceState
  }

  componentDidMount(){
    //replace the URL display in the browser bar if not from independt page
    if(!this.props.location.pathname.includes('explore/unit')) window.history.replaceState(this.props.location.state, '', '/cosmic/explore/unit?unitId='+this.unitId+'&unitView=theater');
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
    // modification for small screen
    let cssVW = window.innerWidth; // px of vw in pure integer

    return(
      <div
        className={classnames(styles.comTheater)}>
        <div
          className={classnames(styles.boxTheaterLayers)}
          onClick={(event) => { event.stopPropagation(); }}>
          <Layers
            {...this.props}
            initStatus={this.unitInit}/>
        </div>
        <div
          className={classnames(styles.boxLayerSwitch)}
          onClick={(event) => { if(cssVW > 860 ) event.stopPropagation(); }}>
          {
            (!!this.props.unitEntity && "pathSubCate" in this.props.unitEntity) &&
            <EntityOnSubcate
              unitEntity= {this.props.unitEntity}/>
          }
          <LayerSwitch
            {...this.props}/>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitSubmitting: state.unitSubmitting
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
