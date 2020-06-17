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
    position: 'relative',
    boxSizing: 'border-box',
    padding: '1.2rem 1rem',
    cursor: 'pointer',
  },
  boxInputCopy: {
    display: 'flex',
    justifyContent: 'space-between',
    boxSizing: "border-box",
    border: "solid 1px #979797",
    borderRadius: "5px",
    margin:'8px 0px'
  },
  inputTextLink: {
    width: "88%",
    boxSizing: "border-box",
    padding: "1.2rem 2rem",
    border: 'unset',
    borderRadius: "5px",
  },
  boxReaction: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  boxWarning: {

  }
}

class CopyOneLine extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      stateValue: !!this.props.inputString? this.props.inputString : '',
      onButton: false,
      message: ''
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
        <div
          style={styleMiddle.boxInputCopy}>
          <input
            type="text"
            ref={this.refInputString}
            className={classnames(
              'plainInputText',
              "fontContent", "colorOptionsBlack"
            )}
            style={Object.assign({}, styleMiddle.inputTextLink, {cursor: (this.state.stateValue.length > 0)? "text" : "default"})}
            onChange={this._handleChange_Input}
            value={this.state.stateValue}
            placeholder={"https:"}
            readOnly={(this.state.stateValue.length > 0)? false: true}/>

            <div
              style={Object.assign({},
                styleMiddle.boxNavButton,
                (this.state.onButton )? {backgroundColor: "#757575"}:{}
              )}
              onClick={this._handleClick_copyValue}
              onMouseEnter={this._handleEnter_button}
              onMouseLeave={this._handleLeave_button}>
              <span
                className={classnames(
                  'fontContent',
                  {["colorGrey"]: !this.state.onButton},
                  {["colorWhite"]: this.state.onButton}
                )}>
                {this.props.i18nUIString.catalog["submit_copy"]}
              </span>
            </div>
        </div>
        <div
          style={styleMiddle.boxReaction}>
          <div
            style={styleMiddle.boxWarning}>
            <span
              className={classnames(
                "fontContent",
                "colorLightGrey"
              )}>
              {this.state.message}
            </span>
          </div>
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
    if(this.state.stateValue.length == 0){
      this.setState({message: this.props.i18nUIString.catalog["message_oneLineCopy_empty"]});
      return;
    };

    this.refInputString.current.select();
    document.execCommand('copy');
    this.setState({message: this.props.i18nUIString.catalog["message_oneLineCopy_success"]});
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
