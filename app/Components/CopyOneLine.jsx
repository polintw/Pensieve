import React from 'react';
import {
  Route,
  Link,
  withRouter,
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';

class CopyOneLine extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      stateValue: !!this.props.inputString? this.props.inputString : ''
    };
    this.refInputString = React.createRef();
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
      <div
        className={classnames()}>
        <div>
          <input
            ref={this.refInputString}
            type="text"
            onChange={this._handleChange_Input}
            value={this.state.stateValue}
            readOnly={(this.state.stateValue.length > 0)? false: true}/>
        </div>
        <div
          onClick={this._handleClick_copyValue}>
          {"copy"}
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
