import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';

const styleMiddle={
  spanSubTitle: {
    fontSize: '1.6rem',
    letterSpacing: '0.36rem',
    fontWeight: '300',
    color: '#FAFAFA'
  },
  spanSubmit: {
    fontSize: '1.3rem',
    fontWeight: '400',
    letterSpacing: '0.14rem',
    color: '#ededed'
  }
}

class NodesList extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._handleClick_nounDelete = this._handleClick_nounDelete.bind(this);
    this.style={
      Com_NounsEditor_List_: {
        width: '100%',
        position: 'relative',
        boxSizing: 'border-box',
        padding: '5% 2%',
        listStyle: 'none'
      },
      Com_NounsEditor_List_item: {
        display: 'block',
        width: '92%',
        position: 'relative',
        boxSizing: 'border-box',
        margin: '4% 0',
        textAlign: 'right',
        fontFamily: 'cwTeXMing'
      }
    }
  }

  _handleClick_nounDelete(event){
    event.stopPropagation();
    event.preventDefault();
    this.props._set_nounDelete(event.currentTarget.getAttribute('nodeid'));
  }

  render() {
    const nouns = this.props.nodesList.map((nounId, index) => {
      let thisNoun = this.props.nounsBasic[nounId];
      return(
        <li
          key={'_key_nounList_item_'+index}
          style={Object.assign({}, this.style.Com_NounsEditor_List_item, styleMiddle.spanSubTitle)}>
          <span>{thisNoun.name}</span>
          <span style={{fontStyle: 'italic'}}>{thisNoun.prefix ? ", "+thisNoun.prefix :""}</span>
          <span
            nodeid={nounId}
            style={Object.assign({}, {float: 'left', cursor: 'pointer'}, styleMiddle.spanSubmit)}
            onClick={this._handleClick_nounDelete}>
            {"x"}</span>
        </li>
      )
    })

    return (
      <div
        style={this.style.Com_NounsEditor_List_}>
        {nouns}
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    i18nUIString: state.i18nUIString,
    nounsBasic: state.nounsBasic,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(NodesList));
