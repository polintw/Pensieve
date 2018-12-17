import React from 'react';
import {
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import cxBind from 'classnames/bind';

class CosmicCorner extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._handleClick_cosmic_Self = this._handleClick_cosmic_Self.bind(this);
    this._handleClick_cosmic_index = this._handleClick_cosmic_index.bind(this);
    this.style={
      withinCom_CosmicCorner_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box'
      },
      withinCom_CosmicCorner_Ltd: {
        position: 'absolute',
        top:'40%',
        left: '3%',
        transform: 'translate(0, -50%)',
        boxSizing: 'border-box',
        fontSize: '2rem',
        letterSpacing: '0.3rem',
        color: 'rgba(62, 61, 61, 0.92)',
        cursor: 'pointer'
      },
      withinCom_CosmicCorner_Self_: {
        width: '7%',
        height: '100%',
        position: 'absolute',
        top:'0%',
        right: '2%',
        boxSizing: 'border-box',
        fontSize: '1.8rem',
        letterSpacing: '0.24rem',
        textAlign: 'center',
        cursor: 'pointer'
      }
    }
  }

  _handleClick_cosmic_index(event){
    event.preventDefault();
    event.stopPropagation();
    this.props._refer_leavevonIndex('','')
  }

  _handleClick_cosmic_Self(event){
    event.preventDefault();
    event.stopPropagation();
    this.props._refer_leavevonIndex('','user')
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.withinCom_CosmicCorner_}>
        <div
          style={this.style.withinCom_CosmicCorner_Ltd}
          onClick={this._handleClick_cosmic_index}>
          {"CORNER"}
        </div>
        <div
          style={this.style.withinCom_CosmicCorner_Self_}
          onClick={this._handleClick_cosmic_Self}>
          {this.props.userInfo.account}
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

export default withRouter(connect(
  mapStateToProps,
  null
)(CosmicCorner));
