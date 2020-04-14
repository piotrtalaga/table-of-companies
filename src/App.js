import React, {Component} from 'react';
import './App.css';
import Header from "./components/Header";
import MainField from "./components/MainField";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      askType: 'name',
      searchedPhrase: ''
    }
  };

  whatToSearch = (askType, phrase) => {
    this.setState({
      askType: askType,
      searchedPhrase: phrase
    });
  };

  render() {
    return (
        <>
          <Header whatToSearch={this.whatToSearch}/>
          <MainField askType={this.state.askType} searchedPhrase={this.state.searchedPhrase}/>
        </>
    );
  }
}

export default App;
