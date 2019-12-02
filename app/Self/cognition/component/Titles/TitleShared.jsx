import React from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import classnames from 'classnames';
import styles from "./styles.module.css";
import CreateShare from '../../../../Component/CreateShare.jsx';
import SvgCreate from '../../../../Component/Svg/SvgCreate.jsx';

export default class TitleShared extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onCreate: false
    };
    this._submit_Share_New = this._submit_Share_New.bind(this);
    this._handleLeave_Create = this._handleLeave_Create.bind(this);
    this._handleEnter_Create = this._handleEnter_Create.bind(this);
    this.style={
      selfCom_Title_Shared_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box'
      },
      selfCom_Title_Shared_main_: {
        display: 'inline-block',
        float: 'left',
        boxSizing: 'border-box',
      },
      selfCom_Title_Shared_Create_: {
        width: '20vw',
        position: 'absolute',
        bottom: '0',
        right: '0',
        boxSizing: 'border-box',
      },
    }
  }

  _handleEnter_Create(e){
    this.setState({
      onCreate: true
    })
  }

  _handleLeave_Create(e){
    this.setState({
      onCreate: false
    })
  }

  _submit_Share_New(dataObj){
    this.props._axios_nails_shareds();
  }


  render(){
    return(
      <div
        style={this.style.selfCom_Title_Shared_}>
        <div
          className={classnames(styles.fontTitle)}
          style={this.style.selfCom_Title_Shared_main_}>
          {"Shared"}
        </div>
        <div
          style={this.style.selfCom_Title_Shared_Create_}
          onMouseEnter={this._handleEnter_Create}
          onMouseLeave={this._handleLeave_Create}>
          <SvgCreate
            black={this.state.onCreate}
            place={false}/>
          <CreateShare
            _submit_Share_New={this._submit_Share_New}
            _refer_von_Create={this.props._refer_leaveSelf}/>
        </div>
      </div>
    )
  }
}
