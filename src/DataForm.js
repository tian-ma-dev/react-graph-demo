import React from 'react';
import './DataForm.css';

class DataForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      textBoxValue: '', // makes data available to click handler, true state is in App
      fileData: '',
    };
    
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.readFiles = this.readFiles.bind(this);
    this.getDataFromFile = this.getDataFromFile.bind(this);
    this.handleClear = this.handleClear.bind(this);
  }
  
  handleInputChange(event) {
    if(event.target.name === 'DataTextBox') {
      this.setState({textBoxValue: event.target.value});
    } else if(event.target.name === 'File') {
      let files = event.target.files;
      this.setState({fileData: ''}, () => this.readFiles(files) );
    }
  }
  
  handleClick(event) {
    if(event.target.name === 'UploadButton' && !!this.state.fileData) {
      this.props.onDataInput(this.state.fileData);
    } else if(event.target.name === 'SubmitButton') {
      this.props.onDataInput(this.state.textBoxValue);
    }
  }
  
  handleClear(event) {
    this.props.onClear(event);
  }
  
  readFiles(files) {
    for(let i = 0; i < files.length; i++) {
      let fileData = new FileReader();
      fileData.onloadend = this.getDataFromFile;
      fileData.readAsText(files[i]);
    }
  }
  
  getDataFromFile(event) {
    const content = event.target.result;
    this.setState({fileData: this.state.fileData + '\n' + content});
  }
  
  render() {
    return (
      <div className="Data-entry">
        <form className="Data-entry-form">
          <div id="Form-main-container">
            <div id="Form-sub-container">
              <div id="Form-div-1">
                <label htmlFor="DataTextBox">Enter manually</label>
                <br />
                <textarea 
                  id="DataTextBox" 
                  name="DataTextBox"
                  rows="10"
                  cols="40"
                  onChange={this.handleInputChange}
                />
                <br />
                <button 
                  type="button" 
                  name="SubmitButton"
                  id="SubmitButton"                
                  onClick={this.handleClick}
                >
                  Add data
                </button>
              </div>
              <div id="Form-div-2">OR</div>
              <div id="Form-div-3">
                <label htmlFor="File">Select a file</label>
                <br />
                <input 
                  type="file" 
                  id="File"
                  name="File" 
                  multiple 
                  onChange={this.handleInputChange}
                />
                <br />
                <button 
                  type="button" 
                  name="UploadButton" 
                  id="UploadButton"
                  onClick={this.handleClick}
                >
                  Add file contents
                </button>
              </div>
            </div>
          </div>
          <div id="Form-div-4">
            <button type="button" id="ClearButton" onClick={this.handleClear}>Clear data</button>
          </div>
        </form>
      </div>
    );
  }
}

export default DataForm;