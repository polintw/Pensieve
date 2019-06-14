import React from 'react';
import {
  Link,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import NodeLinks from './NodeLinks.jsx';
import NodeContributor from './NodeContributor.jsx';
import Unit from '../../Component/Unit.jsx';

const styleMiddle = {
  comNounSingular: {
    height: '',
  },
  boxScroll: {
    width: '932px',
    position: 'absolute',
    top: '5.8vh',
    left: '50%',
    transform: 'translate(-50%,0)',
    boxSizing: 'border-box'
  },
  boxTitle: {
    width: '100%',
    minHeight: '5rem',
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
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    bottom: '0',
    right: '0',
    boxSizing: 'border-box'
  },
  fontNav: {
    fontSize: "1.4rem",
    letterSpacing: "0.11rem",
    whiteSpace: "nowrap",
    color: "#333333"
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

  }

  componentDidMount() {

  }

  componentWillUnmount(){

  }

  render(){
    let params = new URLSearchParams(this.props.location.search); //we need value in URL query
    let paramsStatus = params.get('view');

    return(
      <div
        className={'boxAbsoluteFull'}
        style={styleMiddle.comNounSingular}>
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
          style={styleMiddle.boxScroll}>
          {this._render_CosmicNouns_byView(paramsStatus)}
        </div>
        <div style={{width: '100%', height: '3vh', position: 'fixed', top: '0', backgroundColor: '#FCFCFC'}}></div>
        <div style={{width: '100%', height: '2.4rem', position: 'fixed', bottom: '0', backgroundColor: '#FCFCFC'}}></div>
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

export default withRouter(connect(
  mapStateToProps,
  null
)(CosmicNoun));
