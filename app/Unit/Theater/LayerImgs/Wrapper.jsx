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
import Primer from '../components/Primer.jsx';
import {NodesExtensible} from '../../NodesDisplay/NodesExtensible.jsx';
import ImgPreview from '../../../Components/ImgPreview.jsx';
import AccountPalette from '../../../Components/AccountPalette.jsx';
import DateConverter from '../../../Components/DateConverter.jsx';

class Wrapper extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onPrimerImg: false
    };
    this._handleClick_Account = this._handleClick_Account.bind(this);
    this._handleEnter_primerImg = this._handleEnter_primerImg.bind(this);
    this._handleLeave_primerImg = this._handleLeave_primerImg.bind(this);
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
          <div>
            <div
              className={classnames(styles.boxBottomUpper)}
              style={{color: '#757575'}}
              onClick={this._handleClick_Account}>
              <AccountPalette
                size={'layer'}
                accountFirstName={this.props.unitCurrent.authorBasic.firstName}
                accountLastName={this.props.unitCurrent.authorBasic.lastName}/>
            </div>
            <div
              className={classnames(styles.boxBottomLower)}>
              <div style={{marginRight: '5rem'}}>
                <DateConverter
                  styles={{color: '#a3a3a3'}}
                  datetime={this.props.unitCurrent.createdAt}/>
              </div>
              <div>
                {
                  this.props.unitCurrent.primerify &&
                  <Primer
                    {...this.props}/>
                }
              </div>
            </div>
          </div>
          {
            this.props.unitCurrent.primerify &&
            <Link
              to={{
                pathname: this.props.match.path, //should always be ".../unit" because primer only used in a Unit
                search: '?theater&unitId='+this.props.unitCurrent.primer.primerId,
                state: {from: this.props.location}
              }}
              className={classnames('plainLinkButton', styles.boxLinkPrimerImg)}
              style={{opacity: this.state.onPrimerImg? '1' : "0.3"}}
              onMouseEnter={this._handleEnter_primerImg}
              onMouseLeave={this._handleLeave_primerImg}>
              <ImgPreview
                blockName={''}
                previewSrc={'/router/img/'+this.props.unitCurrent.primerSrc+'?type=thumb'}
                _handleClick_ImgPreview_preview={()=>{/*nothing need to happen*/}}/>
            </Link>
          }
        </div>

      </div>
    )
  }

  _handleEnter_primerImg(e){
    this.setState({onPrimerImg: true})
  }

  _handleLeave_primerImg(e){
    this.setState({onPrimerImg: false})
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
