import React from 'react';
import {
  Link,
  Switch,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import Feed from './Feed/Feed.jsx';
import NavFeed from './NavFeed/NavFeed.jsx';
import UnitScreen from '../../../Unit/UnitScreen/UnitScreen.jsx';
import NavWihtinCosmic from '../../../Components/NavWithin/NavWihtinCosmic.jsx';
import {
  cancelErr,
  uncertainErr
} from '../../../utils/errHandlers.js';

class Wrapper extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,

    };
    this.axiosSource = axios.CancelToken.source();
    this._construct_UnitInit = this._construct_UnitInit.bind(this);

  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){

  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    return(
      <div>
        <div
          className={classnames(styles.comAtNode)}>
          { // this button & nav bar only appear if user signed in
            (this.props.tokenStatus== 'verified') &&
            <div
              className={classnames(
                styles.boxNavCosmic,
                styles.smallDisplayNone)}>
                <NavWihtinCosmic/>
            </div>
          }
          <div
            className={classnames(styles.boxRow, styles.boxTitle)}
            style={{paddingBottom: '14px'}}>
            <span
              className={classnames("fontTitle", "colorEditBlack", "weightBold")}>

            </span>
          </div>
          <div
            className={classnames(styles.boxRow)}>
            <NavFeed {...this.props}/>
          </div>
          <div
            className={classnames(styles.boxRow)}>
            <Feed {...this.props}/>
          </div>

          <div className={classnames(styles.boxDecoBottom, styles.smallDisplayNone)}></div>
        </div>

        <Route
          path={((this.props.location.pathname =="/") ? '' : this.props.location.pathname.slice(0, -5))+ '/unit' }
          render={(props)=> {
            return (
              <UnitScreen
                {...props}
                _createdRespond= {()=>{/* no need to give any flad in AtNode*/ }}
                _construct_UnitInit={this._construct_UnitInit}
                _refer_von_unit={this.props._refer_to}/>
            )
          }
        }/>
      </div>
    )
  }

  _construct_UnitInit(match, location){
    let unitInit= {marksify: false, initMark: "all", layer: 0};
    return unitInit;
  }
}


const mapStateToProps = (state)=>{
  return {
    tokenStatus: state.token,
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    belongsByType: state.belongsByType,
    nounsBasic: state.nounsBasic
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Wrapper));
