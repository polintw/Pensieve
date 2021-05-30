import React from 'react';
import {
  Route,
  Redirect,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import Feed from './Feed/Feed.jsx';
import TitleShareds from './TitleShareds/TitleShareds.jsx';
import UnitScreen from '../../../Unit/UnitScreen/UnitScreen.jsx';

class Wrapper extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      savedPosition: null
    };
    this.wrapperSelfShared = React.createRef();
    this._construct_UnitInit = this._construct_UnitInit.bind(this);
    this._render_tab = this._render_tab.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if(
      this.props.location.pathname != prevProps.location.pathname &&
      this.props.location.pathname.includes('/unit')
    ){
      let savedPosition = window.scrollY;
      this.setState((prevState, props)=>{
        return {
          savedPosition: savedPosition
        };
      }, ()=>{
        this.wrapperWithinNode.current.style.display='none';
      });
    }
    else if(
      this.props.location.pathname != prevProps.location.pathname &&
      prevProps.location.pathname.includes('/unit') &&
      !this.props.location.pathname.includes('/unit')
    ){
      this.wrapperWithinNode.current.style={};
      window.scroll(0, prevState.savedPosition);
      this.setState({
        savedPosition: null
      });
    };

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  _render_tab(){
    switch (this.currentTab) {
      case "inspired":
        return (
          <div>

          </div>
        )
        break;
      case "map":
        return (
          <div>

          </div>
        )
        break;
      case "nodes":
        return (
          <div>

          </div>
        )
        break;
      default: // 'undefined' currentTab
        return (
          <div>
            <Feed {...this.props}/>
          </div>
        )
    }
  }

  render(){
    let urlParams = new URLSearchParams(this.props.location.search); //we need value in URL query
    this.currentTab = urlParams.get('tab'); // could be 'undefined'

    return(
      <div>
        <div
          className={classnames(styles.comSelfWrapper)}>
          <div
            className={classnames(styles.boxTopTitle)}>
            <TitleShareds
              {...this.props}/>
          </div>
          <div>
            {this._render_tab()}
          </div>
        </div>

        <Route
          path={((this.props.location.pathname =="/") ? '' : this.props.location.pathname.slice(0, -5))+ '/unit' }
          render={(props)=> {
            return (
              <UnitScreen
                {...props}
                _createdRespond= {()=>{/* no need to give any flad in /self. */ }}
                _construct_UnitInit={this._construct_UnitInit}
                _refer_von_unit={this.props._refer_von_cosmic}/>
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
    userInfo: state.userInfo,
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
)(Wrapper));
