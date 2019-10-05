import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import DisplayMarkPreview from '../../Draft/DisplayMarkPreview.jsx';

class MarksFive extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    //the mark(s), would be put in a rectangle 5vw left to right border,
    //but start from the bottom corner(beneath the img)
    let marksDOM = [];
    const plainDOM = (num)=>{ //the plain block used to fill in the empty place
      return(
        <div
          key={"key_nailInspired_plain_"+num+"_ofUnit_"+this.props.unitId}
          className={styles.boxMark}/>
      )
    };

    //First, render the mark, only the first 5
    //remember to add a 'hint' in the fututre if there are more than 5
    for(let i=0 ; i< this.props.unitBasic.marksList.length && i< 5; i++){
      let markKey = this.props.unitBasic.marksList[i]
      marksDOM.push(
        <div
          key={"key_nailInspired_mark_"+i+"_ofUnit_"+this.props.unitId}
          className={classnames(styles.boxMark, 'fontNailMark', styles.fontMark)}>
          <Link
            to={{
              pathname: this.props.match.url+"/unit",
              search: '?theater&unitId='+this.props.unitId+"&mark="+markKey,
              state: {from: this.props.location}
            }}
            value={markKey}
            className={classnames('plainLinkButton', styles.boxContent)}
            style={(this.props.overContent==markKey) ? {outline: 'double 1.5px #ff7a5f'}: {}}
            onMouseOver={this.props._handleOver_Content}
            onMouseOut={this.props._handleOut_Content}>
            <DisplayMarkPreview
              rawContent={this.props.marksBasic[markKey].editorContent}/>
          </Link>
        </div>
      );
    };

    //than, important! add the filling,
    //1 or 2 depend on the number of the marks,
    //2 filings would render the empty place next to the Nodes.
    //It is desired if there are even number of marks.
    if(!!(this.props.unitBasic.marksList.length % 2)) marksDOM.unshift(plainDOM(0))
    else {marksDOM.unshift(plainDOM(1)); marksDOM.unshift(plainDOM(0)); };

    return marksDOM;

  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
    nounsBasic: state.nounsBasic,
    usersBasic: state.usersBasic
  }
}

export default withRouter(connect(
  mapStateToProps,
  null
)(MarksFive));
