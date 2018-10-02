import React from 'react';
import SvgPropic from '../../Component/SvgPropic.jsx';
import DraftDisplay from '../../Component/DraftDisplay.jsx';
import UnitModal from '../../Component/UnitModal.jsx';
import ModalBox from '../../Component/ModalBox.jsx';
import ModalBackground from '../../Component/ModalBackground.jsx';

export default class CosmicSelected extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      unitModalify: false,
      focusUnitId: null,
      unitsList: [],
      unitsBasic: {},
      marksBasic: {},
      usersBasic: {}
    };
    this.axiosSource = axios.CancelToken.source();
    this._handleClick_Unit = this._handleClick_Unit.bind(this);
    this._close_modal_Unit = this._close_modal_Unit.bind(this);
    this.style={
      withinCom_Cosmic_Selected_: {
        width: '100%',
        position: 'absolute',
        top: '0',
        left: '0'
      },
      withinCom_Cosmic_Selected_list_: {

      },
      withinCom_Cosmic_Selected_list_nail_: {

      }
    }
  }

  _handleClick_Unit(event){
    event.stopPropagation();
    event.preventDefault();
    this.setState({
      unitModalify: true,
      focusUnitId: event.currentTarget.getAttribute('unitid')
    })
  }

  _close_modal_Unit(){
    this.setState({
      unitModalify: false,
      focusUnitId: null
    })
  }

  componentDidMount(){
    const self = this;
    this.setState((prevState, props)=>{return {axios: true};}, ()=>{
      let url = this.props.urlParam+this.props.urlQuery;
      axios.get(url, {
        headers: {
          'charset': 'utf-8',
          'token': window.localStorage['token']
        },
        cancelToken: self.axiosSource.token
      }).then(function (res) {
          self.setState((prevState, props)=>{
            let resObj = JSON.parse(res.data);
            return {
              axios: false,
              unitsList: resObj.main.unitsList,
              marksBasic: resObj.main.marksBasic,
              unitsBasic: resObj.main.unitsBasic,
              usersBasic: resObj.main.usersBasic
            }
          });
      }).catch(function (thrown) {
        if (axios.isCancel(thrown)) {
          console.log('Request canceled: ', thrown.message);
        } else {
          console.log(thrown);
          self.setState({axios: false});
          alert("Failed, please try again later");
        }
      });
    })
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    //let cx = cxBind.bind(styles);
    const self = this;
    let nails = this.state.unitsList.map((key, index)=>{
      let unitBasic = this.state.unitsBasic[key];
      return (
        <div
          key={'key_selected_'+index}
          unitid={key}
          style={this.style.withinCom_Cosmic_Selected_list_nail_}
          onClick={self._handleClick_Unit}>
          <img
            src={'/router/img/'+unitBasic.pic_layer0+'?type=thumb'}
            style={{}}/>
          <div
            style={{}}>
            <div
              style={{}}>
              <SvgPropic/>
            </div>
          </div>
        </div>
      );
    })

    return(
      <div
        style={this.style.withinCom_Cosmic_Selected_}>
        <div
          style={this.style.withinCom_Cosmic_Selected_list_}>
          {nails}
        </div>
        {
          this.state.unitModalify &&
          <ModalBox containerId="root">
            <ModalBackground onClose={this._close_modal_Unit}>
              <UnitModal
                unitId={this.state.focusUnitId}
                unitInit={Object.assign(this.state.unitsBasicSet[this.state.focusUnitId], {marksify: true, initMark: "all", layer: 0})}
                _close_modal_Unit={this._close_modal_Unit}/>
            </ModalBackground>
          </ModalBox>
        }
      </div>
    )
  }
}
