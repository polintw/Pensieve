import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import Nav from './component/Nav/Nav.jsx';
import Terms from './component/Terms/Terms.jsx';
import Privacy from './component/Privacy/Privacy.jsx';
import About from './component/About/About.jsx';
import Contact from './component/Contact/Contact.jsx';
import SvgLogo from '../Components/Svg/SvgLogo.jsx';

class Service extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      boxTopLogo: {
        display: 'inline-block',
        height: '20px',
        position: 'absolute',
        bottom: '39%',
        left: '15%',
        boxSizing: 'border-box',
        cursor: 'pointer'
      },
      Sign_backplane: {
        width: '100%',
        height: '100%',
        position: 'fixed',
        backgroundColor: '#FCFCFC'
      },
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {

  }

  render(){
    return(
      <Router
        basename={"/a"}>
        <div>
          <div style={this.style.Sign_backplane}></div>
          <div
            className={classnames(styles.comService)}>
            <div
              className={classnames(styles.boxTopBar)}>
              <div
                className={classnames(styles.boxContentFilledLeft)} />
              <div
                className={classnames(styles.boxNav, styles.smallBoxPadding)}>
                <Nav {...this.props} />
              </div>
              <div
                className={classnames(styles.boxContentFilledRight)}/>
            </div>
            <div
              className={classnames(styles.boxContent)}>
              <div
                className={classnames(styles.boxContentFilledLeft)} />
              <div
                className={classnames(styles.boxContentCenter)}>
                <Switch>
                  <Route path={"/terms"} render={(props) => <Terms {...props} />} />
                  <Route path={"/privacy"} render={(props) => <Privacy {...props} />} />
                  <Route path={"/about"} render={(props) => <About {...props} />} />
                  <Route path={"/contact"} render={(props) => <Contact {...props} />} />
                </Switch>
              </div>
              <div
                className={classnames(styles.boxContentFilledRight)}>
                <div
                  className={classnames(styles.boxRight, styles.smallDisplayNone)}>
                  <div
                    className={classnames(styles.boxRightLogo)}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.location.assign('/') }}>
                    <SvgLogo />
                  </div>
                  <div className={classnames(styles.boxRightFooter)}/>
                </div>
              </div>
            </div>
            <div
              className={classnames(styles.boxFooter)}>
              <div
                className={classnames(
                  styles.boxContentFilledLeft)} />
              <div
                className={classnames(styles.boxServiceLink, styles.smallBoxPadding)}>
                <div
                  className={classnames(
                    styles.boxRightsClaim,
                    'fontTitleSmall',
                    'colorDescripBlack'
                  )}>
                  <span>{this.props.i18nUIString.catalog["Cornerth_inc"]}</span>
                  <span>{this.props.i18nUIString.catalog["AllRights"]}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </Router>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Service);
