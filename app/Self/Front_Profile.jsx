import React from 'react';
import {
  Route,
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import Sheet from './component/Sheet.jsx';
import MaskProcessing from '../Component/MaskProcessing.jsx';

const styleMiddle ={
  boxReturn: {
    display: 'inline-block',
    boxSizing: 'border-box',
    cursor: 'pointer',
    zIndex: '2' //a temp method, to avoid cover by NavSelf
  },
  spanReturn: {
    top: '44%',
    whiteSpace: 'nowrap',
    fontSize: '1.6rem',
    fontWeight: '700',
    letterSpacing: '0.12rem',
    color: '#ff7a5f',
    cursor: 'pointer'
  }
}

class FrontProfile extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      Front_Profile_: {
        width: '100%',
        height: '100%',
        position: 'static',
        top: '0%',
        left: '0%',
        backgroundColor: '#d1d1d1'
      },
      Front_Profile_return_: {
        position: 'fixed',
        bottom: '0%',
        left: '71%',
      },
      Front_Profile_scroll_: {
        width: '61%',
        position: 'absolute',
        top: '2%',
        left: '18%',
        boxSizing: 'border-box'
      },
      Front_Profile_backPlane_top: {
        width: '100%',
        height: '1%',
        position: 'fixed',
        top: '0',
        left: '0',
        backgroundColor: '#d1d1d1'
      },
      Front_Profile_backPlane_bottom: {
        width: '100%',
        position: 'fixed',
        bottom: '0',
        left: '0',
        backgroundColor: '#d1d1d1'
      },
      Front_Profile_backPlane_nav_Front: {
        width: '32%',
        height: '100%',
        position: 'absolute',
        bottom: '0',
        right: '0',
        boxSizing: 'border-box',
        boxShadow: '2px 0px 4px -2px inset',
        borderTopLeftRadius: '2vh',
        backgroundColor: '#FFFFFF'
      }
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.Front_Profile_}>
        <div
          style={this.style.Front_Profile_scroll_}>
          <Route path={this.props.match.path+"/sheet"} render={(props)=> <Sheet {...props}/>}/>
        </div>
        <div style={this.style.Front_Profile_backPlane_top}></div>
        <div
          className={'selfFront-fixedBottomBox-height'}
          style={this.style.Front_Profile_backPlane_bottom}>
          <div
            style={this.style.Front_Profile_backPlane_nav_Front}>
          </div>
        </div>
        <div
          className={'selfFront-fixedBottomBox-height'}
          style={Object.assign({},this.style.Front_Profile_return_, styleMiddle.boxReturn)}>
          <Link
            to={this.props.location.state.from}
            className={'plainLinkButton'}>
            <div
              className={'verticalAlignChild'}
              style={styleMiddle.spanReturn}>
              {"back"}
            </div>
          </Link>
        </div>
        {
          (this.props.settingSubmitting || this.props.axios) &&
          <MaskProcessing/>
        }
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    settingSubmitting: state.settingSubmitting,
    axios: state.axios
  }
}
export default withRouter(connect(
  mapStateToProps,
  null
)(FrontProfile));
