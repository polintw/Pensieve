import React from 'react';
import {
  Route,
  Switch,
  Link,
  withRouter,
  Redirect
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import BelongOptions from '../BelongOptions/BelongOptions.jsx';

const recordLink = (nodeId, self)=>{
  return (
    <Link
      key={"key_Belong_records_"+index}
      to={"/cosmic/nodes/"+nodeId}
      className={'plainLinkButton'}>
      <span>
        {self.props.nounsBasic[nodeId].name}
      </span>
    </Link>
  )
}

class BelongForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      records: false, //would be an array after the axios get the records from db
      viewForm: false //judge whether open the Options or not
    };
    this._render_BelongList = this._render_BelongList.bind(this);
    this._render_actionDescrip = this._render_actionDescrip.bind(this);
    //_axios get records from db
    this.style={

    }
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {
    //_axios get records from db,
    //would get nodes list, and pass to redux
  }

  componentWillUnmount() {

  }

  _render_actionDescrip(){
    if(this.state.records< 0) return (<p>{this.props.i18nUIString.catalog['guidingNewBelong']}</p>)
    else if(this.state.records< 2) return (<p>{this.props.i18nUIString.catalog['guidingEditBelong']}</p>);
    //there is third kind of situation: "edit"  to just edit current list after all 3 are redorded
  }

  _render_BelongList(){
    let items = this.state.records.map((nodeId, index)=>{
      return recordLink(nodeId, this);
    });

    return items;
  }

  render(){
    return(
      <div
        className={classnames(styles.comBelongForm)}>
        {
          !this.state.viewForm && this.state.records &&
          <div>
            {this._render_BelongList()}
          </div>
        }
        {
          this.state.records &&
          <div>
            {this._render_actionDescrip()}
            {
              this.state.viewForm &&
              <BelongOptions/>
            }
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
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
)(BelongForm));
