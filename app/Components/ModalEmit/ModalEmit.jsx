import React from 'react';
import {
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';

class ModalEmit extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {

    }

  componentWillUnmount() {

    }

  render(){
    return(
      <div
        className={classnames(styles.comp, styles.animiFadeOut)}>
            <span
                className={classnames("fontTitleSmall", "colorWhite", styles.spanText)}>
                    {this.props.text}
            </span>
      </div>
    )
  }


}


const mapStateToProps = (state)=>{
  return {
    i18nUIString: state.i18nUIString,
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalEmit));
