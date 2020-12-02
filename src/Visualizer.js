import React from 'react';
import Chart from './Chart';

class Visualizer extends React.Component {
  calcStats(dataSet) {
    const size = dataSet.length;
    let arithmeticMean, median, mode, stdDev, range, maxCount;
    const counts = this.calcCounts(dataSet);
    const collection = counts.collection; // all values along with number of occurrences
    
    range = dataSet[size - 1] - dataSet[0];
    arithmeticMean = dataSet.reduce((a,b) => a+b) / size;
    median = (size % 2) === 0 ? (dataSet[size/2] + dataSet[(size/2) - 1]) / 2 : dataSet[Math.floor(size/2)];
    mode = counts.mode;
    maxCount = counts.maxCount;
    stdDev = this.calcStdDev(dataSet, arithmeticMean);
    
    const stats = {
      arithmeticMean: arithmeticMean,
      median: median,
      mode: mode,
      stdDev: stdDev,
      range: range,
      min: dataSet[0],
      max: dataSet[size-1],
      maxCount: maxCount,
      collection: collection
    };
    
    return stats;
  }
  
  calcCounts(dataSet) {
    let key = dataSet[0];
    let maxKey = key;
    let count = 0;
    let maxCount = 1;
    let collection = [];
    
    for(const i of dataSet) {
      if(i === key) {
        if(++count > maxCount) {
          maxCount = count;
          maxKey = i;
        }
      } else {
        collection.push({value: key, count: count});
        key = i;
        count = 1;
      }
    }
    
    collection.push({value: key, count: count});
    
    return ({mode: maxKey, maxCount: maxCount, collection: collection});
  }
  
  calcStdDev(dataSet, arithmeticMean) {
    let rms = dataSet.map(x => Math.pow((x - arithmeticMean),2));
    return ( Math.sqrt(rms.reduce((a,b) => a + b) / dataSet.length) );
  }
  
  render() { 
    const stats = this.calcStats(this.props.dataSet);
    
    return(
      <Chart stats={stats} data={this.props.dataSet} />
    );
  }
}

export default Visualizer;