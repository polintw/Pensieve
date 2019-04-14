import React from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import {connect} from "react-redux";

const commonStyle = {
  withinCom_CosmicCorner_options_: {
    position: 'relative',
    boxSizing: 'border-box',
    margin: '2vh 0 0 0',
    fontSize: '1.4rem',
    letterSpacing: '0.16rem',
    whiteSpace: 'nowrap',
    textAlign: 'center',
    cursor: 'pointer'
  }
}

class CosmicCorner extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      toolBoxify: false
    };
    this._handleClick_navToolBox = this._handleClick_navToolBox.bind(this);
    this._handleClick_cosmic_Self = this._handleClick_cosmic_Self.bind(this);
    this._handleClick_currentReload = this._handleClick_currentReload.bind(this);
    this.style={
      withinCom_CosmicCorner_: {
        position: 'absolute',
        bottom: '0',
        transform: 'translate(-50%, 0)',
        boxSizing: 'border-box'
      }
    }
  }

  _handleClick_currentReload(event){
    event.preventDefault();
    event.stopPropagation();
    this.props._refer_leavevonIndex('','reload')
  }

  _handleClick_cosmic_Self(event){
    event.preventDefault();
    event.stopPropagation();
    this.props._refer_leavevonIndex(this.props.userInfo.id,'user')
  }

  _handleClick_navToolBox(event){
    event.stopPropagation();
    event.preventDefault();
    window.location.assign('/user/screen');
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
          onClick={(event)=>{event.stopPropagation();event.preventDefault(); window.location.reload();}}
          style={Object.assign({}, commonStyle.withinCom_CosmicCorner_options_, {color: '#fc766a'})}>
          {"start"}
        </div>
        <div
          style={Object.assign({color: '#333333'}, commonStyle.withinCom_CosmicCorner_options_)}
          onClick={this._handleClick_cosmic_Self}>
          {this.props.userInfo.account}
        </div>
        {
          this.state.toolBoxify &&
          <ModalBox containerId="withinCom_CosmicCorner_options">
            <div
              style={this.style.withinCom_LtdToolBox_}>
              <ol
                style={this.style.withinCom_LtdToolBox_ol_}>
                <li
                  style={{position: 'relative', whiteSpace: 'pre', cursor: 'pointer'}}
                  onClick={this.props._handleClick_LtdToolBox_logout}>
                  {"Log Out"}
                </li>
              </ol>
            </div>
          </ModalBox>
        }
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
)(CosmicCorner);
