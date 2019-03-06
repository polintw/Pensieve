import React from 'react';
import {
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import cxBind from 'classnames/bind';
import MarksArticle from '../MarksArticle.jsx';
class UnitSummaryNail extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      Com_UnitViewSummary_: {
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
        style={this.style.Com_UnitViewSummary_}>

      </div>
    )
  }
}

class UnitViewSummary extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._handleClick_thumbnail = this._handleClick_thumbnail.bind(this);
    this._handleClick_UnitAction_response = this._handleClick_UnitAction_response.bind(this);
    this.style={
      Com_UnitViewSummary_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        backgroundColor: '#313130',
        boxShadow: '0px 1.2vh 2.4vw 0vw'
      },
      Com_UnitViewSummary_Marksarticle: {
        width: "30%",
        height: '100%',
        position: 'absolute',
        left: '0',
        top: '0',
        boxSizing: 'border-box',
        backgroundColor: '#f8f8f8',
        overflowY: 'scroll'
      },
      Com_UnitViewSummary_thumbnails_: {
        width: '30%',
        height: '64%',
        position: 'absolute',
        bottom: '0',
        left: '31%',
        boxSizing: 'border-box'
      },
      Com_UnitViewSummary_thumbnails_img: {
        maxWidth: '100%',
        maxHeight: '49%',
        position: 'relative',
        float: 'center'
      },
      Com_UnitViewSummary_response_: {
        width: '36%',
        height: '30%',
        position: 'absolute',
        bottom: '0',
        left: '63%',
        boxSizing: 'border-box',
        padding: '1vh',
        curso: 'pointer'
      }
    };
  }

  _handleClick_thumbnail(event){
    event.stopPropagation();
    event.preventDefault();
    let moveCount = event.currentTarget.getAttribute('layer');
    this.props._set_layerstatus(true, parseInt(moveCount));
  }

  _handleClick_UnitAction_response(event){
    event.stopPropagation();
    event.preventDefault();
    this.props._set_Modalmode("response");
  }

  componentWillUnmount(){

  }

  render(){
    //let cx = cxBind.bind(styles);
    if(this.props.moveCount == 240) return (<UnitSummaryNail  _close_modal_Unit={this.props._close_modal_Unit}/>);
    let marksObj = {
      list: this.props.unitCurrent.coverMarksList.concat(this.props.unitCurrent.beneathMarksList),
      data: Object.assign({}, this.props.unitCurrent.coverMarksData, this.props.unitCurrent.beneathMarksData)
    };

    return(
      <div
        style={this.style.Com_UnitViewSummary_}>
        <div
          style={this.style.Com_UnitViewSummary_Marksarticle}
          onWheel={(event)=>{event.stopPropagation();}}>
          <MarksArticle
            layer={''}
            marksObj={marksObj}
            _set_MarkInspect={()=>{}}/>
        </div>
        <div
          style={this.style.Com_UnitViewSummary_thumbnails_}>
          <img
            style={this.style.Com_UnitViewSummary_thumbnails_img}
            layer={0}
            src={this.props.unitCurrent.coverSrc}
            onClick={this._handleClick_thumbnail}/>
          {
            this.props.unitCurrent.beneathSrc &&
            <img
              style={this.style.Com_UnitViewSummary_thumbnails_img}
              layer={100}
              src={this.props.unitCurrent.beneathSrc}
              onClick={this._handleClick_thumbnail}/>
          }
        </div>
        <div
          style={this.style.Com_UnitViewSummary_response_}
          onClick={this._handleClick_UnitAction_response}>
          <SvgCreateCoral />
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
