import React from 'react';
import {
  Link,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import NodeLinks from './NodeLinks/NodeLinks.jsx';
import NodeContributor from './NodeContributor.jsx';
import Unit from '../../Unit/Unit/Unit.jsx';
import SvgLogo from '../../Component/Svg/SvgLogo.jsx';
import {
  handleNounsList,
  handleUsersList
} from "../../redux/actions/general.js";

const styleMiddle = {
  boxScroll: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    width: '73.5%',
    minWidth: '954px',
    position: 'absolute',
    top: '7vh',
    right: '17.3%',
    boxSizing: 'border-box'
  },
  boxTitle: {
    display:'inline-block',
    width: '100%',
    position: 'relative',
    boxSizing: 'border-box',
    padding: '0 0 3rem 0'
  },
  boxName: {
    display: 'inline-block',
    boxSizing: 'border-box',
    padding: '1rem 0% 1rem 6.4%',
    float: 'left'
  },
  boxNav: {
    display: 'inline-flex',
    width: '12%',
    position: 'relative',
    boxSizing: 'border-box',
    padding: '1.7rem 0px 2rem 0%'
  },
  boxView: {
    display: 'inline-block',
    width: '87%',
  },
  boxLogo: {
    display: 'inline-block',
    height: '12px',
    position: 'fixed',
    bottom: '2.8%',
    right: '30%',
    boxSizing: 'border-box',
    cursor: 'pointer'
  },
  fontNav: {
    fontSize: "1.36rem",
    letterSpacing: "0.08rem",
    whiteSpace: "nowrap",
    color: "#a8a8a8"
  },
  spanNav: {
    position: 'relative',
    float: 'right',
    boxSizing: 'border-box',
    margin: '0.8rem 2.5rem 0.8rem 0',
    cursor: 'pointer'
  },
  fontName: {
    fontSize: '2.32rem',
    fontWeight: '600',
    letterSpacing: '0.13rem',
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
        className={'boxAbsoluteFull'}>
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
            style={styleMiddle.boxView}>
            {this._render_CosmicNouns_byView(paramsStatus)}
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
                style={styleMiddle.spanNav}>{'shareds'}</span>
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
        </div>
        <div style={{width: '100%', height: '3.3vh', position: 'fixed', top: '0', backgroundColor: '#FCFCFC'}}></div>
        <div style={{width: '100%', height: '54px', position: 'fixed', bottom: '0', backgroundColor: '#FCFCFC'}}></div>
        <Route path={this.props.match.path+"/"} render={(props)=> (
            <div
              style={Object.assign({}, styleMiddle.boxLogo)}
              onClick={(e)=>{e.preventDefault(); e.stopPropagation(); this.props._refer_von_cosmic('', '/cosmic')}}>
              <SvgLogo/>
            </div>
          )}/>
        <Route
          path={this.props.match.path+"/unit"}
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
