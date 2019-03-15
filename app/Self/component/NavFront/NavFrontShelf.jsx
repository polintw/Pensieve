import React from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import SvgDoortoShelf from './SvgDoortoShelf.jsx';

const commonStyle = {
  selfCom_NavFrontShelf_link: {
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
        {
          (this.props.location.pathname=="/profile/sheet") ?(
            <Link
              to={'/cognition/embedded/inspireds'}
              style={commonStyle.selfCom_NavFrontShelf_link}>
              <div>
                {"return"}
              </div>
            </Link>
          ):(
            <Link
              to={{
                pathname: "/profile/sheet",
                state: {from: this.props.location}
              }}
              style={commonStyle.selfCom_NavFrontShelf_link}>
              <div>
                <SvgDoortoShelf/>
              </div>
            </Link>
          )
        }
      </div>
    )
  }
}
