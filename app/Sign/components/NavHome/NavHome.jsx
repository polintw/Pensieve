import React from 'react';
import {
    Link,
    withRouter
} from 'react-router-dom';
import { connect } from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";

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
                <a
                    href={"/"}
                    className={classnames(
                        'plainLinkButton',
                        styles.boxNavLink
                    )}>
                    <span
                        className={classnames(
                            styles.spanNavLink,
                            "fontTitle",
                            "colorWhiteGrey",
                            {
                                ['colorOptionsBlack']: this.state.onInActive,
                                [styles.spanNavLinkMouse]: this.state.onInActive
                            }
                        )}
                        onMouseEnter={this._handleEnter_Link}
                        onMouseLeave={this._handleLeave_Link}>
                        {this.props.i18nUIString.catalog["title_home"]}
                    </span>
                </a>

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
