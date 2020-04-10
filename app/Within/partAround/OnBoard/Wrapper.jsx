import React from 'react';
import {
  Route,
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import SvgLogo from '../../../Components/Svg/SvgLogo.jsx';

class Wrapper extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    //And! we have to 'hide' the scroll bar and preventing the scroll behavior to the page one for all
    //so dismiss the scroll ability for <body> here
    document.getElementsByTagName("BODY")[0].setAttribute("style","overflow-y:hidden;");
  }

  componentDidMount() {

  }

  componentWillUnmount(){
    //recruit the scroll ability back to <body>
    document.getElementsByTagName("BODY")[0].setAttribute("style","overflow-y:scroll;");
  }


  render(){
    return(
      <div
        className={styles.comOnBoardWrapper}>
        <div
          className={classnames(styles.boxAbsoluteRow, styles.rowTop)}>
          <div
            className={classnames(styles.boxLogo)}
            onClick={(e)=>{e.preventDefault(); e.stopPropagation();}}>
            <SvgLogo/>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  null
)(Wrapper));
