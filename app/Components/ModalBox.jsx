import React from 'react';
import ReactDOM from 'react-dom';

export default class ModalBox extends React.Component {
  constructor(props){
    super(props);
  }

  componentDidMount(){
    this.newModalBox = document.getElementById(this.props.containerId).appendChild(document.createElement('div'));
    ReactDOM.unstable_renderSubtreeIntoContainer(this, this.props.children, this.newModalBox);
  }

  componentDidUpdate(){
    ReactDOM.unstable_renderSubtreeIntoContainer(this, this.props.children, this.newModalBox);
  }

  componentWillUnmount(){
    ReactDOM.unmountComponentAtNode(this.newModalBox);
    document.getElementById(this.props.containerId).removeChild(this.newModalBox);
  }

  render() {
    return null;
  }
}
