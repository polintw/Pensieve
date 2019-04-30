import React from 'react';
import {
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import {NounsStatic} from './UnitComponent.jsx';
import ImgPreview from '../ImgPreview.jsx';
import DateConverter from '../DateConverter.jsx';
import MarksArticle from '../MarksArticle.jsx';
import SvgCreateonDialog from '../Svg/SvgCreateonDialog.jsx'
import {NameLarge} from '../AccountPlate.jsx';

const styleMiddle = {
  boxInlineRelative: {
    display: 'inline-block',
    position: 'relative',
    boxSizing:'border-box',
  },
  imgBLockPreview: {
    display: 'inline-block',
    width: '46%',
    height: '100%',
    position: 'relative',
    boxSizing: 'border-box',
    marginRight: '3%',
    boxShadow: '0rem 0.1rem 0.5rem 0px',
    borderRadius: '0.5vw',
    overflow: 'hidden',
    cursor: 'pointer'
  },
}

class UnitSummaryNail extends React.Component {
  //assume there is a future requirement for animating to /related
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      Com_UnitViewSummaryNail_: {
        width: '100%',
        height: '20%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        backgroundColor: '#313130',
        boxShadow: '0px 1.2vh 2.4vw 0vw'
      }
    };
  }

  componentDidMount(){
    //there should be some animation to toggle between close and extend, as a refer hint
    this.props._close_modal_Unit(); //temp method, should refer to /relations after relations component was created
  }

  componentWillUnmount(){

  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.Com_UnitViewSummaryNail_}>

      </div>
    )
  }
}

class UnitViewSummary extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.marksArticle = React.createRef();
    this._handleClick_thumbnail = this._handleClick_thumbnail.bind(this);
    this._handleClick_UnitAction_response = this._handleClick_UnitAction_response.bind(this);
    this._handleWheel_marksArticle = (event)=>{event.stopPropagation();};
    this.style={
      Com_UnitViewSummary_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box'
      },
      Com_UnitViewSummary_Marksarticle: {
        width: "41%",
        height: '77%',
        position: 'absolute',
        right: '3%',
        bottom: '6%',
        boxSizing: 'border-box',
        paddingBottom: '3%',
        backgroundColor: 'transparent',
        overflowY: 'auto'
      },
      Com_UnitViewSummary_thumbnails_: {
        width: '51%',
        height: '37%',
        position: 'absolute',
        top: '30%',
        left: '4%',
        boxSizing: 'border-box'
      },
      Com_UnitViewSummary_response_: {
        width: '18%',
        height: '16%',
        position: 'absolute',
        bottom: '4%',
        left: '33%',
        boxSizing: 'border-box',
        cursor: 'pointer'
      },
      Com_UnitViewSummary_author_: {
        position: 'absolute',
        top: '8%',
        left: '6%',
        boxSizing: 'border-box'
      },
      Com_UnitViewSummary_author_name: {
        display: 'inline-block',
        boxSizing: 'border-box',
        color: '#FAFAFA',
      },
      Com_UnitViewSummary_unitinfo_simple_: {
        position: 'absolute',
        top: '93%',
        left: '6%',
        boxSizing: 'border-box'
      },
      Com_UnitViewSummary_unitinfo_simple_date: {
        color: '#e6e6e6',
      }
    };
  }

  _handleClick_thumbnail(layer){
    let moveCount = (layer=='cover')? 0 : 100;
    this.props._set_layerstatus(true, parseInt(moveCount));
  }

  _handleClick_UnitAction_response(event){
    event.stopPropagation();
    event.preventDefault();
    this.props._set_Modalmode("response");
  }

  componentDidMount(){
    this.marksArticle.current.addEventListener('wheel', this._handleWheel_marksArticle, {passive: false})
    //because the modern browser set the 'passive' property of addEventListener default to true,
    //they do it for 'efficiency', but it obstruct our desire to control this event
    //so we could only add listener like this way to set the 'passive' manually.
  }

  componentWillUnmount(){
    this.marksArticle.current.removeEventListener('wheel',this._handleWheel_marksArticle);
  }

  render(){
    //let cx = cxBind.bind(styles);

    //prepare beneath line for future, connecting to /related
    if(this.props.moveCount > 240) return (<UnitSummaryNail  _close_modal_Unit={this.props._close_modal_Unit}/>);
    let marksObj = {
      list: this.props.unitCurrent.coverMarksList.concat(this.props.unitCurrent.beneathMarksList),
      data: Object.assign({}, this.props.unitCurrent.coverMarksData, this.props.unitCurrent.beneathMarksData)
    };

    return(
      <div
        style={this.style.Com_UnitViewSummary_}>
        <div
          style={this.style.Com_UnitViewSummary_author_}>
          <div
            style={this.style.Com_UnitViewSummary_author_name}>
            <NameLarge
              firstName={this.props.unitCurrent.authorBasic.firstName}
              lastName={this.props.unitCurrent.authorBasic.lastName}/>
          </div>
        </div>
        <div
          ref={this.marksArticle}
          style={this.style.Com_UnitViewSummary_Marksarticle}>
          <MarksArticle
            layer={''}
            marksObj={marksObj}
            _set_MarkInspect={()=>{}}/>
        </div>
        <div
          style={this.style.Com_UnitViewSummary_thumbnails_}>
          <div
            style={Object.assign({}, styleMiddle.imgBLockPreview)}>
            <ImgPreview
              blockName={'cover'}
              previewSrc={this.props.unitCurrent.coverSrc}
              _handleClick_ImgPreview_preview={this._handleClick_thumbnail}/>
          </div>
          {
            this.props.unitCurrent.beneathSrc &&
            <div
              style={Object.assign({}, styleMiddle.imgBLockPreview)}>
              <ImgPreview
                blockName={'beneath'}
                previewSrc={this.props.unitCurrent.beneathSrc}
                _handleClick_ImgPreview_preview={this._handleClick_thumbnail}/>
            </div>
          }
        </div>
        <div
          style={this.style.Com_UnitViewSummary_unitinfo_simple_}>
          <div
            style={Object.assign({}, this.style.Com_UnitViewSummary_unitinfo_simple_date, styleMiddle.boxInlineRelative)}>
            <DateConverter
              datetime={this.props.unitCurrent.createdAt}/>
          </div>
        </div>
        <div
          style={this.style.Com_UnitViewSummary_response_}
          onClick={this._handleClick_UnitAction_response}>
          <SvgCreateonDialog/>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent
  }
}

export default withRouter(connect(
  mapStateToProps,
  null
)(UnitViewSummary));
