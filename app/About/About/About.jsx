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
import Terms from '../component/Terms/Terms.jsx';
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
        height: '12px',
        position: 'absolute',
        top: '39%',
        left: '25%',
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
        <Switch>
          <Route path={"/terms"} render={(props)=> <Terms {...props}/>}/>
        </Switch>
        <div>
          <NavSite {...this.props}/>
        </div>
        <div style={{width: '100%', height: '2.7rem', position: 'fixed', top: '0', backgroundColor: '#FCFCFC'}}>
          <div
            style={Object.assign({}, this.style.boxTopLogo)}
            onClick={(e)=>{e.preventDefault(); e.stopPropagation(); this.props._refer_von_cosmic('', '/cosmic')}}>
            <SvgLogo/>
          </div>
        </div>
        <div style={{width: '100%', height: '4rem', position: 'fixed', bottom: '0', backgroundColor: '#FCFCFC'}}></div>
      </Router>
    )
  }
}

export default connect()(About);
