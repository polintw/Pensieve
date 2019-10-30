import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import Nav from '../component/Nav/Nav.jsx';
import Terms from '../component/Terms/Terms.jsx';
import Privacy from '../component/Privacy/Privacy.jsx';
import NavSite from '../component/NavSite/NavSite.jsx';
import SvgLogo from '../../Component/Svg/SvgLogo.jsx';

class About extends React.Component {
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
      }
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
          <Switch>
            <Route path={"/terms"} render={(props)=> <Terms {...props}/>}/>
            <Route path={"/privacy"} render={(props)=> <Privacy {...props}/>}/>
          </Switch>
          <div>
            <NavSite {...this.props}/>
          </div>
          <div style={{width: '100%', height: '5.4rem', position: 'fixed', top: '0', backgroundColor: '#FCFCFC', boxShadow: '0 0px 4px -2px'}}>
            <div
              style={Object.assign({}, this.style.boxTopLogo)}
              onClick={(e)=>{e.preventDefault(); e.stopPropagation(); window.location.assign('/')}}>
              <SvgLogo/>
            </div>
            <div style={{display: 'inline-block'}}>
              <Nav {...this.props}/>
            </div>
          </div>
        </div>
      </Router>
    )
  }
}

export default connect()(About);
