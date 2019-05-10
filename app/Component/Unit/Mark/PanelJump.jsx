import React from 'react';
import { connect } from "react-redux";

const styleMiddle = {
  boxPanelInteraction: {
    display: 'inline-block',
    height: '100%',
    position: 'relative',
    boxSizing: 'border-box',
  },
  spanInteractions: {
    fontSize: '1.4rem',
    letterSpacing: '0.18rem',
    lineHeight: '1.9rem',
    fontWeight: '300',
    color: '#f0f0f0',
    cursor: 'pointer'
  }
}

class PanelJump extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._handleClick_jumpMark = this._handleClick_jumpMark.bind(this);
    this.style = {

    };
  }

  _handleClick_jumpMark(event){
    event.preventDefault();
    event.stopPropagation();
    let direction = event.currentTarget.getAttribute('jump');
    this.props._set_markJump(direction, this.props.currentSerial);
  }

  render(){
    return(
      <div>
        {
          (this.props.currentSerial> 0) &&
          <span
            jump={'previous'}
            style={Object.assign({}, styleMiddle.spanInteractions, {paddingRight: '0.45rem', fontSize: '1.32rem', letterSpacing:'0.1rem', color: 'rgba(173, 173, 173, 0.8)'})}
            onClick={this._handleClick_jumpMark}>
            {'previous  |'}</span>
        }
        <span
          jump={(this.props.currentSerial==(this.props.marksLength-1)) ? 'continue':'next'}
          style={Object.assign({}, styleMiddle.spanInteractions, {fontSize: '1.45rem', textShadow: '0px 0px 1px rgb(249, 253, 192)'})}
          onClick={this._handleClick_jumpMark}>
          {(this.props.currentSerial==(this.props.marksLength-1)) ? 'continue': 'next'}</span>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
    unitSubmitting: state.unitSubmitting
  }
}

export default connect(
  mapStateToProps,
  null
)(PanelJump);
