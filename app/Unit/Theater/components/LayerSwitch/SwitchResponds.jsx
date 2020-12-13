import React from 'react';
import {
  withRouter,
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import ImgPreview from '../../../../Components/ImgPreview.jsx';
import {
    _axios_get_responds
} from '../../../utils.js';
import {
    submitUnitRespondsList
} from "../../../../redux/actions/unit.js";
import {
    handleNounsList,
    handleUsersList,
} from "../../../../redux/actions/general.js";
import { axios_get_UnitsBasic } from '../../../../utils/fetchHandlers.js';
import {
    cancelErr,
    uncertainErr
} from "../../../../utils/errHandlers.js";
import {
    domain
} from '../../../../../config/services.js';

class SwitchResponds extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        axios: false,
        unitsBasic: {},
        onNail: false
    };
      this.axiosSource = axios.CancelToken.source();
      this._set_respoondsUnits = this._set_respoondsUnits.bind(this);
      this._render_respondsthumbs = this._render_respondsthumbs.bind(this);
      this._handleEnter_sharedNail = this._handleEnter_sharedNail.bind(this);
      this._handleLeave_sharedNail = this._handleLeave_sharedNail.bind(this);
      this._handleClick_RespondThumb = this._handleClick_RespondThumb.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){
      //becuase there is chance we jump to another Unit but using the same component
      //so we check if the unit has changed
      //but Notice! always check the diff between the current & pre id from 'path search'
      //due to this is the only reliable and stable source (compare to the unitCurrent)
      let prevParams = new URLSearchParams(prevProps.location.search); //we need value in URL query
      if (this.unitId !== prevParams.get('unitId')) {
          this.props._submit_list_UnitResponds({ list: [], scrolled: true }, true); // reset the responds state to initial
          this._set_respoondsUnits();
      };
  }

  componentDidMount(){
      this._set_respoondsUnits();
  }

  componentWillUnmount(){
      if (this.state.axios) {
          this.axiosSource.cancel("component will unmount.")
      }
      this.props._submit_list_UnitResponds({ list: [], scrolled: true}, true); // reset the responds state to initial
  }

  _render_respondsthumbs() {
      let groupsDOM = [];
      const _nailsGroup = (unitGroup, groupIndex) => {
        let nailsDOM = [];
        unitGroup.forEach((unitId, index) => {
            if (!(unitId in this.state.unitsBasic)) return; //skip if the info of the unit not yet fetch

            let imgSrcCover = domain.protocol + '://' + domain.name + '/router/img/' + this.state.unitsBasic[unitId].pic_layer0 + '?type=thumb';

            nailsDOM.push(
                <div
                    key={"key_SwitchResponds_group_" + groupIndex + "_items" + index}
                    unitid={unitId}
                    className={classnames(
                        styles.boxImgBg,
                        { [styles.boxImgBgMouseOn]: (this.state.onNail == unitId) }
                    )}
                    onClick={this._handleClick_RespondThumb}
                    onMouseEnter={this._handleEnter_sharedNail}
                    onMouseLeave={this._handleLeave_sharedNail}>
                    <div
                      className={classnames(
                        styles.boxImg,
                        {[styles.boxImgMouseOn]: (this.state.onNail == unitId) }
                      )}>
                      <ImgPreview
                        blockName={''}
                        previewSrc={imgSrcCover}
                        _handleClick_ImgPreview_preview={() => { }} />
                    </div>
                </div>
            )
        });

        return nailsDOM;
      };

      this.props.unitCurrentResponds.list.forEach((unitGroup, index) => {
          groupsDOM.push(
              <div
                  key={"key_SwitchRespondsGroup_" + index}
                  className={classnames(
                      styles.boxItems)}>
                  {_nailsGroup(unitGroup, index)}
              </div>
          );
      });

      return groupsDOM;
  }


  render(){
      // and to know ths current unit independently (not restrict by unitCurrent fetched process)
      let params = new URLSearchParams(this.props.location.search); //we need value in URL query
      this.unitId = params.get('unitId');

      return this.props.unitCurrentResponds.list.length > 0 ? (
        <div
            className={classnames(styles.comSwitchResponds)}>
            {this._render_respondsthumbs()}
        </div>
      ) : null
  }

  _handleClick_RespondThumb(event) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.props.location.pathname.includes('explore/unit')) {
        // the browser, which do not know the origin it has was modified, need to be modified again to have the pratical history
        window.history.replaceState(this.props.location.state, '', this.props.location.pathname + this.props.location.search);
    };
    //and Notice! history should be pushed after the replaceState has been done
    let urlParams = new URLSearchParams(this.props.location.search);
    urlParams.set('unitId', event.currentTarget.getAttribute('unitid'));
    urlParams.set('unitView', "theater");
    this.props.history.push({
        pathname: this.props.match.path, //should always be ".../unit" because primer only used in a Unit
        search: urlParams.toString(),
        state: { from: this.props.location }
    });
  }


  _set_respoondsUnits() {
    /* this section was transplant from Related, but the first part was rm because we would only fetch once in this comp */
    const self = this;
    this.setState({ axios: true });

    _axios_get_responds(this.axiosSource.token, {
        exposedId: this.unitId,
        limit: 6,
        listUnitBase: false // only fetch once, no need to pass 'the time of the last one'
    })
    .then((resObj) => {
        // list was saved in redux state
        self.props._submit_list_UnitResponds({
            list: resObj.main.unitsList,
            scrolled: resObj.main.scrolled
        });

        return axios_get_UnitsBasic(self.axiosSource.token, resObj.main.unitsList) //and use the list to get the data of eahc unit
    })
    .then((resObj) => {
        //after res of axios_Units: still call get nouns & users
        self.props._submit_NounsList_new(resObj.main.nounsListMix);
        self.props._submit_UsersList_new(resObj.main.usersList);
        //and final, update the data of units to state
        self.setState((prevState, props) => {
            return ({
                axios: false,
                unitsBasic: { ...prevState.unitsBasic, ...resObj.main.unitsBasic },
                // no need, marksBasic: { ...prevState.marksBasic, ...resObj.main.marksBasic }
            });
        });

    }).catch(function (thrown) {
        if (axios.isCancel(thrown)) {
            cancelErr(thrown);
        } else {
            self.setState((prevState, props) => {
                return { axios: false }
            }, () => {
                let message = uncertainErr(thrown);
                if (message) alert(message);
            });
        }
    });
  }

    _handleEnter_sharedNail(e) {
        this.setState({ onNail: e.currentTarget.getAttribute('unitid') })
    }

    _handleLeave_sharedNail(e) {
        this.setState({ onNail: false })
    }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
    unitCurrentResponds: state.unitCurrentResponds,
    i18nUIString: state.i18nUIString
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {
      _submit_NounsList_new: (arr) => { dispatch(handleNounsList(arr)); },
      _submit_UsersList_new: (arr) => { dispatch(handleUsersList(arr)); },
      _submit_list_UnitResponds: (obj, reset) => { dispatch(submitUnitRespondsList(obj, reset)); },
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(SwitchResponds));
