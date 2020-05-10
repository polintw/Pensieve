import React from 'react';
import SvgOptions from './Svg/SvgOptions.jsx';
import ModalBox from './ModalBox.jsx';
import ServiceLinks from './ServiceLinks.jsx';
import AccountPalette from './AccountPalette.jsx';

export default class NavOptions extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      mouseOn: false, 
      toolBoxify: false
    };
    this._handleEnter_CornerOpt = this._handleEnter_CornerOpt.bind(this);
    this._handleLeave_CornerOpt = this._handleLeave_CornerOpt.bind(this);
    this._handleClick_navToolBox = this._handleClick_navToolBox.bind(this);
    this._handleClick_ToolBox_logout = this._handleClick_ToolBox_logout.bind(this);
    this.style={
      selfCom_NavOptions_: {
        display: 'inline-block',
        width: '100%',
        height: '100%',
        position: 'absolute',
        left: '0',
        top: '0',
        boxSizing: 'border-box'
      },
      selfCom_NavOptions_svg_:{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        right: '0',
        boxSizing: 'border-box',
        cursor: 'pointer'
      },
      selfCom_NavOptions_ToolBox_: {
        width: '10vw',
        minWidth: '172px',
        minHeight: '93px',
        position: 'absolute',
        bottom: '-46%',
        right: '-4%',
        boxSizing: 'border-box',
        boxShadow: '1px 1px 5px 0px',
        backgroundColor: '#FFFFFF'
      },
      selfCom_NavOptions_ToolBox_ol_: {
        minHeight: '4rem',
        boxSizing: 'border-box',
        padding: '0 15%',
        margin: '2rem 0 1.7rem',
        listStyle: 'none',
        fontSize: '1.37rem',
        letterSpacing: '0.1rem',
        fontWeight: '400',
        color: '#000000'
      }
    }
  }

  _handleClick_navToolBox(event){
    event.stopPropagation();
    event.preventDefault();
    this.setState((prevState, props)=>{
      return {toolBoxify: prevState.toolBoxify?false:true}
    })
  }

  _handleClick_ToolBox_logout(event){
    event.stopPropagation();
    event.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('tokenRefresh');
    window.location.assign('/');
  }

  render(){
    return(
      <div
        style={this.style.selfCom_NavOptions_}>
        <div
          id={"NavOptions_Self"}
          style={{width: "100%", height: '100%', position: 'absolute',boxSizing: 'border-box'}}></div>
        <div
          style={this.style.selfCom_NavOptions_svg_}
          onClick={this._handleClick_navToolBox}>
          <SvgOptions/>
          
        </div>
        {
          this.state.toolBoxify &&
          <ModalBox containerId="NavOptions_Self">
            <div
              style={this.style.selfCom_NavOptions_ToolBox_}>
              <div
                method="account"
                className={
                  classnames()
                }
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); this.props._refer_to('', '/self/profile/sheet') }}
                onMouseEnter={this._handleEnter_CornerOpt}
                onMouseLeave={this._handleLeave_CornerOpt}>
                {
                  (this.state.mouseOn == 'account') &&
                  <span style={{
                    width: '75%', position: 'absolute', top: '-11%', left: '-1%',
                    borderBottom: 'solid 1px #ff7a5f'
                  }} />
                }
                <AccountPalette
                  size={'regular'}
                  accountFirstName={this.props.userInfo.firstName}
                  accountLastName={this.props.userInfo.lastName}
                  styleFirst={{ fontWeight: '600' }} />
              </div>

              <ol
                style={this.style.selfCom_NavOptions_ToolBox_ol_}>
                <li
                  style={{cursor: 'pointer'}}
                  onClick={this._handleClick_ToolBox_logout}>
                  {"Log Out"}
                </li>
              </ol>
              <div
                style={{padding: '0 15%', margin: '1rem 0'}}>
                <ServiceLinks/>
              </div>

            </div>
          </ModalBox>
        }
      </div>
    )
  }


  _handleEnter_CornerOpt(e) {
    //don't need to stop proppagation,
    //because both the 'onMouseEnter' & 'onMouseLeave'
    //would not 'bubble'
    this.setState({
      mouseOn: e.currentTarget.attributes.method.value
    })
  }

  _handleLeave_CornerOpt(e) {
    //don't need to stop proppagation,
    //because both the 'onMouseEnter' & 'onMouseLeave'
    //would not 'bubble'
    this.setState({
      mouseOn: ''
    })
  }

}
