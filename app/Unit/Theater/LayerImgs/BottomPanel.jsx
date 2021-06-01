import React from 'react';
import {
  Route,
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import Primer from '../components/Primer.jsx';
import Inspired from '../components/Inspired/Inspired.jsx';
import BtnOpenMap from '../components/BtnOpenMap/BtnOpenMap.jsx';
import LinkCopy from '../components/LinkCopy/LinkCopy.jsx';
import ImgPreview from '../../../Components/ImgPreview.jsx';
import LinkFetch from '../../../Components/LinkFetch/LinkFetch.jsx';
import AccountPalette from '../../../Components/AccountPalette.jsx';
import DateConverter from '../../../Components/DateConverter.jsx';
import {
  domain
} from '../../../../config/services.js';

class BottomPanel extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
  }

  componentWillUnmount(){

  }

  render(){
    return(
      <div
        style={{width: '100%'}}>
        <div
          className={classnames("smallDisplayFlex", styles.comBottomPanel)}>
          <div
            className={classnames(styles.boxBottomRowPanel)}>
            {
              !!this.props.unitCurrent.imgLocation.longitude &&
              <div
                className={classnames(styles.btnBottomIcon)}>
                <BtnOpenMap
                  screenSize={'small'}
                  longitude={this.props.unitCurrent.imgLocation.longitude}
                  latitude={this.props.unitCurrent.imgLocation.latitude}
                  frameView={this.props.frameView}
                  _set_frameView={this.props._set_frameView}/>
              </div>
            }
            <div
              className={classnames(styles.btnBottomIcon)}>
              <LinkCopy {...this.props}/>
            </div>
          </div>
          <div
            className={classnames(styles.boxBottomRowAction)}>
            <div
              className={classnames(styles.boxBottomLeft)}>
              <div
                style={{color: '#FDFDFC'}}
                onClick={this._handleClick_Account}>
                <AccountPalette
                  size={'layer'}
                  referLink={
                    (this.props.unitCurrent.authorBasic['authorIdentity'] == 'user') ?
                    (domain.protocol + "://" + domain.name+ '/cosmic/explore/user?userId=' + this.props.unitCurrent.authorBasic['authorId'])
                    : (domain.protocol + "://" + domain.name+ '/cosmic/explore/path/' + this.props.unitCurrent.authorBasic['pageLink'])
                  }
                  accountFirstName={
                    (this.props.unitCurrent.authorBasic['authorIdentity'] == 'user') ?
                    this.props.unitCurrent.authorBasic.firstName: null}
                    accountLastName={
                      (this.props.unitCurrent.authorBasic['authorIdentity'] == 'user') ?
                      this.props.unitCurrent.authorBasic.lastName : this.props.unitCurrent.authorBasic.account}/>
                </div>
              <div
                className={classnames(styles.boxBottomLower)}>
                <DateConverter
                  styles={{color: '#b8b8b8'}}
                  datetime={this.props.unitCurrent.createdAt}/>
              </div>
            </div>
            {
              (this.props.unitCurrent.identity != "author") &&
              <div
                className={classnames(styles.btnIconInspired)}>
                <Inspired
                  screenSize={'small'}/>
              </div>
            }
          </div>
        </div>

        <div
          className={classnames("wideDisplayFlex", styles.comBottomPanel)}>
          <div
            className={classnames(styles.boxBottomRight)}>
            {
              !!this.props.unitCurrent.imgLocation.longitude &&
              <div
                className={classnames(styles.btnBottomIcon)}
                style={{ marginTop: '2px' }}>
                <BtnOpenMap
                  longitude={this.props.unitCurrent.imgLocation.longitude}
                  latitude={this.props.unitCurrent.imgLocation.latitude}
                  frameView={this.props.frameView}
                  _set_frameView={this.props._set_frameView}/>
              </div>
            }
            <div
              className={classnames(styles.btnBottomIcon)}
              style={{marginTop: '2px'}}>
              <LinkCopy {...this.props}/>
            </div>
            {
              (this.props.unitCurrent.identity != "author") &&
              <div
                className={classnames(styles.btnBottomIcon)}
                style={{ marginTop: '2px' }}>
                <Inspired/>
              </div>
            }
          </div>
          <div
            className={classnames(styles.boxBottomLeft)}>
            <div>
              <div
                className={classnames(styles.boxBottomUpper)}
                style={{color: '#757575'}}
                onClick={this._handleClick_Account}>
                <AccountPalette
                  size={'layer'}
                  referLink={
                    (this.props.unitCurrent.authorBasic['authorIdentity'] == 'user') ?
                    (domain.protocol + "://" + domain.name+ '/cosmic/explore/user?userId=' + this.props.unitCurrent.authorBasic['authorId'])
                    : (domain.protocol + "://" + domain.name+ '/cosmic/explore/path/' + this.props.unitCurrent.authorBasic['pageLink'])
                  }
                  accountFirstName={
                    (this.props.unitCurrent.authorBasic['authorIdentity'] == 'user') ?
                    this.props.unitCurrent.authorBasic.firstName: null}
                    accountLastName={
                      (this.props.unitCurrent.authorBasic['authorIdentity'] == 'user') ?
                      this.props.unitCurrent.authorBasic.lastName : this.props.unitCurrent.authorBasic.account}/>
                </div>
                <div
                  className={classnames(styles.boxBottomLower)}>
                  <div>
                    <DateConverter
                      styles={{color: '#a3a3a3'}}
                      datetime={this.props.unitCurrent.createdAt}/>
                  </div>
                  {
                    this.props.unitCurrent.primerify &&
                    <div style={{marginLeft: '1.5rem'}}>
                      <Primer
                        {...this.props}/>
                    </div>
                  }
                </div>
              </div>
              {
                this.props.unitCurrent.primerify &&
                <Link
                  to={''}
                  onClick={this._handleClick_Primerhref}
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
              {
                (("main" in this.props.unitCurrent.outBoundLink) &&
                !!this.props.unitCurrent.outBoundLink.main) &&
                <div
                  className={classnames(styles.boxBottomLeftFetch)}>
                  <div
                    className={classnames(styles.smallDisplayNone)}
                    style={{ borderRight: 'solid 0.75px #a3a3a3', margin: '0 1.5rem', height: '3.6rem' }} />
                  <LinkFetch
                    tagA={true}
                    quotationify={true}
                    outboundLink={this.props.unitCurrent.outBoundLink.main} />
                </div>
              }
            </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    tokenStatus: state.token,
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
    i18nUIString: state.i18nUIString,
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(BottomPanel));
