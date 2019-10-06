import React from 'react';
import {
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import MarksArticle from './MarksArticle.jsx';
import {NodesExtensible} from './NodesDisplay/NodesDisplay.jsx';
import AuthorStatics from './Author/AuthorStatics.jsx';
import DateConverter from '../Component/DateConverter.jsx';
import {AccountPlate} from '../Component/AccountPlate.jsx';

const styleMiddle = {
  boxStatics: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '8%',
    height: '64%',
    position: 'absolute',
    bottom: '13%',
    left: '36%',
    boxSizing: 'border-box'
  },
}

class UnitAuthorSummary extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onActEdit: false
    };
    this.marksArticle = React.createRef();
    this._set_layerstatus = this._set_layerstatus.bind(this);
    this._handleClick_Account = this._handleClick_Account.bind(this);
    this._handleEnter_actEdit = this._handleEnter_actEdit.bind(this);
    this._handleLeave_actEdit = this._handleLeave_actEdit.bind(this);
    this._handleClick_UnitAction_Author = this._handleClick_UnitAction_Author.bind(this);
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
        width: "44%",
        height: '81.5%',
        position: 'absolute',
        right: '0%',
        top: '5.5%',
        boxSizing: 'border-box',
        overflowY: 'auto'
      },
      Com_UnitViewSummary_nodes_: {
        maxWidth: '22%',
        maxHeight: '40%',
        position: 'absolute',
        top: '33%',
        right: '71%',
        boxSizing: 'border-box',
        transform: 'translate(0,-50%)',
        overflow:'hidden'
      },
      Com_UnitViewSummary_author_: {
        maxWidth: '27%',
        position: 'absolute',
        bottom: '13%',
        right: '71%',
        boxSizing: 'border-box'
      },
      Com_UnitViewSummary_author_name: {
        position: 'relative',
        boxSizing: 'border-box',
        color: '#FAFAFA',
        cursor: 'pointer'
      },
    };
  }

  _set_layerstatus(layer, markKey){
    let moveCount = (layer=='cover')? 0 : 100;
    let marksStatus = markKey? {marksify: true, initMark: markKey}: {marksify: false, initMark: "all"};
    this.props._set_layerstatus(true, parseInt(moveCount), marksStatus);
  }

  _handleClick_UnitAction_Author(event){
    event.preventDefault();
    event.stopPropagation();
    this.props._set_Modalmode("author_editing");
  }

  _handleClick_Account(event){
    event.preventDefault();
    event.stopPropagation();
    this.props._refer_toandclose('user', this.props.unitCurrent.authorBasic.authorId);
  }

  _handleEnter_actEdit(e){
    //don't need to stop proppagation,
    //because both the 'onMouseEnter' & 'onMouseLeave'
    //would not 'bubble'
    this.setState({
      onActEdit: true
    })
  }

  _handleLeave_actEdit(e){
    //don't need to stop proppagation,
    //because both the 'onMouseEnter' & 'onMouseLeave'
    //would not 'bubble'
    this.setState({
      onActEdit: false
    })
  }

  componentDidMount(){
    this.marksArticle.current.addEventListener('wheel', this._handleWheel_marksArticle, {passive: false})
    //because the modern browser set the 'passive' property of addEventListener default to true,
    //so we could only add listener like this way to set the 'passive' manually.
    //and becuase we preventDefault in LayerScroll, the scroll will totally be ignore
    //so we need to stopPropagation if there is a scroll box in any child of LayerScroll
  }

  componentWillUnmount(){
    this.marksArticle.current.removeEventListener('wheel',this._handleWheel_marksArticle);
  }

  render(){
    return(
      <div
        style={this.style.Com_UnitViewSummary_}>
        <div
          style={this.style.Com_UnitViewSummary_author_}>
          <div
            className={'boxInlineRelative'}
            style={Object.assign({}, {display: 'block', marginBottom: '2rem'})}>
            <DateConverter
              place={'layers'}
              datetime={this.props.unitCurrent.createdAt}/>
          </div>
          <div
            onClick={this._handleClick_Account}
            style={this.style.Com_UnitViewSummary_author_name}>
            <AccountPlate
              size={'title'}
              accountFisrtName={this.props.unitCurrent.authorBasic.firstName}
              accountLastName={this.props.unitCurrent.authorBasic.lastName}/>
          </div>
        </div>
        <div
          ref={this.marksArticle}
          style={this.style.Com_UnitViewSummary_Marksarticle}>
          <MarksArticle
            layer={'cover'}
            marksObj={{list: this.props.unitCurrent.coverMarksList, data: this.props.unitCurrent.coverMarksData}}
            _set_MarkInspect={this._set_layerstatus}/>
          <MarksArticle
            layer={'beneath'}
            marksObj={{list: this.props.unitCurrent.beneathMarksList, data: this.props.unitCurrent.beneathMarksData}}
            _set_MarkInspect={this._set_layerstatus}/>
        </div>
        <div
          className={'nodesListSum'}
          style={this.style.Com_UnitViewSummary_nodes_}>
          <NodesExtensible
            nouns={this.props.unitCurrent.nouns}
            styleItem={{margin: '0 0 1rem'}}
            _handleClick_listNoun={this.props._refer_toandclose}/>
        </div>
        <div
          style={styleMiddle.boxStatics}>
          <AuthorStatics/>
          <div
            className={classnames('sumPanelOptions', 'boxSumOptEdit')}>
            <span
              className={classnames('fontSumOpt')}
              style={Object.assign(
                {},
                {cursor: 'pointer'},
                this.state.onActEdit? {color: '#FAFAFA'}:{color: 'rgba(250,250,250,0.5)'}
              )}
              onClick={this._handleClick_UnitAction_Author}
              onMouseEnter={this._handleEnter_actEdit}
              onMouseLeave={this._handleLeave_actEdit}>
              {"edit"}
            </span>
          </div>
          <div
            className={'sumPanelOptions'}
            style={{cursor: 'pointer'}}
            onClick={this._handleClick_UnitAction_response}>
            <SvgCreate
              place={true}/>
          </div>
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
)(UnitAuthorSummary));
