import React from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';

const styleMiddle= {
    comExpOverview: {
    width: '936px',
    height: '80vh',
    position: 'absolute',
    left: '50%',
    transform: 'translate(-50%,0)',
    boxSizing: 'border-box'
  },
  boxNav: {
    top: '46%',
    left: '49%'
  },
  fontNav: {
    fontSize: '1.5rem',
    fontWeight: '400',
    letterSpacing: '0.11rem',
    whiteSpace: 'nowrap',
    textAlign: 'center',
    color: '#9F9F9F'
  },
  spanNav: {
    position: 'relative',
    boxSizing: 'border-box',
    margin: '0 7rem',
    cursor: 'pointer'
  }
}

class ExpOverview extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      mouseOn: ''
    };
    this._handleEnter_ExpSpan = this._handleEnter_ExpSpan.bind(this);
    this._handleLeave_ExpSpan = this._handleLeave_ExpSpan.bind(this);
    this.style={

    }
  }

  _handleEnter_ExpSpan(e){
    //don't need to stop proppagation,
    //because both the 'onMouseEnter' & 'onMouseLeave'
    //would not 'bubble'
    this.setState({
      mouseOn: e.currentTarget.attributes.method.value
    })
  }

  _handleLeave_ExpSpan(e){
    //don't need to stop proppagation,
    //because both the 'onMouseEnter' & 'onMouseLeave'
    //would not 'bubble'
    this.setState({
      mouseOn: ''
    })
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    return(
      <div
        style={styleMiddle.comExpOverview}>
        <div
          className={'centerAlignChild'}
          style={Object.assign({}, styleMiddle.boxNav, styleMiddle.fontNav)}>
          <Link
            to="/cosmic/explore/nodes"
            className={'plainLinkButton'}>
            <span
              method="nodes"
              style={Object.assign({}, styleMiddle.spanNav, (this.state.mouseOn=='nodes')? {color: '#333333', borderBottom: "solid 1.4px #333333"}:{})}
              onMouseEnter={this._handleEnter_ExpSpan}
              onMouseLeave={this._handleLeave_ExpSpan}>{'nodes'}</span>
          </Link>
          <Link
            to="/cosmic/explore/users"
            className={'plainLinkButton'}>
            <span
              method="users"
              style={Object.assign({}, styleMiddle.spanNav, (this.state.mouseOn=='users')? {color: '#333333', borderBottom: "solid 1.4px #333333"}:{})}
              onMouseEnter={this._handleEnter_ExpSpan}
              onMouseLeave={this._handleLeave_ExpSpan}>{'users'}</span>
          </Link>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo
  }
}

export default connect(
  mapStateToProps,
  null
)(ExpOverview);
