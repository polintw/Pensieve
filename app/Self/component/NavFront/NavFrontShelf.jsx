import React from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import SvgDoortoShelf from './SvgDoortoShelf.jsx';

const commonStyle = {
  linkPlain: {
    textDecoration: 'none',
    cursor: 'pointer'
  }
}

export default class NavFrontShelf extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      selfCom_NavFrontShelf_: {
        display: 'inline-block',
        width: '100%',
        height: '100%',
        position: 'absolute',
        left: '0',
        top: '0',
        boxSizing: 'border-box'
      }
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.selfCom_NavFrontShelf_}>
        <Link
          to={{
            pathname: "/profile/sheet",
            state: {from: this.props.location}
          }}
          style={commonStyle.linkPlain}>
          <div>
            <SvgDoortoShelf/>
          </div>
        </Link>
      </div>
    )
  }
}
