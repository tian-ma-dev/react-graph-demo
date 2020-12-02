import React from 'react';
import DataForm from './DataForm';
import Visualizer from './Visualizer';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSet: null,
    }
    
    this.handleDataInput = this.handleDataInput.bind(this);
    this.handleClear = this.handleClear.bind(this);
  }
  
  handleDataInput(data) {
    if(data) {
      const cleanedData = data.match(/-?[0-9]*\.?[0-9]+/g).map(str => parseFloat(str));
      let numArray = [];
      
      for(let i of cleanedData) {
        if(i===0 || !!i) {
          numArray.push(i);
        }
      }

      if(numArray.length > 0) {
        if(!!this.state.dataSet && this.state.dataSet.length > 0) {
          this.setState({
            dataSet: [].concat(this.state.dataSet, numArray).sort((a,b) => a-b),
          });
        } else {
          this.setState({
            dataSet: numArray.sort((a,b) => a-b),
          });
        }
      }
    }
  }
  
  handleClear(event) {
    this.setState({dataSet: null});
  }
  
  render() {
    let vis;

    if(!!this.state.dataSet && this.state.dataSet.length > 0) {
      vis = <Visualizer dataSet={this.state.dataSet} />;
    }
    
    return (
      <div className="App">
        <Header 
          heading="React Bar Graph Demo" 
          description="- See statistics on a data set -" 
        />
        <h3>Send some numbers to begin</h3>
        <DataForm 
          onDataInput={this.handleDataInput}
          onClear={this.handleClear}
        />
        {vis}
      </div>
    );
  }
}

function Header(props) {
  return (
    <header className="App-header">
      <h1>{props.heading}</h1>
      <p>{props.description}</p>
    </header>
  );
}

export default App;
