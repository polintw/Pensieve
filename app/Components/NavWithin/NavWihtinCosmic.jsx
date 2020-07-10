import React from 'react';
import {
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
            onInActive: false
        };
        this._handleEnter_Link = this._handleEnter_Link.bind(this);
        this._handleLeave_Link = this._handleLeave_Link.bind(this);
    }

    _handleEnter_Link(e) {
        this.setState({ onInActive: true })
    }

    _handleLeave_Link(e) {
        this.setState({ onInActive: false })
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }


    render() {
        return (
            <div
                className={classnames(styles.comNavWithinCosmic)}>
                <Link
                    to={"/fellows"}
                    className={classnames(
                        'plainLinkButton',
                        styles.boxNavLink
                    )}
                    onMouseEnter={this._handleEnter_Link}
                    onMouseLeave={this._handleLeave_Link}>
                    <div
                      className={classnames(styles.boxSvgArrow)}>
                      <div
                        style={{width: "10px", height: "15px"}}>
                        <SvgArrowToRight
                          mouseOn={this.state.onInActive}
                          customStyles={{fillColorMouseOn: '#333333', fillColor: '#d8d8d8'}}/>
                      </div>
                    </div>

                    <span
                        className={classnames(
                            styles.spanNavLink,
                            "fontNodesEqual",
                            "colorWhiteGrey",
                            {
                                ['colorOptionsBlack']: this.state.onInActive,
                                [styles.spanNavLinkMouse]: this.state.onInActive
                            }
                        )}>
                        {this.props.i18nUIString.catalog["submit_back"]}
                    </span>
                </Link>

            </div>
        )
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
