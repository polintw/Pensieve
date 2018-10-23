import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import cxBind from 'classnames/bind';
import SvgPropic from '../../Component/SvgPropic.jsx';

export default class CosmicCorner extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._handleClick_cosmic_Self = this._handleClick_cosmic_Self.bind(this);
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
        width: '40%',
        height: '100%',
        position: 'absolute',
        top:'0%',
        left: '5%',
        boxSizing: 'border-box',
        fontSize: '1.8rem',
        letterSpacing: '0.3rem',
        cursor: 'pointer'
      },
      withinCom_CosmicCorner_Self_: {
        width: '24%',
        height: '100%',
        position: 'absolute',
        top:'0%',
        left: '48%',
        boxSizing: 'border-box',
      },
      withinCom_CosmicCorner_Self_svg: {
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        cursor: 'pointer'
      }
    }
  }

  _handleClick_cosmic_Self(event){
    event.stopPropagation();
    event.preventDefault();
    window.location.assign('/user/overview');
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
          style={this.style.withinCom_CosmicCorner_Ltd}>
          <Link to="/">
            {"CORNER"}
          </Link>
        </div>
        <div
          style={this.style.withinCom_CosmicCorner_Self_}
          onClick={this._handleClick_cosmic_Self}>
          <SvgPropic/>
        </div>
      </div>
    )
  }
}
