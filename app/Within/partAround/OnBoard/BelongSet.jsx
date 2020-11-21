import React from 'react';
import {
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import stylesFont from '../stylesFont.module.css';
import {NodeSearchModule} from '../../../Components/NodesSearch/NodeSearchModule.jsx';

class BelongSet extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._render_node = this._render_node.bind(this);
    this._set_choiceFromSearch = this._set_choiceFromSearch.bind(this);
    this._handleEnter_spanDelete = this._handleEnter_spanDelete.bind(this);
    this._handleLeave_spanDelete = this._handleLeave_spanDelete.bind(this);
    this._handleClick_belongsDelete = this._handleClick_belongsDelete.bind(this);

  }

  _handleEnter_spanDelete(e) {

  }

  _handleLeave_spanDelete(e) {

  }

  _set_choiceFromSearch(nodeBasic){
    //pass the choice to parent's state
    this.props._set_nodesByTypes(nodeBasic, this.props.settingType);
  }

  _handleClick_belongsDelete(event){
    event.preventDefault();
    event.stopPropagation();

    this.props._set_nodesByTypes(false, this.props.settingType);
  }

  componentDidMount() {

  }

  componentWillUnmount(){

  }

  _render_node() {
    //determine the id of current node
    const nodeId = this.props.belongs[this.props.settingType];

    return (
        <div
          className={classnames(stylesFont.fontDescrip ,stylesFont.colorDescripBlack)}>
          {nodeId in this.props.nodesBasic ? (
            this.props.nodesBasic[nodeId].name) : (
              null
            )}
        </div>
    )
  }

  render(){
    return(
      <div
        className={styles.comBelongSet}>
        {
          this.props.belongs[this.props.settingType] ? (
            <div
              className={classnames(styles.belongSetBoxNode)}>
              {this._render_node()}
              <div
                className={classnames()}
                onMouseEnter={this._handleEnter_spanDelete}
                onMouseLeave={this._handleLeave_spanDelete}>
                <span
                  className={classnames()}
                  style={{fontSize: '1.2rem', cursor: 'pointer', color: '#b8b8b8'}}
                  onClick={this._handleClick_belongsDelete}>
                  {" ╳ "}
                </span>
              </div>
            </div>
          ):(
            <NodeSearchModule
              type={"inputDirect"}
              mountFocus={false}
              reversed = {true}
              _set_nodeChoice={this._set_choiceFromSearch}
              _set_SearchModal_switch={()=>{}}
              _handleClick_SearchModal_switch={(e)=>{e.preventDefault();e.stopPropagation();}}/>
          )
        }

      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    i18nUIString: state.i18nUIString,
  }
}

export default withRouter(connect(
  mapStateToProps,
  null
)(BelongSet));
