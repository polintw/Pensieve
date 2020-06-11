import React from 'react';
import {
  Route,
  Link,
  withRouter,
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';

const styleMiddle = {
  boxNavButton:{
    display: 'inline-block',
    width: '96px',
    height: '32px',
    position: 'relative',
    boxSizing: 'border-box',
    borderRadius: '4px',
    cursor: 'pointer',
    float: 'right' // important. this could allow the parent comp. put their element just "next" to this <input>
  },
  inputTextLink: {
    width: "100%",
    boxSizing: "border-box",
    padding: "1.2rem 2rem",
    border: "solid 1px #979797",
    borderRadius: "5px",
    margin:'8px 0px 16px'
  }
}

class CopyOneLine extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      stateValue: !!this.props.inputString? this.props.inputString : '',
      onButton: false
    };
    this.refInputString = React.createRef();
    this._handleEnter_button = this._handleEnter_button.bind(this);
    this._handleLeave_button = this._handleLeave_button.bind(this);
    this._handleChange_Input = this._handleChange_Input.bind(this);
    this._handleClick_copyValue = this._handleClick_copyValue.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if(prevProps.inputString != this.props.inputString){
      this.setState({
        stateValue: this.props.inputString
      })
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    return(
      <div>
        <div>
          <input
            type="text"
            ref={this.refInputString}
            className={classnames(
              'plainInputText',
              "fontContent", "colorOptionsBlack"
            )}
            style={styleMiddle.inputTextLink}
            onChange={this._handleChange_Input}
            value={this.state.stateValue}
            readOnly={(this.state.stateValue.length > 0)? false: true}/>
        </div>
        <div
          style={Object.assign({},
            styleMiddle.boxNavButton,
            (this.state.onButton )? {backgroundColor: "#ff8168"}:{}
          )}
          onClick={this._handleClick_copyValue}
          onMouseEnter={this._handleEnter_button}
          onMouseLeave={this._handleLeave_button}>
          <span
            className={classnames(
              'centerAlignChild', 'fontSubtitle_h5',
              {["colorEditBlack"]: !this.state.onButton},
              {["colorWhite"]: this.state.onButton}
            )}>
            {this.props.i18nUIString.catalog["submit_copy"]}
          </span>
        </div>
      </div>
    )
  }

  _handleChange_Input(event){
    this.setState({stateValue: event.target.value});
  }

  _handleClick_copyValue(event){
    event.preventDefault();
    event.stopPropagation();
    this.refInputString.current.select();
    document.execCommand('copy');

  }

  _handleEnter_button(e){
    this.setState({
      onButton: true
    })
  }

  _handleLeave_button(e){
    this.setState({
      onButton: false
    })
  }
}

const mapStateToProps = (state)=>{
  return {
    i18nUIString: state.i18nUIString,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(CopyOneLine));
