import React from 'react';
import {
  Link,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";

class Nav extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._handleClick_navBelongsMap = this._handleClick_navBelongsMap.bind(this);
  }

  _handleClick_navBelongsMap(event){
    event.stopPropagation();
    event.preventDefault();
    let targetCat = event.currentTarget.getAttribute('valuetab');
    //only switch if the user had set
    if(targetCat in this.props.belongsByType) this.props._set_viewTab(targetCat);
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
        className={classnames(styles.comNavBelongsMap)}>
        <div
          valuetab={"homeland"}
          style={Object.assign({},
            {display: 'inline-block', marginBottom: '1rem', cursor: 'pointer'},
            {color: (this.props.currentTab=="homeland") ? '#000000': '#787878'}
          )}
          onClick={this._handleClick_navBelongsMap}>
          <span
            style={{fontSize: '1.32rem'}}>
            {this.props.i18nUIString.catalog['link_BelongsMap_Nav'][1]}</span>
        </div>
        <div
          valuetab={"residence"}
          style={Object.assign({},
            {display: 'inline-block', marginBottom: '1rem', cursor: 'pointer'},
            {color: (this.props.currentTab=="residence") ? '#000000': '#787878'}
          )}
          onClick={this._handleClick_navBelongsMap}>
          <span
            style={{fontSize: '1.32rem'}}>
            {this.props.i18nUIString.catalog['link_BelongsMap_Nav'][2]}</span>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    belongsByType: state.belongsByType
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Nav));
