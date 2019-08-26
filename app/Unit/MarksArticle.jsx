import React from 'react';
import {
  Link,
  withRouter,
  Redirect
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import DraftDisplay from '../Component/Draft/DraftDisplay.jsx';

class MarksArticle extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._handleClick_Article_openMark = this._handleClick_Article_openMark.bind(this);
    this.style={
      Com_MarksArticle_: {
        width: '100%',
        minHeight: '48%',
        position: 'relative',
        boxSizing: 'border-box',
        padding: '1rem 5% 1rem 0'
      },
      Com_MarksArticle_paragraph: {
        display: 'inline-block',
        width: '100%',
        position: 'relative',
        boxSizing: 'border-box',
        borderRight: '1px solid rgb(69, 69, 69)',
        margin: '0.5rem 0px 3.6rem',
        paddingRight: '4%',
        cursor: 'pointer'
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

  }

  render(){
    //let cx = cxBind.bind(styles);
    const self = this;
    let articleArr = this.props.marksObj.list.map((key, index)=>{
      return (
        <div
          key={"key_MarksArticle_"+key}
          markkey={key}
          className={classnames('fontContentSum')}
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
