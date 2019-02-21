import React from 'react';
import {
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import cxBind from 'classnames/bind';
import ModalBox from '../../Component/ModalBox.jsx';

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
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box'
      },
      withinCom_CosmicCorner_logo: {
        position: 'absolute',
        top: '0',
        left: '1%',
        boxSizing: 'border-box',
        fontWeight: '300',
        fontSize: '2.7vh',
        letterSpacing: '0.3vh',
        color: 'rgba(62, 61, 61, 0.92)',
        cursor: 'pointer'
      },
      withinCom_CosmicCorner_Self_: {
        position: 'absolute',
        bottom: '0',
        right: '2%',
        boxSizing: 'border-box',
        textAlign: 'right',
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
      },
      withinCom_CosmicCorner_options_: {
        width: '3%',
        position: 'absolute',
        bottom: '46%',
        right: '5%',
        boxSizing: 'border-box',
      },
      withinCom_LtdToolBox_: {
        position: 'absolute',
        bottom: '136%',
        left: '12%',
        boxSizing: 'border-box',
        boxShadow: '1px 1px 5px 0px',
        backgroundColor: '#FAFAFA'
      },
      withinCom_LtdToolBox_ol_: {
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        padding: '0 18% 0 10%',
        listStyle: 'none',
        fontSize: '1.2rem',
        letterSpacing: '0.15rem',
        fontWeight: '300',
        color: '#222222'
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
    this.setState((prevState, props)=>{
      return {toolBoxify: prevState.toolBoxify?false:true}
    })
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
          onClick={this._handleClick_currentReload}>
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
        <div
          id={"withinCom_CosmicCorner_options"}
          style={this.style.withinCom_CosmicCorner_options_}>
          <span
            style={{display: 'inline-block', position: 'relative', fontSize: '1rem', cursor: 'pointer'}}
            onClick={this._handleClick_navToolBox}>
            {"。。"}
          </span>
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

export default withRouter(connect(
  mapStateToProps,
  null
)(CosmicCorner));
