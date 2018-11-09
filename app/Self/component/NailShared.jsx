import React from 'react';
import {
  Route,
  Link
} from 'react-router-dom';

export default class NailShared extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._handleClick_Nail_breachto_res = this._handleClick_Nail_breachto_res.bind(this);
    this.style = {
      selfCom_Nail_Shared_: {
        display: 'inline-block',
        width: '32%',
        height: '32vh',
        position: 'relative',
        boxSizing: 'border-box',
        margin: '0 1% 2vh 0'
      },
      selfCom_Nail_Shared_pic_: {
        width: '100%',
        height: '82%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        overflow: 'hidden',
        cursor: 'pointer'
      },
      selfCom_Nail_Shared_pic_img_: {
        maxWidth: '150%',
        maxHeight: '150%',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)'
      },
      selfCom_Nail_Shared_breach_: {
        width: '100%',
        height: '17%',
        position: 'absolute',
        bottom: '0',
        left: '0',
        boxSizing: 'border-box'
      },
      selfCom_Nail_Shared_breach_button_: {
        display: 'inline-block',
        width: '16%',
        height: '100%',
        position: 'relative',
        boxSizing: 'border-box',
        verticalAlign: 'middle',
        fontSize: '1.1rem',
        letterSpacing: '0.14rem',
        textAlign: 'center',
        fontWeight: '400',
        color: '#000000',
        cursor: 'pointer',
        textDecoration: 'none'
      }
    }
  }

  _handleClick_Nail_breachto_res(event){
    event.preventDefault();
    event.stopPropagation();
    window.location.assign("/cosmic/units/"+this.props.sharedId+"/related");
  }

  render(){
    return(
      <div
        style={this.style.selfCom_Nail_Shared_}>
        <Link
          to={{
            pathname: this.props.match.url+"/units/"+this.props.sharedId,
            state: {from: this.props.location}
          }}>
          <div
            unitname={this.props.sharedId}
            style={this.style.selfCom_Nail_Shared_pic_}>
            <img
              src={'/router/img/'+this.props.unitBasic.pic_layer0+'?type=thumb'}
              style={this.style.selfCom_Nail_Shared_pic_img_}/>
          </div>
        </Link>
        <div
          style={this.style.selfCom_Nail_Shared_breach_}>
          <div
            style={this.style.selfCom_Nail_Shared_breach_button_}
            onClick={this._handleClick_Nail_breachto_res}>
            <span>{"Res"}</span>
          </div>
          <Link
            to={this.props.match.url+"/"+this.props.sharedId+'/threads'}
            style={this.style.selfCom_Nail_Shared_breach_button_}>
            <span>{"Thr"}</span>
          </Link>
        </div>
      </div>
    )
  }
}
