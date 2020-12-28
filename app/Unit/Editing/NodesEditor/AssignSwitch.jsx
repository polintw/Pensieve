import React from 'react';
import {
  Link,
  withRouter,
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import SvgCrossStroke from '../../../Components/Svg/SvgCross_Stroke.jsx';

class AssignSwitch extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onAdd: ''
    };
    this._render_assignNodes = this._render_assignNodes.bind(this);
    this._handleEnter_buttonAdd = this._handleEnter_buttonAdd.bind(this);
    this._handleLeave_buttonAdd = this._handleLeave_buttonAdd.bind(this);
    this._handleClick_editNode = this._handleClick_editNode.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  _render_assignNodes(){
    // add button to enter edit view
    // only add when 'creating'
    if(this.props.unitView != "editing"){
      return(
        (this.props.nodesSet.length < 3) ? (
          <div
            key={'_key_assignNode_readonly_add' }
            className={classnames(
              styles.boxListItem,
              {
                ['colorEditBlack']: this.state.onAdd,
                ['colorGrey']: !this.state.onAdd
              }
            )}
            style={{
              padding: '8px 14px',
              border: this.state.onAdd ? "solid 1.2px #545454" : 'dashed 2px #a3a3a3',
              cursor: 'pointer'
            } /* overwrite the cursor setting in boxListItem */}
            onClick={this._handleClick_editNode}
            onMouseEnter={this._handleEnter_buttonAdd}
            onMouseLeave={this._handleLeave_buttonAdd}>
            <SvgCrossStroke
              crossStyle={{
                strokeWidth:'26px',
                stroke: this.state.onAdd? '#545454': '#a3a3a3'}}/>
          </div>
        ) : (
          <div
            key={'_key_assignNode_readonly_add' }
            className={classnames(
              styles.boxListItem,
            )}
            style={{
              border: "solid 1.2px transparent",
            } /* overwrite the cursor setting in boxListItem */}
            onClick={this._handleClick_editNode}
            onMouseEnter={this._handleEnter_buttonAdd}
            onMouseLeave={this._handleLeave_buttonAdd}>
            <span
              className={classnames(
                'fontContent', 'colorGrey', styles.spanAddButton,
                {[styles.spanAddButtonMouse]: this.state.onAdd}
              )}>
              {this.props.i18nUIString.catalog['submit_edit']}
            </span>
          </div>
        )
      )
    }else return;
  }

  render(){
    return(
      <div>
        {this._render_assignNodes()}
      </div>
    )
  }

  _handleClick_editNode(event) {
    event.preventDefault();
    event.stopPropagation();

    this.props._set_nodesEditView('nodeEditor');
  }


  _handleEnter_buttonAdd(e) {
    this.setState({
      onAdd: true
    })
  }

  _handleLeave_buttonAdd(e) {
    this.setState({
      onAdd: false
    })
  }


}

const mapStateToProps = (state)=>{
  return {
    i18nUIString: state.i18nUIString,
    unitView: state.unitView,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(AssignSwitch));
