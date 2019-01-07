import React from 'react';
import {
  Link,
  withRouter,
  Redirect
} from 'react-router-dom';
import {connect} from "react-redux";
import cxBind from 'classnames/bind';
import DraftDisplay from './DraftDisplay.jsx';

class MarksArticle extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false
    };
    this.axiosSource = axios.CancelToken.source();
    this._handleClick_Article_openMark = this._handleClick_Article_openMark.bind(this);
    this.style={
      Com_MarksArticle_: {
        width: '100%',
        minHeight: '48%',
        position: 'relative',
        boxSizing: 'border-box',
        padding: '1rem 3%',
        columnCount: '2',
        WebkitColumnCount: '2'
      },
      Com_MarksArticle_paragraph: {
        boxSizing: 'border-box',
        padding: '0.5rem 0',
        borderBottom: 'solid 1px #e1e193',
        fontSize: '1.3rem',
        fontWeight: '400',
        letterSpacing: '0.12rem'
      }
    };
  }

  _handleClick_Article_openMark(event){
    event.preventDefault();
    event.stopPropagation();
    let markKey = event.currentTarget.getAttribute('markKey');
    this.props._set_MarkInspect(this.props.layer, markKey);
  }

  componentDidMount(){

  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    const self = this;
    let articleArr = this.props.marksObj.list.map((key, index)=>{
      return (
        <div
          markkey={key}
          style={this.style.Com_MarksArticle_paragraph}
          onClick={this._handleClick_Article_openMark}>
          <DraftDisplay
            editorState={this.props.marksObj.data[key].editorContent}/>
        </div>
      )
    })

    return(
      <div
        style={this.style.Com_MarksArticle_}>
        {articleArr}
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent
  }
}

export default withRouter(connect(
  mapStateToProps,
  null
)(MarksArticle));
