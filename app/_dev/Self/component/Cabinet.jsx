import React from 'react';
import CreateShare from '../../Component/CreateShare.jsx';
import UnitModal from '../../Component/UnitModal.jsx';
import ModalBox from '../../Component/ModalBox.jsx';
import ModalBackground from '../../Component/ModalBackground.jsx';

export default class Cabinet extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      query: null,
      unitModalify: false,
      focusUnitName: null,
      unitsList: [],
      unitsDataSet: {}
    };
    this._handleClick_Share = this._handleClick_Share.bind(this);
    this._handleClick_nav_span = this._handleClick_nav_span.bind(this);
    this._handleChange_SearchInput = this._handleChange_SearchInput.bind(this);
    this._submit_Share_New = this._submit_Share_New.bind(this);
    this._close_modal_Unit = this._close_modal_Unit.bind(this);
    this.style={
      selfCom_Cabinet_: {
        width: '100%',
        position: 'absolute',
        top: '0',
        left: '0'
      },
      selfCom_Cabinet_today_: {
        width: '100%',
        minHeight: '37vh',
        position: 'relative'
      },
      selfCom_Cabinet_today_span: {
        display: 'block',
        width: '18%',
        position: 'relative',
        float: 'left',
        top: '50%',
        transform: 'translate(0, -50%)',
        boxSizing: 'border-box',
        margin: '0 3% 0 0',
        borderRight: 'solid 1px black',
        fontSize: '2.7vh',
        letterSpacing: '0.2vh',
        color: '#A99056',
        cursor: 'pointer'
      },
      selfCom_Cabinet_nav_: {
        width: '100%',
        height: '8vh',
        position: 'relative',
        boxSizing: 'border-box',
        margin: ' 1vh 0',
        padding: '0.5vh 0'
      },
      selfCom_Cabinet_nav_CreateShare: {
        width: '36%',
        height: '96%',
        position: 'relative',
        float: 'right'
      },
      selfCom_Cabinet_nav_search: {
        width: '70%',
        height: '10%',
        position: 'absolute',
        top: '0',
        left: '0',
        boxSizing: 'border-box',
        padding: '1.2% 0',
        border: 'none',
        borderBottom: '2px inset #FAFAFA',
        backgroundColor: 'transparent',
        fontSize: '2.4vh',
        color: '#FAFAFA'
      },
      selfCom_Cabinet_second_: {
        width: '101%',
        position: "relative"
      },
      selfCom_Cabinet_second_div_: {
        display: 'inline-block',
        width: '32%',
        height: '32vh',
        position: 'relative',
        boxSizing: 'border-box',
        margin: '0 1% 2vh 0',
        overflow: 'hidden',
        cursor: 'pointer'
      },
      selfCom_Cabinet_second_div_img: {
        maxWidth: '150%',
        maxHeight: '150%',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)'
      }
    }
  }

  _handleClick_nav_span(event){
    event.stopPropagation();
    event.preventDefault();
    this.props._set_cabinet(event.currentTarget.getAttribute('tab'));
  }

  _handleClick_Share(event){
    event.stopPropagation();
    event.preventDefault();
    this.setState({
      unitModalify: true,
      focusUnitName: event.currentTarget.getAttribute('unitname')
    })
  }

  _handleChange_SearchInput(){
    this.setState({
      query: this.search.value
    }, () => {
      if (this.state.query && this.state.query.length > 0) {
        this._axios_get_NounSet()
      }
    })
  }

  _submit_Share_New(dataObj){
    const self = this;
    axios.get('/get/user/shared?purpose=cabinet', {
      headers: {'charset': 'utf-8'}
    }).then(function(res){
      self._set_cabinet('shared')
    })
  }

  _close_modal_Unit(){
    this.setState({
      unitModalify: false,
      focusUnitName: null
    })
  }

  componentDidMount(){
    const self = this;
    axios.get('/user/cabinet?focus=all', {
      headers: {'charset': 'utf-8'}
    }).then(function(res){
      self.setState({
        unitsList: res.data.unitsList,
        unitsDataSet: res.data.unitsDataSet
      })
    })
  }

  render(){
    //let cx = cxBind.bind(styles);
    const self = this;
    let shares = self.state.unitsList.map(function(dataKey, index){
      let dataValue = self.state.unitsDataSet[dataKey];
      return(
        <div
          key={'key_Shared_Shares_share_'+index}
          unitname={dataKey}
          style={self.style.selfCom_Cabinet_second_div_}
          onClick={self._handleClick_Share}>
          <img
            src={dataValue.img_cover}
            style={self.style.selfCom_Cabinet_second_div_img}/>
        </div>
      )
    })

    return(
      <div
        style={this.style.selfCom_Cabinet_}>
        <div
          style={this.style.selfCom_Cabinet_today_}>
          {'today'}
          <span
            tab={"collection"}
            style={this.style.selfCom_Cabinet_today_span}
            onClick={this._handleClick_nav_span}>
            {"COLLECTION"}
          </span>
          <span style={this.style.selfCom_Cabinet_today_span}>{"BROADCAST"}</span>
          <span
            tab={"shared"}
            style={this.style.selfCom_Cabinet_today_span}
            onClick={this._handleClick_nav_span}>
            {"SHARED"}
          </span>
        </div>
        <nav
          style={this.style.selfCom_Cabinet_nav_}>
          <input
            placeholder="..."
            ref={input => this.search = input}
            style={this.style.selfCom_Cabinet_nav_search}
            onChange={this._handleChange_SearchInput}
          />
          <div>
            {' O '}
          </div>
          <div
            style={this.style.selfCom_Cabinet_nav_CreateShare}>
            <img src="/vacancy.png" style={{width: '100%', height: '100%'}}/>
            <CreateShare
              _submit_Share_New={this._submit_Share_New}/>
          </div>
        </nav>
        <div
          style={this.style.selfCom_Cabinet_second_}>
          {shares}
        </div>
        {
          this.state.unitModalify &&
          <ModalBox containerId="root">
            <ModalBackground onClose={this._close_modal_Unit}>
              <UnitModal
                unitName={this.state.focusUnitName}
                _close_modal_Unit={this._close_modal_Unit}/>
            </ModalBackground>
          </ModalBox>
        }
      </div>
    )
  }
}
