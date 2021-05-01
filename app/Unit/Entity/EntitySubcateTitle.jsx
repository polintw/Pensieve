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

class EntitySubcateTitle extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onLinkSubcate: false
    };
    this._handleClick_linkSubcate = this._handleClick_linkSubcate.bind(this);
    this._handleEnter_linkSubcate = this._handleEnter_linkSubcate.bind(this);
    this._handleLeave_linkSubcate = this._handleLeave_linkSubcate.bind(this);
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
        className={classnames(styles.comEntitySubcateTitle)}>
        <Link
          to={''}
          onClick={this._handleClick_linkSubcate}
          className={classnames('plainLinkButton')}
          style={{ display: 'inline-block' }}
          onTouchStart={this._handleEnter_linkSubcate}
          onTouchEnd={this._handleLeave_linkSubcate}
          onMouseEnter={this._handleEnter_linkSubcate}
          onMouseLeave={this._handleLeave_linkSubcate}>
          <span
            className={classnames(
              "fontNodesEqual",
              styles.spanLinkSubcate,
              { [styles.spanLinkSubcateMouse]: this.state.onLinkSubcate }
            )}>
            {"@" + this.props.unitEntity.pathSubCate.currentSubcateObj["name"]}
          </span>
        </Link>
      </div>
    )
  }

  _handleClick_linkSubcate(event){
    event.preventDefault();
    event.stopPropagation();
    // and Notice! after the replaceState has been done
    // we re-assign to make sure to scroll, the unit would all reset
    window.location.assign("/cosmic/explore/path/" + this.props.unitEntity.pathSubCate.currentPathProject + "?tab=routes&subCate=" + this.props.unitEntity.pathSubCate.currentSubCateId)
  }

  _handleEnter_linkSubcate(e){
    this.setState({onLinkSubcate: true})
  }

  _handleLeave_linkSubcate(e){
    this.setState({onLinkSubcate: false})
  }

}


const mapStateToProps = (state)=>{
  return {
    tokenStatus: state.token,
    i18nUIString: state.i18nUIString,
    unitCurrent: state.unitCurrent,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(EntitySubcateTitle));
