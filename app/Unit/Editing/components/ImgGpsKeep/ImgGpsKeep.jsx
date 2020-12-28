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
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  render(){
    return(
      <div
        className={styles.comImgGpsKeep}>
        {
          (!!this.props.imgGps && this.props.unitView != "editing") && // only allowed on gps exist & under Create mode
          (
            this.props.keepify ? ( // good to keep it
              <div
                className={classnames(
                  styles.boxIconKeepify)}>
                  <span
                    style={{fontSize: '1rem'}}>
                    {" ╳ "}
                  </span>
                </div>
              ) : (
                <div
                  className={classnames(
                    styles.boxIconKeepify)}>
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
              stroke: '#a3a3a3',
              strokeWidth: "0.87px"
              }}/>
        </div>
        <div
          className={classnames(
            styles.boxGps)}>
          <div>
            <span>
              {
                !!this.props.imgGps ?
                this.props.imgGps.latitude :
                "-:--"
              }
            </span>
          </div>
          <span>
            {"\xa0" + "/" + "\xa0"}
          </span>
          <div>
            <span>
              {
                !!this.props.imgGps ?
                this.props.imgGps.longitude :
                "-:--"
              }
            </span>
          </div>
        </div>
      </div>
    )
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
