import React from 'react';
import { connect } from "react-redux";
import SvgNextCir from '../../Svg/SvgNextCir.jsx';

const styleMiddle = {
  boxSvgNextCir: {
    display: 'inline-block',
    width: '8%',
    height: 'auto',
    cursor: 'pointer'
  },
  spanInteractions: {
    fontSize: '1.4rem',
    letterSpacing: '0.1rem',
    lineHeight: '1.9rem',
    fontWeight: '400',
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
    this.props._set_stateDefault();
  }

  render(){
    return(
      <div>
        {
          (this.props.currentSerial> 0) &&
          <span
            jump={'previous'}
            style={Object.assign({}, styleMiddle.spanInteractions, {paddingRight: '0.6rem', fontSize: '1.32rem', letterSpacing:'0.1rem', color: 'rgba(173, 173, 173, 0.8)'})}
            onClick={this._handleClick_jumpMark}>
            {'prev.  |'}</span>
        }
        <div
          style={styleMiddle.boxSvgNextCir}
          jump={(this.props.currentSerial==(this.props.marksLength-1)) ? 'continue':'next'}
          onClick={this._handleClick_jumpMark}>
          <SvgNextCir
            pathStyle={{
              fill: '#d8a81e',
              stroke: '#d8a81e'
            }}/>
        </div>
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
