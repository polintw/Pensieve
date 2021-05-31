import React from 'react';
import {
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";

class FilterSwitch extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onNavLink: false
    };
    this._handleClick_filterSwitch = this._handleClick_filterSwitch.bind(this);
    this._handleEnter_link = this._handleEnter_link.bind(this);
    this._handleLeave_link = this._handleLeave_link.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    return(
      <div
        className={classnames(styles.comFilterSwitch, styles.boxTitle)}>
        <div
          category={this.props.switchCate}
          className={classnames()}
          onClick={this._handleClick_filterSwitch}
          onTouchStart={this._handleEnter_link}
          onTouchEnd={this._handleLeave_link}
          onMouseEnter={this._handleEnter_link}
          onMouseLeave={this._handleLeave_link}>
          <span
            className={classnames(
              "fontContent",
              {
                [styles.spanLinkMouse]: (this.state.onNavLink == this.props.switchCate),
                ["colorLightGrey"]: (this.state.onNavLink != this.props.switchCate),
                ["colorEditBlack"]: (this.state.onNavLink == this.props.switchCate),
                ["weightBold"]: (this.state.onNavLink == this.props.switchCate)
              }
            )}>
            {this.props.i18nUIString.catalog[
              this.props.switchCate == "notes" ? "submit_filterSwitch_Notes" : "submit_filterSwitch_Inspired"
            ] }
          </span>
        </div>
      </div>
    )
  }

  _handleClick_filterSwitch(event){
    event.stopPropagation();
    event.preventDefault();
    this.props._set_filterCategory(this.props.switchCate)
  }

  _handleEnter_link(e){
    let linkTo = e.currentTarget.getAttribute('topath');
    this.setState({onNavLink: linkTo});
  }

  _handleLeave_link(e){
    this.setState({onNavLink: false})
  }

}

const mapStateToProps = (state)=>{
  return {
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
)(FilterSwitch));
