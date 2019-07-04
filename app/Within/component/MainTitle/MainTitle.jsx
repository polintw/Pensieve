import React from 'react';
import {
  Route,
  Switch,
  Link,
  withRouter,
  Redirect
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import SvgLogo from '../../../Component/Svg/SvgLogo.jsx';
import DateConverter from '../../../Component/DateConverter.jsx';
import CreateShare from '../../../Component/CreateShare.jsx';
import SvgCreate from '../../../Component/Svg/SvgCreate.jsx';

class MainTitle extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      switchTo: null
    };
    this._refer_von_cosmic = this._refer_von_cosmic.bind(this);
    this.style={
      withinCom_MainIndex_scroll_col_Create: {
        display: 'inline-block',
        width: '99px',
        height: '47%',
        position: 'relative',
        transform: "translate(0,-24%)",
        boxSizing: 'border-box',
        margin: '0 2%',
        float: 'right',
      },
      withinCom_MainIndex_scroll_col_logo: {
        display: 'inline-block',
        height: '31%',
        position: 'relative',
        top: '1%',
        boxSizing: 'border-box',
        margin: '0px 50% 5px 10%'
      }

    }
  }

  _refer_von_cosmic(identifier, route){
    switch (route) {
      case 'user':
        if(identifier == this.props.userInfo.id){
          window.location.assign('/user/screen');
        }else{
          this.setState((prevState, props)=>{
            let switchTo = {
              params: '/cosmic/users/'+identifier+'/accumulated',
              query: ''
            };
            return {switchTo: switchTo}
          })
        }
        break;
      case 'noun':
        this.setState((prevState, props)=>{
          let switchTo = {
            params: '/cosmic/nouns/'+identifier,
            query: ''
          };
          return {switchTo: switchTo}
        })
        break;
      default:
        return
    }
  }

  static getDerivedStateFromProps(props, state){
    //It should return an object to update the state, or 'null' to update nothing.
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    //set the state back to default if the update came from Redirect
    //preventing Redirect again which would cause error
    if(this.state.switchTo){
      this.setState({
        switchTo: null
      });
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    let date = new Date();

    if(this.state.switchTo){return <Redirect to={this.state.switchTo.params+this.state.switchTo.query}/>}

    return(
      <div
        className={'boxRelativeFull'}>
        
        <div
          style={this.style.withinCom_MainIndex_scroll_col_logo}>
          <SvgLogo/>
        </div>
        <div
          className={classnames(styles.boxDate, 'boxInlineRelative fontGillSN')}>
          <DateConverter
            place={'title'}
            datetime={date.getTime()}/>
        </div>
        <div
          style={this.style.withinCom_MainIndex_scroll_col_Create}>
          <SvgCreate
            place={false}/>
          <CreateShare
            _submit_Share_New={this._submit_Share_New}
            _refer_von_Create={this.props._refer_von_cosmic}/>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent
  }
}

export default withRouter(connect(
  mapStateToProps,
  null
)(MainTitle));
