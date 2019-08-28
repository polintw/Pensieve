import React from 'react';
import {
  Link,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import NodeLinks from './NodeLinks.jsx';
import NodeContributor from './NodeContributor.jsx';
import Unit from '../../Unit/Unit/Unit.jsx';
import {
  handleNounsList,
  handleUsersList
} from "../../redux/actions/general.js";

const styleMiddle = {
  comNounSingular: {

  },
  boxScroll: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '934px',
    position: 'absolute',
    top: '5.8vh',
    left: '49%',
    transform: 'translate(-53%,0)',
    boxSizing: 'border-box'
  },
  boxTitle: {
    width: '100%',
    position: 'relative',
    boxSizing: 'border-box',
    padding: '0 0 2rem 0'
  },
  boxName: {
    display: 'inline-block',
    boxSizing: 'border-box',
    padding: '1rem',
    transform: 'translate(50%,0)'
  },
  boxNav: {
    display: 'inline-block',
    width: '15%',
    position: 'relative',
    bottom: '0',
    left: '0',
    boxSizing: 'border-box',
    padding: '5rem 3% 0'
  },
  boxView: {
    display: 'inline-block',
    width: '85%',
  },
  fontNav: {
    fontSize: "1.4rem",
    letterSpacing: "0.11rem",
    whiteSpace: "nowrap",
    color: "#a8a8a8"
  },
  spanNav: {
    position: 'relative',
    float: 'right',
    boxSizing: 'border-box',
    margin: '0.8rem 0.5rem',
    cursor: 'pointer'
  },
  fontName: {
    fontSize: '2.7rem',
    fontWeight: '700',
    letterSpacing: '0.12rem',
    whiteSpace: 'nowrap',
    color: 'black'
  },
}

class CosmicNoun extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._construct_UnitInit = this._construct_UnitInit.bind(this);
    this._render_CosmicNouns_byView = this._render_CosmicNouns_byView.bind(this);
    this.style={

    }
  }

  _construct_UnitInit(match, location){
    let unitInit= {marksify: false, initMark: "all", layer: 0};
    return unitInit;
  }

  _render_CosmicNouns_byView(paramsStatus){
    switch (paramsStatus) {
      case 'contribute':
        return (
          <NodeContributor {...this.props}/>
        )
        break;
      default:
        return (
          <NodeLinks {...this.props}/>
        )
    };
  }


  componentDidUpdate(prevProps, prevState, snapshot){
    //becuase there is chance we jump from noun to noun, using the same component this one
    //so we check again
    if(!(this.nounId in this.props.nounsBasic)) this.props._submit_NounsList_new([this.nounId]);
  }

  componentDidMount() {
    if(!(this.nounId in this.props.nounsBasic)) this.props._submit_NounsList_new([this.nounId]);
  }

  componentWillUnmount(){

  }

  render(){
    let params = new URLSearchParams(this.props.location.search); //we need value in URL query
    let paramsStatus = params.get('view');
    this.nounId = this.props.match.params.nounId;

    return(
      <div
        className={'boxAbsoluteFull'}
        style={styleMiddle.comNounSingular}>
        <div
          style={styleMiddle.boxScroll}>
          <div
            style={styleMiddle.boxTitle}>
            <div
              style={Object.assign({}, styleMiddle.boxName, styleMiddle.fontName)}>
              {this.nounId in this.props.nounsBasic? (
                this.props.nounsBasic[this.nounId].name+(this.props.nounsBasic[this.nounId].prefix? (" ,  "+this.props.nounsBasic[this.nounId].prefix): "")
              ): (
                null
              )}
            </div>
          </div>
          <div
            style={Object.assign({}, styleMiddle.boxNav, styleMiddle.fontNav)}>
            <Link
              to={{
                pathname: this.props.match.url,
                search: ''
              }}
              className={'plainLinkButton'}>
              <span
                style={styleMiddle.spanNav}>{'links'}</span>
            </Link>
            <Link
              to={{
                pathname: this.props.match.url,
                search: '?view=contribute'}}
              className={'plainLinkButton'}>
              <span
                style={styleMiddle.spanNav}>{'contributors'}</span>
            </Link>
          </div>
          <div
            className={'boxRelativeFull'}
            style={styleMiddle.boxView}>
            {this._render_CosmicNouns_byView(paramsStatus)}
          </div>
        </div>
        <div style={{width: '100%', height: '3.3vh', position: 'fixed', top: '0', backgroundColor: '#FCFCFC'}}></div>
        <div style={{width: '100%', height: '54px', position: 'fixed', bottom: '0', backgroundColor: '#FCFCFC'}}></div>
        <Route
          path={this.props.match.path+"/units/:id"}
          render={(props)=> <Unit {...props} _construct_UnitInit={this._construct_UnitInit} _refer_von_unit={this.props._refer_von_cosmic}/>}/>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
    nounsBasic: state.nounsBasic,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_NounsList_new: (arr) => { dispatch(handleNounsList(arr)); },
    _submit_UsersList_new: (arr) => { dispatch(handleUsersList(arr)); }
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(CosmicNoun));
