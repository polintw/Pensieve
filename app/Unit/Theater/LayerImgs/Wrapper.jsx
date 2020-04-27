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

class Wrapper extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._handleClick_Account = this._handleClick_Account.bind(this);
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
        className={classnames( styles.comWrapper)}>
        <div
          className={classnames(styles.boxContentWidth, styles.boxTitle)}>
          {
            this.props.unitCurrent.nouns &&
            <NodesExtensible
              nouns={this.props.unitCurrent.nouns}
              _handleClick_listNoun={this.props._refer_toandclose}/>
          }
          <SidePanel/>
        </div>
        <div
          className={classnames(styles.boxContentWidth, styles.boxFrame)}>
          <ImgsFrame
            moveCount={this.props.moveCount}
            lockify={this.props.lockify}
            marksStatus={this.props.marksStatus}
            _set_markOpened={this.props._set_markOpened}
            _set_layerstatus={this.props._set_layerstatus}/>
        </div>
        <div
          className={classnames(styles.boxContentWidth, styles.boxBottom)}>
          <div
            className={classnames(styles.boxBottomUpper)}
            style={{color: '#757575'}}
            onClick={this._handleClick_Account}>
            <AccountPalette
              size={'layer'}
              accountFirstName={this.props.unitCurrent.authorBasic.firstName}
              accountLastName={this.props.unitCurrent.authorBasic.lastName}/>
          </div>
          <div>
            <DateConverter
              styles={{color: '#a3a3a3'}}
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
  }
}

export default withRouter(connect(
  mapStateToProps,
  null
)(Wrapper));
