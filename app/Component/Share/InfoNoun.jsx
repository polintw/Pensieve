import React from 'React';
import ModalBox from '../ModalBox.jsx';

export default class InfoNoun extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      query: null,
      nounsList: []
    };
    this._handleClick_nounChoose = this._handleClick_nounChoose.bind(this);
    this._handleClick_nounCreate = this._handleClick_nounCreate.bind(this);
    this._handleChange_SearchInput = this._handleChange_SearchInput.bind(this);
    this._axios_get_NounSet = this._axios_get_NounSet.bind(this);
    this.style={
      Com_InfoNoun_: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0%',
        left: '0%'
      },
      Com_InfoNoun_input: {
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
      Com_InfoNoun_modal_ul_:{
        width: '100%',
        minHeight: '10%',
        position: 'absolute',
        top: '10%',
        boxSizing: 'border-box',
        margin: '0',
        boxShadow: '0px 5px 1.8vh -0.5vh #010101',
        backgroundColor: '#51514A',
        color: '#FAFAFA'
      },
      Com_InfoNoun_modal_ul_li: {
        boxSizing: 'border-box',
        margin: '15px 0',
        fontSize: '2.4vh',
        cursor: 'pointer'
      },
      Com_InfoNoun_list_: {
        width: '100%',
        height: '84%',
        position: 'absolute',
        top: '15%',
        left: '0',
        boxSizing: 'border-box'
      }
    }
  }

  _axios_get_NounSet(){
    axios.get(`/router/lists/nouns/search?prefix=${this.state.query}&limit=5`, {
      headers: {
        'charset': 'utf-8',
        'token': window.localStorage['token']
      }
    }).then((res) => {
      if(res.status = 200){
        console.log("success");
        let resObj = JSON.parse(res.data);
        this.setState({
          nounsList: resObj.main.nounsList
        });
      }else{
        console.log(res.data.message)
      }
    }).catch(function (error) {
      console.log(error);
    });
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

  _handleClick_nounChoose(event){
    event.stopPropagation();
    event.preventDefault();
    this.search.value = ''
    this.setState({query: null, nounsList:[]});
    let nounChoosed = Object.assign({}, this.state.nounsList[event.currentTarget.getAttribute('index')]);
    nounChoosed['ify'] = true;
    this.props._set_nounsArr(nounChoosed);
  }

  _handleClick_nounCreate(event){
    event.stopPropagation();
    event.preventDefault();
    let nounBasic = {name: this.state.query, ify: false};
    this.props._set_nounsArr(nounBasic);
    this.search.value = '';
    this.setState({query: null, nounsList:[]});
  }

  render() {
    const options = this.state.nounsList.map((nounBasic, index) => {
      return(
        <li
          key={'_key_nounOption_'+index}
          index={index}
          style={this.style.Com_InfoNoun_modal_ul_li}
          onClick={this._handleClick_nounChoose}>
          {nounBasic.name}
        </li>
      )
    })

    const nouns = this.props.nounsArr.map((nounBasic, index) => {
      return(
        <li
          key={'_key_nounOption_'+index}>
          {nounBasic.name}
        </li>
      )
    })

    return (
      <div
        id='id_Com_InfoNoun_'
        style={this.style.Com_InfoNoun_}>
        <input
          placeholder="Add issue..."
          ref={input => this.search = input}
          style={this.style.Com_InfoNoun_input}
          onChange={this._handleChange_SearchInput}
        />
        {
          this.state.query &&
          <ModalBox containerId="id_Com_InfoNoun_">
            <ul
              style={this.style.Com_InfoNoun_modal_ul_}>
              {options}
              <li
                style={this.style.Com_InfoNoun_modal_ul_li}
                onClick={this._handleClick_nounCreate}>
                {" 新增 +"}
              </li>
            </ul>
          </ModalBox>
        }
        <div
          style={this.style.Com_InfoNoun_list_}>
          {nouns}
        </div>
      </div>
    )
  }
}
