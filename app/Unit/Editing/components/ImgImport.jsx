import React from 'react';
import {connect} from "react-redux";
import classnames from 'classnames';
import stylesFont from '../../stylesFont.module.css';
import SvgUpload from '../../../Components/Svg/SvgUpload.jsx';
import AniBtnImgUpload from '../../../Components/AniBtn/AniBtnImgUpload.jsx';
import {
  switchUnitSubmitting
} from "../../../redux/actions/unit.js";

class ImgImport extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      Com_div_ImgImport_ImgEmpty: {
        width: '100%',
        height: '100%',
        position: 'relative',
        boxSizing: 'border-box',
        backgroundImage: "linear-gradient(to bottom, #fffdfa, #fff9f2)",
        borderRadius: '4px',
        border: "dashed 2px #ff8168",
        overflow: 'hidden'
      },
      Com_div_ImgImport_ImgEmpty_Guiding: {
        position: 'absolute',
        top: '83.33%',
        left: '50%',
        transform: 'translate(-50%, 0)',
      },
      Com_div_ImgImport_ImgEmpty_symbol: {
        width: '18.75%',
        height: '20%',
        minWidth: '120px',
        position: 'absolute',
        top: '27.78%',
        left: '50%',
        transform: 'translate(-50%, 0)',
      },
      Com_div_ImgImport_ImgEmpty_Choose: {
        width:'42.188%',
        height: '40px',
        position: 'absolute',
        top: '66.6%',
        left: '50%',
        transform: 'translate(-50%, 0)',
        borderRadius: '4px',
        cursor: 'pointer'
      },
    }
  }

  componentWillUnmount(){

  }

  render(){
    return(
      <div
        style={this.style.Com_div_ImgImport_ImgEmpty}>
        <div
          style={this.style.Com_div_ImgImport_ImgEmpty_symbol}>
          <SvgUpload/>
        </div>
        <div
          style={this.style.Com_div_ImgImport_ImgEmpty_Choose}>
          <AniBtnImgUpload
            _set_newImgSrc={this.props._set_newImgSrc}
            _set_Submitting={()=>{/* Here we do not inform the parent we are submitting */}}/>
        </div>
        <div
          style={this.style.Com_div_ImgImport_ImgEmpty_Guiding}>
          <span
            className={classnames(stylesFont.colorEditLightBlack, stylesFont.fontDescript)}>
            {this.props.i18nUIString.catalog['guiding_UnitEdit_upload']}
          </span>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    unitSubmitting: state.unitSubmitting
  }
}
const mapDispatchToProps = (dispatch)=>{
  return {
    _set_unitSubmitting: (bool)=>{dispatch(switchUnitSubmitting(bool));},
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ImgImport);
