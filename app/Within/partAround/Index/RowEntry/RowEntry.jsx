import React from 'react';
import {
  Route,
  Link,
  withRouter,
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import stylesFont from '../../stylesFont.module.css';
import BelongsSet from '../BelongsSet/BelongsSet.jsx';
import DateConverter from '../../../../Components/DateConverter.jsx';
import SvgLogo from '../../../../Components/Svg/SvgLogo.jsx';

class RowEntry extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      greet: false, //temp use, before the real customized render constructed
      onCreate: false
    };
    this.boxTitle = React.createRef();
    this.style={

    }
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    //render greeting words after checking the visit status
    //mainlt to understand whether the user was new register or not
    if(prevProps.lastVisit!==this.props.lastVisit && this.props.lastVisit){
      let date = new Date(),
          i18n = '';
      let currentCourse = date.getHours();

      if(this.props.lastVisit=='newly') i18n = 'welcomeNew'
      else if(currentCourse> 17) i18n = 'greetNight'
      else if(currentCourse> 6 && currentCourse< 11) i18n = 'greetMorning'
      else i18n = 'welcomeBack';

      this.setState({
        greet: i18n
      });
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    let date = new Date(); //be used to display present time

    return(
      <div
        ref={this.boxTitle}
        className={classnames(styles.comRowEntry)}>

        <div
          className={classnames(styles.boxStatic)}>
          <div
            className={classnames(styles.boxLogo)}>
            <SvgLogo/>
          </div>
          <div
            className={classnames(styles.boxBasic)}>
            {
              this.state.greet &&
              <div
                className={styles.boxGreet}>
                <span className={classnames(styles.spanGreet, stylesFont.fontGreet)}>
                  {this.props.i18nUIString.catalog[this.state.greet]}</span>
              </div>
            }
            <div
              className={classnames(styles.boxDate)}>
              <DateConverter
                place={'title'}
                datetime={date.getTime()}/>
            </div>
          </div>
        </div>

        <div
          className={classnames(styles.boxBelong)}>
          <BelongsSet
            lastVisit={this.props.lastVisit}/>
        </div>

      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
    i18nUIString: state.i18nUIString,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(RowEntry));
