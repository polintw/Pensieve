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
      }
    }
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
      </div>
    )
  }
}
