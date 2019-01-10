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
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        padding: '1vh 2%'
      },
      withinCom_CosmicCorner_logo: {
        position: 'relative',
        boxSizing: 'border-box',
        fontSize: '2rem',
        letterSpacing: '0.3rem',
        color: 'rgba(62, 61, 61, 0.92)',
        cursor: 'pointer'
      },
      withinCom_CosmicCorner_Self_: {
        minHeight: '50%',
        position: 'relative',
        boxSizing: 'border-box',
        textAlign: 'center',
        cursor: 'pointer'
      },
      withinCom_CosmicCorner_Self_span: {
        display: 'block',
        position: 'relative',
        boxSizing: 'border-box',
        padding: '0.5vh 0',
        fontSize: '1.5rem',
        letterSpacing: '0.2rem',
        color: '#222222'
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
          style={this.style.withinCom_CosmicCorner_logo}
          onClick={this._handleClick_cosmic_index}>
          {"CORNER"}
        </div>
        <div
          style={this.style.withinCom_CosmicCorner_Self_}
          onClick={this._handleClick_cosmic_Self}>
          <span style={this.style.withinCom_CosmicCorner_Self_span}>
            {this.props.userInfo.firstName}</span>
          <span style={this.style.withinCom_CosmicCorner_Self_span}>
            {this.props.userInfo.lastName}</span>
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
