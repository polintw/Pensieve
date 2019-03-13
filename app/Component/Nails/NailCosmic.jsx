import React from 'react';
import cxBind from 'classnames/bind';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";

const commonStyle = {
  Com_Nails_Cosmic_pic_img: {
    width: '100%',
    height: 'auto'
  },
  Com_Nails_Cosmic_pic_mask: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: '0',
    left: '0',
    backgroudColor: 'rgba(0,0,0,0.5)',
    backgroundImage: "linear-gradient(90deg, transparent, rgba(0,0,0,0.03),rgba(0,0,0,0.12), rgba(0, 0, 0, 0.28), rgba(0,0,0,0.56),rgba(0,0,0,0.72))"
    //must beneath the 'backgroudColor', let browser choose if it do support gradient
  }
}

class NailCosmic extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      Com_Nails_Cosmic_: {
        display: 'inline-block',
        width: '100%',
        position: 'relative',
        boxSizing: 'border-box',
        padding: '1% 0.5%',
        borderRadius: '0.08vh',
        boxShadow: '0 0 0 0.02vh',
        overflow: 'hidden',
        cursor: 'pointer'
      },
      Com_Nails_Cosmic_pic_: {
        width: '100%',
        position: 'relative',
        boxSizing: 'border-box'
      },
      Com_Nails_Cosmic_content_: {
        width: '100%',
        minHeight: '5vh',
        position: 'relative',
        boxSizing: 'border-box',
        backgroudColor: '#FFFFFF'
      }
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.Com_Nails_Cosmic_}>
        <Link
          to={{
            pathname: this.props.match.url+"/units/"+this.props.unitId,
            state: {from: this.props.location}
          }}>
          <div
            style={this.style.Com_Nails_Cosmic_pic_}>
            <img
              src={'/router/img/'+this.props.unitBasic.pic_layer0+'?type=thumb'}
              style={commonStyle.Com_Nails_Cosmic_pic_img}
              onLoad={({currentTarget: {clientHeight}})=>this.props._set_RenderbyCol(clientHeight)}/>
            <div style={commonStyle.Com_Nails_Cosmic_pic_mask}/>
          </div>
          <div
            style={this.style.Com_Nails_Cosmic_content_}>

          </div>
        </Link>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
    unitSubmitting: state.unitSubmitting
  }
}

export default withRouter(connect(
  mapStateToProps,
  null
)(NailCosmic));
