import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import { connect } from "react-redux";
import ImgLayersFrame from './ImgLayersFrame.jsx';
import UnitActionPanel from './UnitActionPanel.jsx';
import {NounsExtensible} from './UnitComponent.jsx';
import {AccountPlate} from '../AccountPlate.jsx';
import DateConverter from '../DateConverter.jsx';

const styleMiddle = {
  boxContent: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: '0%',
    right: '0%',
    boxSizing: 'border-box',
  },
  boxImgFrame: {
    width: '79%',
    height: '100%',
    position: 'absolute',
    top: '0%',
    right: '0%',
    boxSizing: 'border-box'
  },
  boxActionPanel: {
    width: '16%',
    height: '7%',
    position: 'absolute',
    top: '0',
    left: '0',
    boxSizing: 'border-box'
  },
  boxAuthor: {
    maxWidth: '15%',
    position: 'absolute',
    bottom: '53.5%',
    right: '84%',
    boxSizing: 'border-box',
  },
  boxNodes: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    width: '17%',
    height: '273px',
    position: 'absolute',
    bottom: '5%',
    left: '0%',
    boxSizing: 'border-box',
    overflow: 'hidden' //just a temp method
  }
}

class UnitImgLayers extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._handleClick_Account = this._handleClick_Account.bind(this);
    this.style={
      Com_Unit_UnitImgLayers_contentSection_links_nouns: {
        width: '100%',
        boxSizing: 'border-box',
        textAlign: 'right'
      },
      Com_Unit_UnitImgLayers_commonSection_InfoPanel_blocks_: {
        height: '100%',
        position: 'relative',
        boxSizing: 'border-box',
        marginBottom: '0.6rem',
        color: 'rgb(250, 250, 250)',
      }
    }
  }

  _handleClick_Account(event){
    event.preventDefault();
    event.stopPropagation();
    this.props._refer_toandclose('user', this.props.unitCurrent.authorBasic.authorId);
  }


  render(){
    return(
      <div
        style={styleMiddle.boxContent}>
        <div
          style={styleMiddle.boxAuthor}>
          <div
            onClick={this._handleClick_Account}
            style={Object.assign({}, this.style.Com_Unit_UnitImgLayers_commonSection_InfoPanel_blocks_,{marginBottom:'0.7rem',textAlign: 'right', cursor:'pointer'})}>
            <AccountPlate
              size={'layer'}
              accountFisrtName={this.props.unitCurrent.authorBasic.firstName}
              accountLastName={this.props.unitCurrent.authorBasic.lastName}/>
          </div>
          <div
            style={this.style.Com_Unit_UnitImgLayers_commonSection_InfoPanel_blocks_}>
            <DateConverter
              place={'layers'}
              datetime={this.props.unitCurrent.createdAt}/>
          </div>
        </div>
        <div
          style={styleMiddle.boxNodes}>
          {
            this.props.unitCurrent.nouns &&
            <div
              className={'nodesListLayers'}
              style={this.style.Com_Unit_UnitImgLayers_contentSection_links_nouns}>
              <NounsExtensible
                nouns={this.props.unitCurrent.nouns}
                _handleClick_listNoun={this.props._refer_toandclose}/>
            </div>
          }
        </div>
        <div
          style={styleMiddle.boxActionPanel}>
          <UnitActionPanel
            _set_Modalmode={this.props._set_Modalmode}/>
        </div>

        <div
          style={styleMiddle.boxImgFrame}>
          <ImgLayersFrame
            moveCount={this.props.moveCount}
            lockify={this.props.lockify}
            marksStatus={this.props.marksStatus}
            _set_markOpened={this.props._set_markOpened}
            _set_layerstatus={this.props._set_layerstatus}/>
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
