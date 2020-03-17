import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import { connect } from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import ImgsFrame from './ImgsFrame.jsx';
import SidePanel from './SidePanel.jsx';
import {NodesExtensible} from '../../NodesDisplay/NodesExtensible.jsx';
import AccountPalette from '../../../Components/AccountPalette.jsx';
import DateConverter from '../../../Components/DateConverter.jsx';

const styleMiddle = {
  boxImgFrame: {
    width: '77%',
    height: '90%',
    position: 'absolute',
    top: '0%',
    left: '16%',
    boxSizing: 'border-box'
  },
  boxActionPanel: {
    position: 'absolute',
    top: '29%',
    right: '84%',
    boxSizing: 'border-box'
  },
  boxAuthor: {
    width: '100%',
    position: 'relative',
    boxSizing: 'border-box',
  },
  boxNodes: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
    maxHeight: '44%',
    minHeight: '242px',
    boxSizing: 'border-box',
    overflow: 'hidden' //just a temp method
  }
}

class Wrapper extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._handleClick_Account = this._handleClick_Account.bind(this);
    this.style={
      Com_Unit_ImgLayers_contentSection_links_nouns: {
        width: '100%',
        boxSizing: 'border-box',
        textAlign: 'right',
        paddingRight: '13%',
        borderRight:'0.75px solid #FAFAFA'
      },
      Com_Unit_ImgLayers_commonSection_InfoPanel_blocks_: {
        height: '100%',
        position: 'relative',
        boxSizing: 'border-box',
        marginBottom: '0.6rem',
      }
    }
  }

  _handleClick_Account(event){
    event.preventDefault();
    event.stopPropagation();
    // rm this action temporary
    //this.props._refer_toandclose('user', this.props.unitCurrent.authorBasic.authorId);
  }


  render(){
    return(
      <div
        className={classnames('boxAbsoluteFull', styles.comWrapper)}>
        <div
          className={classnames(styles.boxImgLeft)}>
          <div
            style={styleMiddle.boxNodes}>
            {
              this.props.unitCurrent.nouns &&
              <div
                className={'nodesListLayers'}
                style={this.style.Com_Unit_ImgLayers_contentSection_links_nouns}>
                <NodesExtensible
                  nouns={this.props.unitCurrent.nouns}
                  styleItem= {{margin: '0 0 2.32rem'}}
                  _handleClick_listNoun={this.props._refer_toandclose}/>
              </div>
            }
          </div>
          <div
            style={styleMiddle.boxAuthor}>
            <div
              style={this.style.Com_Unit_ImgLayers_commonSection_InfoPanel_blocks_}>
              <DateConverter
                place={'layers'}
                datetime={this.props.unitCurrent.createdAt}/>
            </div>
            <div
              onClick={this._handleClick_Account}
              style={Object.assign({}, this.style.Com_Unit_ImgLayers_commonSection_InfoPanel_blocks_,{marginBottom:'0.5rem',textAlign: 'right'})}>
              <AccountPalette
                size={'layer'}
                accountFirstName={this.props.unitCurrent.authorBasic.firstName}
                accountLastName={this.props.unitCurrent.authorBasic.lastName}/>
            </div>
          </div>
        </div>
        <div
          className={classnames(styles.boxImgBottom)}>
          <SidePanel
            _set_Modalmode={this.props._set_Modalmode}/>
        </div>
        <div
          style={styleMiddle.boxImgFrame}>
          <ImgsFrame
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
  }
}

export default withRouter(connect(
  mapStateToProps,
  null
)(Wrapper));
