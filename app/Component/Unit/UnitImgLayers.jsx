import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import { connect } from "react-redux";
import ImgLayersFrame from './ImgLayersFrame.jsx';
import UnitActionPanel from './UnitActionPanel.jsx';
import {NounsExtensible} from './UnitComponent.jsx';
import {NameLabelRe} from '../AccountPlate.jsx';
import DateConverter from '../DateConverter.jsx';

class UnitImgLayers extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      Com_Unit_UnitImgLayers_contentSection_: {
        width: '96%',
        height: '96%',
        position: 'absolute',
        top: '0%',
        right: '4%',
        boxSizing: 'border-box',
        backgroundColor: '#101010'
      },
      Com_Unit_UnitImgLayers_contentSection_frame: {
        width: '86%',
        height: '100%',
        position: 'absolute',
        top: '0%',
        right: '0%',
        boxSizing: 'border-box'
      },
      Com_Unit_UnitImgLayers_contentSection_links_: {
        width: '14%',
        height: '100%',
        position: 'absolute',
        top: '0%',
        left: '0%',
        boxSizing: 'border-box'
      },
      Com_Unit_UnitImgLayers_contentSection_links_nouns: {
        width: '100%',
        position: 'absolute',
        bottom: '3%',
        left: '0',
        boxSizing: 'border-box',
        padding: '4%',
        textAlign: 'right'
      },
      Com_Unit_UnitImgLayers_commonSection_: {
        width: '100%',
        height: '4%',
        position: 'absolute',
        bottom: '0%',
        left: '0%',
        boxSizing: 'border-box',
        boxShadow: '0px 2vh 1.8vh -2vh',
        backgroundColor: '#313130'
      },
      Com_Unit_UnitImgLayers_commonSection_ActionPanel: {
        width: '36%',
        height: '100%',
        position: 'absolute',
        bottom: '0',
        left: '0',
        boxSizing: 'border-box'
      },
      Com_Unit_UnitImgLayers_commonSection_InfoPanel_: {
        height: '100%',
        position: 'absolute',
        top: '0%',
        right: '5%',
        boxSizing: 'border-box',
      },
      Com_Unit_UnitImgLayers_commonSection_InfoPanel_blocks_: {
        height: '100%',
        position: 'relative',
        float: 'right',
        boxSizing: 'border-box',
        marginLeft: '2vw'
      }
    }
  }

  render(){
    return(
      <div>
        <div
          style={this.style.Com_Unit_UnitImgLayers_contentSection_}>
          <div
            style={this.style.Com_Unit_UnitImgLayers_contentSection_links_}>
            {
              this.props.unitCurrent.nouns &&
              <div
                style={this.style.Com_Unit_UnitImgLayers_contentSection_links_nouns}>
                <NounsExtensible
                  nouns={this.props.unitCurrent.nouns}
                  _handleClick_listNoun={this.props._refer_toandclose}/>
              </div>
            }
          </div>
          <div
            style={this.style.Com_Unit_UnitImgLayers_contentSection_frame}>
            <ImgLayersFrame
              moveCount={this.props.moveCount}
              lockify={this.props.lockify}
              marksStatus={this.props.marksStatus}
              _set_markOpened={this.props._set_markOpened}/>
          </div>
        </div>
        <div
          style={this.style.Com_Unit_UnitImgLayers_commonSection_}>
          <div
            style={this.style.Com_Unit_UnitImgLayers_commonSection_ActionPanel}>
            <UnitActionPanel
              _set_Modalmode={this.props._set_Modalmode}/>
          </div>
          <div
            style={this.style.Com_Unit_UnitImgLayers_commonSection_InfoPanel_}>
            <div
              style={Object.assign({color: 'rgb(250, 250, 250)', cursor:'pointer'},this.style.Com_Unit_UnitImgLayers_commonSection_InfoPanel_blocks_)}>
              <NameLabelRe
                size={'small'}
                accountId={this.props.unitCurrent.authorBasic.authorId}
                accountFisrtName={this.props.unitCurrent.authorBasic.firstName}
                accountLastName={this.props.unitCurrent.authorBasic.lastName}
                _handleClick_Account={this.props._refer_toandclose}/>
            </div>
            <div
              style={Object.assign({color: '#FAFAFA'},this.style.Com_Unit_UnitImgLayers_commonSection_InfoPanel_blocks_)}>
              <DateConverter
                datetime={this.props.unitCurrent.createdAt}/>
            </div>
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
