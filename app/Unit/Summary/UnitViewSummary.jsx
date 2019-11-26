import React from 'react';
import {
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import SumBroadList from './SumBroadList.jsx';
import MarksArticle from '../MarksArticle.jsx';
import {NodesExtensible} from '../NodesDisplay/NodesDisplay.jsx';
import ActionBroad from '../Actions/ActionBroad.jsx';
import DateConverter from '../../Component/DateConverter.jsx';
import {AccountPlate} from '../../Component/AccountPlate.jsx';

const styleMiddle = {

}

class UnitViewSummary extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.marksArticle = React.createRef();
    this._set_layerstatus = this._set_layerstatus.bind(this);
    this._handleClick_Account = this._handleClick_Account.bind(this);
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
        width: "51%",
        height: '81.5%',
        position: 'absolute',
        right: '0%',
        top: '5.5%',
        boxSizing: 'border-box',
        overflowY: 'auto'
      },
      Com_UnitViewSummary_panel_: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent:'flex-end',
        width: '8%',
        height: '11%',
        position: 'absolute',
        bottom: '13%',
        left: '34.5%',
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

  _handleClick_Account(event){
    event.preventDefault();
    event.stopPropagation();
    this.props._refer_toandclose('user', this.props.unitCurrent.authorBasic.authorId);
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
          className={classnames(styles.boxSideLeft)}>
          <div
            className={classnames('nodesListSum', styles.boxNodes)}>
            <NodesExtensible
              nouns={this.props.unitCurrent.nouns}
              styleItem={{margin: '0 0 1rem'}}
              _handleClick_listNoun={this.props._refer_toandclose}/>
          </div>
          <div
            className={classnames(styles.boxSumBroad)}>
            <SumBroadList/>
          </div>
          <div
            className={classnames(styles.boxAuthor)}>
            <div
              className={'boxInlineRelative'}
              style={Object.assign({}, {display: 'block', marginBottom: '1rem'})}>
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
          style={this.style.Com_UnitViewSummary_panel_}>
          <div
            className={classnames()}>
            <ActionBroad/>
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
)(UnitViewSummary));
