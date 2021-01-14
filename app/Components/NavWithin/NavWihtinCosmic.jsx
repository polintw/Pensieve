import React from 'react';
import {
  Route,
  Switch,
  Link,
  withRouter
} from 'react-router-dom';
import { connect } from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import {SvgArrowToRight} from '../Svg/SvgArrow.jsx';

class NavWihtinCosmic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          onbtn: false,
          onItem: false
        };
        this._compExploreLink = this._compExploreLink.bind(this);
        this._handleMouseUp_LinkItem = this._handleMouseUp_LinkItem.bind(this);
        this._handleOver_LinkItem = this._handleOver_LinkItem.bind(this);
        this._handleOut_LinkItem = this._handleOut_LinkItem.bind(this);
        this._handleEnter_Link = this._handleEnter_Link.bind(this);
        this._handleLeave_Link = this._handleLeave_Link.bind(this);
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

  _compExploreLink(){
    let linkDOM = [];

    linkDOM.push(
      <Link
        key={"key_exploreLink"}
        to={"/cosmic/focus"}
        linkto={'focus'}
        className={classnames(
          'plainLinkButton')}
          onMouseOver={this._handleOver_LinkItem}
          onMouseOut={this._handleOut_LinkItem}
          onMouseUp={this._handleMouseUp_LinkItem}>
          <span
            className={classnames(
              "fontContent", styles.spanLinkItem,
              {
                [styles.spanLinkItemMouse]: this.state.onItem == 'focus',
                ["colorGrey"]: this.state.onItem != 'focus',
                ["colorEditBlack"]: this.state.onItem == 'focus'
              }
            )}>
            {this.props.i18nUIString.catalog['title_focusBoard']}</span>
        </Link>
    );

    return linkDOM;
  }

    render() {
        return (
            <div
              className={classnames(styles.comNavWithinCosmic)}>
                <div
                  className={classnames(styles.boxNavCosmic)}>
                  <Switch>
                    <Route
                      path={this.props.match.path + "/nodes"}
                      component = {this._compExploreLink} />
                    <Route
                      path={this.props.match.path + "/explore"}
                      component = {this._compExploreLink} />
                  </Switch>
                </div>
                <Link
                  to={"/"}
                  className={classnames(
                    'plainLinkButton',
                    styles.boxNavLink,
                    {[styles.boxNavLinkMouseon]: this.state.onbtn}
                  )}
                  onMouseEnter={this._handleEnter_Link}
                  onMouseLeave={this._handleLeave_Link}>
                  <div
                    className={classnames(styles.boxSvgArrow)}>
                    <div
                      style={{width: "10px", height: "12px"}}>
                      <SvgArrowToRight
                        mouseOn={this.state.onbtn}
                        customStyles={{fillColorMouseOn: '#444444', fillColor: '#a3a3a3'}}/>
                    </div>
                  </div>
                  <span
                    className={classnames(
                      styles.spanNavLink,
                      "fontSubtitle_h5",
                      {["colorGrey"]: !this.state.onbtn},
                      {["colorDescripBlack"]: this.state.onbtn}
                    )}>
                      {this.props.i18nUIString.catalog["title_home"]}
                    </span>
                  </Link>
            </div>
        )
    }

  _handleMouseUp_LinkItem(e){
    this.setState({ onItem: false })
  }

  _handleOver_LinkItem(e) {
    let targetItem = e.currentTarget.getAttribute('linkto');

    this.setState({ onItem:  targetItem});
  }

  _handleOut_LinkItem(e) {
    this.setState({ onItem: false })
  }

  _handleEnter_Link(e) {
    this.setState({ onbtn: true })
  }

  _handleLeave_Link(e) {
    this.setState({ onbtn: false })
  }

}


const mapStateToProps = (state) => {
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
)(NavWihtinCosmic));
