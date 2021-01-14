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
import AuthorStatics from './Author/AuthorStatics.jsx';
import Inspired from '../components/Inspired/Inspired.jsx';
import Primer from '../components/Primer.jsx';
import BtnOpenMap from '../components/BtnOpenMap/BtnOpenMap.jsx';
import NodesExtensible from '../../NodesDisplay/NodesExtensible.jsx';
import LinkFetch from '../../../Components/LinkFetch/LinkFetch.jsx';
import ImgPreview from '../../../Components/ImgPreview.jsx';
import LinkCopy from '../../../Components/LinkCopy/LinkCopy.jsx';
import MapUnit from '../../../Components/Map/MapUnit.jsx';
import AccountPalette from '../../../Components/AccountPalette.jsx';
import DateConverter from '../../../Components/DateConverter.jsx';
import {
  domain
} from '../../../../config/services.js';

class Wrapper extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      frameView: 'img',
      onPrimerImg: false,
    };
    this._set_frameView = this._set_frameView.bind(this);
    this._handleClick_Account = this._handleClick_Account.bind(this);
    this._handleEnter_primerImg = this._handleEnter_primerImg.bind(this);
    this._handleLeave_primerImg = this._handleLeave_primerImg.bind(this);
    this._handleClick_Primerhref = this._handleClick_Primerhref.bind(this);
  }

  _handleClick_Account(event){
    event.preventDefault();
    event.stopPropagation();
    // rm this action temporary
    //this.props._refer_toandclose('user', this.props.unitCurrent.authorBasic.authorId);
  }


  render(){
    let nodesTitleObj = this.props.unitCurrent.nouns;
    if(this.props.guidingNailsId.indexOf(this.props.unitCurrent.unitId) != (-1) ){ // guidingNails has its special title
      nodesTitleObj = {
        list: [4692], // an empty position in DB, to prevent a conflict between real node
        basic: {
          4692: {name: this.props.i18nUIString.catalog['title_onBoard_GuideNailTitle'][this.props.guidingNailsId.indexOf(this.props.unitCurrent.unitId)]}
        }
      }
    };

    return(
      <div
        className={classnames( styles.comWrapper)}>
        <div
          className={classnames(styles.boxContentWidth, styles.boxTitle)}>
          <NodesExtensible
            nouns={nodesTitleObj}
            _referNode={this.props._refer_toandclose}/>
          <SidePanel
            {...this.props}/>
        </div>
        <div
          className={classnames(
            styles.boxContentWidth, styles.boxFrame,
            {[styles.boxFrameAuthor]: (this.props.unitCurrent.identity == "author")}
            )}>
          {
            (this.state.frameView == "map") ? (
              !!this.props.unitCurrent.imgLocation.longitude &&
              <MapUnit
                popupImgSrc={this.props.unitCurrent.coverSrc}
                coordinates={this.props.unitCurrent.imgLocation}
                _handleClick_popupMainImg={()=>{this._set_frameView('img')}}/>
            ): (
              <ImgsFrame
                moveCount={this.props.moveCount}
                lockify={this.props.lockify}
                marksStatus={this.props.marksStatus}
                _set_markOpened={this.props._set_markOpened}
                _set_layerstatus={this.props._set_layerstatus}/>
            )
          }
          {
            (this.props.unitCurrent.identity == "author") &&
            <div
              className={classnames(styles.boxAuthorStatics)}>
                <AuthorStatics/>
            </div>
          }
        </div>
        <div
          className={classnames(styles.boxContentWidth, styles.boxBottom)}>
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
                  frameView={this.state.frameView}
                  _set_frameView={this._set_frameView}/>
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

  _handleClick_Primerhref(event){
    event.preventDefault();
    event.stopPropagation();
    if(!this.props.location.pathname.includes('explore/unit')){
      // the browser, which do not know the origin it has was modified, need to be modified again to have the pratical history
      window.history.replaceState(this.props.location.state, '', this.props.location.pathname+this.props.location.search);
    };
    //and Notice! history should be pushed after the replaceState has been done
    let urlParams = new URLSearchParams(this.props.location.search);
    urlParams.set('unitId', this.props.unitCurrent.primer.primerId);
    urlParams.set('unitView', "theater");
    this.props.history.push({
      pathname: this.props.match.path, //should always be ".../unit" because primer only used in a Unit
      search: urlParams.toString(),
      state: {from: this.props.location}
    });
  }

  _set_frameView(targetView){
    this.setState({
      frameView: targetView
    });
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
    guidingNailsId: state.guidingNailsId,
    unitCurrent: state.unitCurrent,
    i18nUIString: state.i18nUIString
  }
}

export default withRouter(connect(
  mapStateToProps,
  null
)(Wrapper));
