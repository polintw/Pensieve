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
    width: '96%',
    height: '100%',
    position: 'absolute',
    top: '0%',
    right: '4%',
    boxSizing: 'border-box',
    backgroundColor: '#101010'
  },
  boxImgFrame: {
    width: '81%',
    height: '96%',
    position: 'absolute',
    top: '0%',
    right: '0%',
    boxSizing: 'border-box'
  },
  boxActionPanel: {
    width: '36%',
    height: '4%',
    position: 'absolute',
    bottom: '0',
    right: '0',
    boxSizing: 'border-box'
  },
  boxAuthor: {
    maxWidth: '11%',
    position: 'absolute',
    top: '66%',
    right: '87.4%',
    boxSizing: 'border-box',
  },
  boxNodes: {
    width: '14%',
    minHeight: '29%',
    maxHeight: '39%',
    position: 'absolute',
    top: '23%',
    left: '0%',
    boxSizing: 'border-box',
    backgroundColor: '#4a4a4a',
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
        padding: '8% 7% 8% 4%',
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
      <div>
        <div
          style={styleMiddle.boxContent}>
          <div
            style={styleMiddle.boxAuthor}>
            <div
              onClick={this._handleClick_Account}
              style={Object.assign({textAlign: 'center', cursor:'pointer'},this.style.Com_Unit_UnitImgLayers_commonSection_InfoPanel_blocks_)}>
              <AccountPlate
                size={'regular'}
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
                className={'verticalAlignChild nodesListLayers'}
                style={this.style.Com_Unit_UnitImgLayers_contentSection_links_nouns}>
                <NounsExtensible
                  nouns={this.props.unitCurrent.nouns}
                  _handleClick_listNoun={this.props._refer_toandclose}/>
              </div>
            }
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
        <div
          style={styleMiddle.boxActionPanel}>
          <UnitActionPanel
            _set_Modalmode={this.props._set_Modalmode}/>
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
