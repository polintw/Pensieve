import React from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import Dialogues from './Dialogues.jsx';

export default class CogMutual extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      selfCom_CogMutual_: {
        width: '100%',
        position: 'absolute',
        top: '0',
        left: '0'
      },
      selfCom_CogMutual_nav_: {
        width: '64%',
        height: '16vh',
        position: 'absolute',
        top: '0',
        right: '10%',
        fontSize: '1.3rem',
        fontWeight: '300',
        letterSpacing: '0.1rem'
      },
      selfCom_CogMutual_nav_span_shared: {
        position: 'absolute',
        top: '0',
        left: '0',
        cursor: 'pointer'
      },
      selfCom_CogMutual_nav_span_inspired: {
        position: 'absolute',
        top: '0',
        left: '45%',
        cursor: 'pointer'
      },
      selfCom_CogMutual_nav_span_broad: {
        position: 'absolute',
        top: '0',
        right: '0%',
        cursor: 'pointer'
      },
      selfCom_CogMutual_main_: {
        width: '100%',
        position: 'absolute',
        top: '2vh',
        left: '0'
      }
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.selfCom_CogMutual_}>
        <div
          style={this.style.selfCom_CogMutual_main_}>
          <Route path={this.props.match.path+"/dialogues"} render={(props)=> <Dialogues {...props}/>}/>
        </div>
      </div>
    )
  }
}
