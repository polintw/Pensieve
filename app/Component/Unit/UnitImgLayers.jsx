import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import { connect } from "react-redux";
import ImgLayersFrame from './ImgLayersFrame.jsx';
import {DateConverter, NounsExtensible} from './UnitComponent.jsx';
import {AuthorPlate} from '../AccountPlate.jsx';

class UnitImgLayers extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      Com_Unit_UnitImgLayers_: {
        width: '89%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '50%',
        transform: 'translate(-50%, 0)',
        boxSizing: 'border-box',
        backgroundColor: '#313130',
        boxShadow: '0px 1.2vh 2.4vw 0vw'
      },
      Com_Unit_UnitImgLayers_Frame: {
        width: '84%',
        height: '100%',
        position: 'absolute',
        top: '0%',
        left: '0%',
        boxSizing: 'border-box'
      },
      Com_Unit_UnitImgLayers_ControlSection_: {
        width: '13%',
        height: '100%',
        position: 'absolute',
        top: '0',
        right: '0',
        boxSizing: 'border-box'
      },
      Com_Unit_UnitImgLayers_ControlSection_actionControl_: {
        width: '100%',
        height: '12%',
        position: 'absolute',
        bottom: '0',
        left: '0',
        boxSizing: 'border-box'
      },
      Com_Unit_UnitImgLayers_ControlSection_Author_: {
        width: '100%',
        height: '12%',
        position: 'absolute',
        top: '75%',
        left: '0%',
        boxSizing: 'border-box',
        cursor:'pointer'
      },
      Com_Unit_UnitImgLayers_ControlSection_nouns_: {
        width: '100%',
        height: '50%',
        position: 'absolute',
        top: '20%',
        left: '0',
        boxSizing: 'border-box'
      },
      Com_Unit_UnitImgLayers_ControlSection_DateConverter: {
        width: '80%',
        height: '12%',
        position: 'absolute',
        top: '2%',
        left: '0',
        boxSizing: 'border-box',
        fontSize: '1.4rem',
        letterSpacing: '0.15rem',
        textAlign: 'center',
        fontWeight: '400',
        color: '#FAFAFA',
      }
    }
  }

  render(){
    <div>
      <div
        style={this.style.Com_Unit_UnitImgLayers_ControlSection_}>
        {
          this.props.unitCurrent.nouns &&
          <div
            style={this.style.Com_Unit_UnitImgLayers_ControlSection_nouns_}>
            <NounsExtensible
              nouns={this.props.unitCurrent.nouns}
              _handleClick_listNoun={this._refer_toandclose}/>
          </div>
        }
        {
          this.props.unitCurrent.authorBasic &&
          <div
            style={this.style.Com_Unit_UnitImgLayers_ControlSection_Author_}>
            <AuthorPlate
              authorBasic={this.props.unitCurrent.authorBasic}
              _handleClick_Account={this._refer_toandclose}/>
          </div>
        }
        <div
          style={this.style.Com_Unit_UnitImgLayers_ControlSection_actionControl_}>
          <UnitActionControl
            _set_Modalmode={this.props._set_Modalmode}/>
        </div>
        <div
          style={this.style.Com_Unit_UnitImgLayers_ControlSection_DateConverter}>
          <DateConverter
            datetime={this.props.unitCurrent.createdAt}/>
        </div>
      </div>
      <div
        style={this.style.Com_Unit_UnitImgLayers_Frame}>
        <ImgLayersFrame
          moveCount={this.state.moveCount}
          lockify={this.state.lockify}
          unitInit={this.props.unitInit}/>
      </div>
    </div>
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
    unitSubmitting: state.unitSubmitting
  }
}

export default withRouter(connect(
  mapStateToProps,
  null
)(UnitImgLayers));
