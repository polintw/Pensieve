import React from 'React';

export default class InfoNoun extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      query: '',
      results: []
    };
    this._handleClick_nounAdd = this._handleClick_nounAdd.bind(this);
    this._handleChange_SearchInput = this._handleChange_SearchInput.bind(this);
    this._axios_get_NounSet = this._axios_get_NounSet.bind(this);
    this.style={

    }
  }

  _axios_get_NounSet(){
    axios.get(`/get/public/noun?prefix=${this.state.query}&limit=5`).then((res) => {
      if(res.status = 200){
        console.log("success");
        this.setState({
          results: res.data.results
        });
      }else{
        console.log(res.data)
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

  _handleClick_nounAdd(event){
    event.stopPropagation();
    event.preventDefault();
    this.search.value = ''
    this.setState({query: '', results:[]});
    this.props._set_nounsArr(event.target.innerText)
  }

  render() {
    const options = this.state.results.map((noun, index) => (
      return(
        <li
          key={'_key_nounOption_'+index}
          onClick={this._handleClick_nounAdd}>
          {noun}
        </li>
      )
    ))

    const nouns = this.props.nounsArr.map((noun, index) => (
      return(
        <li
          key={'_key_nounOption_'+index}
          onClick={this._handleClick_locationAdd}>
          {noun}
        </li>
      )
    ))

    return (
      <div>
        <input
          placeholder="Add issue..."
          ref={input => this.search = input}
          onChange={this._handleChange_SearchInput}
        />
        <ul>
          {options}
        </ul>
        <div>
          {nouns}
        </div>
      </div>
    )
  }
}
