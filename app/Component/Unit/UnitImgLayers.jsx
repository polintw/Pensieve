import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import { connect } from "react-redux";
import ImgLayersFrame from './ImgLayersFrame.jsx';
import UnitActionPanel from './UnitActionPanel.jsx';
import {DateConverter, NounsExtensible} from './UnitComponent.jsx';
import {NameLabelRe} from '../AccountPlate.jsx';

class UnitImgLayers extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      Com_Unit_UnitImgLayers_: {

      },
      Com_Unit_UnitImgLayers_Frame: {
        width: '84%',
        height: '96%',
        position: 'absolute',
        top: '0%',
        right: '4%',
        boxSizing: 'border-box'
      },
      Com_Unit_UnitImgLayers_LinkssSection_: {

      },
      Com_Unit_UnitImgLayers_ControlSection_nouns_: {
        width: '100%',
        height: '50%',
        position: 'absolute',
        top: '20%',
        left: '0',
        boxSizing: 'border-box'
      },
      Com_Unit_UnitImgLayers_commonSection_: {

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
        position: 'absolute',
        top: '75%',
        left: '0%',
        boxSizing: 'border-box',
        color: 'rgb(250, 250, 250)',
        cursor:'pointer'
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
    return(
      <div>
        <div>
          <div
            style={this.style.Com_Unit_UnitImgLayers_LinkssSection_}>
            {
              this.props.unitCurrent.nouns &&
              <div
                style={this.style.Com_Unit_UnitImgLayers_ControlSection_nouns_}>
                <NounsExtensible
                  nouns={this.props.unitCurrent.nouns}
                  _handleClick_listNoun={this.props._refer_toandclose}/>
              </div>
            }
          </div>
          <div
            style={this.style.Com_Unit_UnitImgLayers_Frame}>
            <ImgLayersFrame
              moveCount={this.props.moveCount}
              lockify={this.props.lockify}
              unitInit={this.props.unitInit}/>
          </div>
        </div>
        <div
          style={this.style.Com_Unit_UnitImgLayers_commonSection_}>
          <div
            style={this.style.Com_Unit_UnitImgLayers_ControlSection_Author_}>
            <NameLabelRe
              size={'small'}
              accountId={this.props.unitCurrent.authorBasic.authorId}
              accountFisrtName={this.props.unitCurrent.authorBasic.firstName}
              accountLastName={this.props.unitCurrent.authorBasic.lastName}
              _handleClick_Account={this.props._refer_toandclose}/>
          </div>
          <div
            style={this.style.Com_Unit_UnitImgLayers_ControlSection_actionControl_}>
            <UnitActionPanel
              _set_Modalmode={this.props._set_Modalmode}/>
          </div>
          <div
            style={this.style.Com_Unit_UnitImgLayers_ControlSection_DateConverter}>
            <DateConverter
              datetime={this.props.unitCurrent.createdAt}/>
          </div>
        </div>
      </div>
    )
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
