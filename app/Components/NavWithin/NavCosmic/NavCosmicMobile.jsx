import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";

class NavCosmicMobile extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
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
            className={classnames(styles.comNavCosmicMobile)}>
          <Link
              to={"/cosmic/focus"}
              topath={"focusBoard"}
              className={
                  classnames('plainLinkButton')
              }
              onTouchStart={this._handleEnter_link}
              onTouchEnd={this._handleLeave_link}
              onMouseEnter={this._handleEnter_link}
              onMouseLeave={this._handleLeave_link}>
              <span
                  className={classnames(
                      "fontContentPlain", "colorLightGrey","lineHeight15",
                      {
                          [styles.spanLinkMouse]: (this.state.onNavLink == 'focusBoard' ),
                      }
                  )}>
                    {this.props.i18nUIString.catalog["title_focusBoard"]}
              </span>
          </Link>
          <div style={{display: 'inline-block', height: '21px', borderRight: '0.75px solid #d8d8d8', margin: "0 1rem"}}></div>
          <Link
            to={ "/" }
            topath={"home"}
            className={classnames('plainLinkButton')}
            onMouseEnter={this._handleEnter_link}
            onMouseLeave={this._handleLeave_link}>
            <span
              className={classnames(
                  "fontContentPlain", "colorLightGrey", "lineHeight15",
                {
                    [styles.spanLinkMouse]: (this.state.onNavLink == 'home' ),
                }
              )}>
                    {this.props.i18nUIString.catalog["title_home"] }
            </span>
          </Link>
        </div>
    )
  }

    _handleEnter_link(e) {
        let linkTo = e.currentTarget.getAttribute('topath');
        this.setState({ onNavLink: linkTo });
    }

    _handleLeave_link(e) {
        this.setState({ onNavLink: false })
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
)(NavCosmicMobile));
