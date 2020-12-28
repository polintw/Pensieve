import React from 'react';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import SvgPin from '../../../../Components/Svg/SvgPin.jsx';
import SvgCrossStroke from '../../../../Components/Svg/SvgCross_Stroke.jsx';

class ImgGpsKeep extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._handleClick_Remove = this._handleClick_Remove.bind(this);
    this._handleClick_Add = this._handleClick_Add.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  render(){
    let longitude = "-:--", latitude = "-:--";
    if(!!this.props.imgGps){
      let numLatitude = parseFloat(this.props.imgGps.latitude);
      let numLongitude = parseFloat(this.props.imgGps.longitude);
      // to make sure the data was not null value even props.imgGps was valid
      latitude = !!this.props.imgGps.latitude ? numLatitude.toFixed(5) : "-:--";
      longitude = !!this.props.imgGps.longitude ? numLongitude.toFixed(5) : "-:--";
    };
    return(
      <div
        className={styles.comImgGpsKeep}>
        {
          (!!this.props.imgGps && this.props.unitView != "editing") && // only allowed on gps exist & under Create mode
          (
            this.props.keepify ? ( // good to keep it
              <div
                className={classnames(
                  styles.boxIconKeepify)}
                onClick={this._handleClick_Remove}>
                  <span
                    style={{fontSize: '1rem'}}>
                    {" ╳ "}
                  </span>
                </div>
              ) : (
                <div
                  className={classnames(
                    styles.boxIconKeepify)}
                  onClick={this._handleClick_Add}>
                    <SvgCrossStroke
                      crossStyle={{
                        strokeWidth:'26px',
                        stroke: '#a3a3a3'}}/>
                    </div>
                  )
          )
        }
        <div
          className={classnames(
            styles.boxIconPin)}>
          <SvgPin
            assignStyles={{
              fill: "transparent",
              stroke: this.props.keepify ? '#545454' : "#b8b8b8",
              strokeWidth: "0.87px"
              }}/>
        </div>
        <div
          className={classnames(
            styles.boxGps)}>
          <div>
            <span
              className={classnames(
                {
                  ["colorLightGrey"]: !this.props.keepify,
                  ["colorEditBlack"]: this.props.keepify,
                }
              )}>
              {latitude}
            </span>
          </div>
          <span
            className={classnames(
              {
                ["colorLightGrey"]: !this.props.keepify,
                ["colorEditBlack"]: this.props.keepify,
              }
            )}>
            {"\xa0" + "/" + "\xa0"}
          </span>
          <div>
            <span
              className={classnames(
                {
                  ["colorLightGrey"]: !this.props.keepify,
                  ["colorEditBlack"]: this.props.keepify,
                }
              )}>
              {longitude}
            </span>
          </div>
        </div>
      </div>
    )
  }

  _handleClick_Remove(event){
    event.preventDefault();
    event.stopPropagation();
    this.props._set_exifGpsKeep(false);
  }

  _handleClick_Add(event){
    event.preventDefault();
    event.stopPropagation();
    this.props._set_exifGpsKeep(true);
  }

}

const mapStateToProps = (state)=>{
  return {
    i18nUIString: state.i18nUIString,
    unitView: state.unitView
  }
}
const mapDispatchToProps = (dispatch)=>{
  return {

  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ImgGpsKeep);
