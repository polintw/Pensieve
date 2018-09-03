import React from 'react';
import Dialogues from './Dialogues.jsx';

export default class CogMutual extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._handleClick_nav_range = this._handleClick_nav_range.bind(this);
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

  _handleClick_nav_range(event){
    event.stopPropagation();
    event.preventDefault();
    let rangeNext = event.currentTarget.getAttribute('tab');
    this.props._set_Range(rangeNext);
  }

  render(){
    //let cx = cxBind.bind(styles);
    return(
      <div
        style={this.style.selfCom_CogMutual_}>
        <div
          style={this.style.selfCom_CogMutual_main_}>
          <Dialogues/>
        </div>
      </div>
    )
  }
}
