import React from 'react';
import './Chart.css';

class Chart extends React.Component {
  render() {
    return (
      <div id="Chart-container">
        <div id="Chart-area">
          <Graph stats={this.props.stats} data={this.props.data} />
        </div>
        <div id="Chart-stats">
          <StatTable stats={this.props.stats} />
        </div>
      </div>
    );
  }
}

function StatTable(props) {
  const stats = props.stats;
  
  return (
    <table id="Stat-table">
      <thead>
        <tr>
          <th>Basic Stats</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Mean</td>
          <td>{Math.floor(stats.arithmeticMean * 1000) / 1000}</td>
        </tr>
        <tr>
          <td>Median</td>
          <td>{stats.median}</td>
        </tr>
        <tr>
          <td>Mode</td>
          <td>{stats.mode}</td>
        </tr>
        <tr>
          <td>Std Deviation</td>
          <td>{Math.floor(stats.stdDev * 1000) / 1000}</td>
        </tr>
      </tbody>
    </table>
  );
}

class Graph extends React.Component {
   getGraphArea() {
    const stats = this.props.stats;
    
    const maxCount = stats.maxCount;
    const min = stats.min;
    const range = stats.range;
    const xpad = Math.ceil(.1 * range);
    const ypad = Math.ceil(.1 * maxCount);
    
    let xmin = (min - xpad) > 0 ? (-xpad) : Math.floor(min - xpad);
    let width = Math.ceil((min + range + xpad) - xmin);
    let height = maxCount + (2 * ypad);
    
    return( {xmin: xmin, ypad: ypad, width: width, height: height} );
  }
  
  getInterval(range) {
    return Math.pow(10, Math.floor(Math.log10(range)));
  }
  
  getXYScaling(width, height, vbw, vbh) {
    let xscale = 1;
    let yscale = -1; // accounts for y increasing downward
    
    let xinter = this.getInterval(width);
    let yinter = this.getInterval(height);
    
    if((width / xinter) < 5) xinter /= 10;
    if((height / yinter) < 5 && (yinter / 10) >= 1) yinter /= 10;
    
    let numx = Math.floor(width / xinter);
    let numy = Math.floor(height / yinter);
    
    xscale = Math.floor(vbw / numx);
    yscale = -Math.floor(vbh / numy);

    // when the displayed intervals on the axes go up an order of magnitude, 
    // scale factor must be reduced by a power of ten
    if(xinter >= 10) {xscale /= Math.pow(10,Math.log10(xinter))}
    if(yinter >= 10) {yscale /= Math.pow(10,Math.log10(yinter))}
    
    return ({xscale: xscale, yscale: yscale, xinter: xinter, yinter: yinter});
  }
  
  render() {
    const stats = this.props.stats;
    const graphArea = this.getGraphArea();
    const x0 = graphArea.xmin;
    const ypad = graphArea.ypad;
    const width = graphArea.width;
    const height = graphArea.height;
    const vbw = 1000;
    const vbh = 500;
    
    const xyscale = this.getXYScaling(width, height, vbw, vbh);
    const xscale = xyscale.xscale;
    const yscale = xyscale.yscale;
    
    const vbparams = [x0 * xscale, -vbh - (ypad * yscale), vbw, vbh].join(' ');
    
    let stddev1 = stats.arithmeticMean - stats.stdDev;
    let stddev2 = stats.arithmeticMean + stats.stdDev;
    
    return (
    <svg id='Data-graph' viewBox={vbparams}>
      <rect
        id='Data-graph-bg'
        x={x0 * xscale}
        y={(height - ypad) * yscale}
        width={width * xscale}
        height={height * -yscale}
      />
      <line 
        className='Axis'
        x1={x0 * xscale} 
        y1='0' 
        x2={(x0 + width) * xscale} 
        y2='0'
      />
      <line 
        className='Axis'
        x1='0' 
        y1='0' 
        x2='0'
        y2={(height-ypad) * yscale}
      />
      <Grid
        graphArea={graphArea}
        xyscale={xyscale}
      />
      <Bars 
        coll={stats.collection}
        xscale={xscale}
        yscale={yscale}
      />
      <Marker 
        val={stats.arithmeticMean} 
        xscale={xscale} 
        yscale={yscale}
        id='Mean-marker'
        text={'Mean: ' + stats.arithmeticMean}
      />
      <Marker 
        val={stats.median} 
        xscale={xscale} 
        yscale={yscale} 
        id='Median-marker'
        text={'Median: ' + stats.median}
      />
      <Marker 
        val={stddev1} 
        xscale={xscale} 
        yscale={yscale} 
        id='Stddev-marker1'
        text={'Standard Deviation: ' + Math.floor(stats.stdDev * 1000) / 1000}
      />
      <Marker 
        val={stddev2} 
        xscale={xscale} 
        yscale={yscale} 
        id='Stddev-marker2'
        text={'Standard Deviation: ' + Math.floor(stats.stdDev * 1000) / 1000}
      />
    </svg>
    );
  }
}

function Marker(props) {
  const val = Math.floor(props.val * 1000) / 1000;
  
  let points = (val * props.xscale) + 
    ',' + (-.4 * props.yscale) + 
    ' ' + ((val+.2) * props.xscale) + 
    ',' + (-.6 * props.yscale) + 
    ' ' + ((val-.2) * props.xscale) + 
    ',' + (-.6 * props.yscale);
  
  return(
    <g>
      <polygon 
        points={points} 
        id={props.id}
      />
      <Hint 
        text={props.text} 
        xpos={(val + .6) * props.xscale}
        ypos={-.7 * props.yscale}
      />
    </g>
  );
}

function Hint(props) {
  return(
    <text
      x={props.xpos}
      y={props.ypos}
      className="Hint"
    >
      {props.text}
    </text>
  );
}

function Bars(props) {
  const coll = props.coll;
  const xscale = props.xscale;
  const yscale = props.yscale;
  let bars = [];
  
  for(const i of coll) {
    bars.push(
      <line 
        key={'data-' + i.value} 
        className='Data-graph-bar' 
        x1={i.value * xscale} 
        y1={0} 
        x2={i.value * xscale} 
        y2={i.count * yscale} 
      />
    );
  }

  return (
    <g>{bars}</g>
  );
}

function Grid(props) {
  const graphArea = props.graphArea;
  const x0 = graphArea.xmin;
  const ypad = graphArea.ypad;
  const width = graphArea.width;
  const height = graphArea.height;
    
  const xscale = props.xyscale.xscale;
  const yscale = props.xyscale.yscale;
  const xinter = props.xyscale.xinter;
  const yinter = props.xyscale.yinter;
  
  let gridlines = [];
  let legend = [];
  let i = 0;
  do {
    gridlines.push(
      <line 
        key={'gridx-' + i} 
        className='Data-graph-grid' 
        x1={i * xscale} 
        y1='0'
        x2={i * xscale} 
        y2={(height - ypad) * yscale} 
      />
    );
    legend.push(
      <text
        key={'legx-' + i}
        x={(i * xscale)}
        y={-.3 * yscale}
        className='Data-graph-grid-scale'
      >
      {i}
      </text>
    );
    i += xinter;
  } while (i < (x0 + width));
  
  if(x0 < 0) {
    i = -xinter;
    while(i > x0) {
      gridlines.push(
        <line
          key={'gridx-' + i}
          className='Data-graph-grid'
          x1={i * xscale}
          y1='0'
          x2={i * xscale}
          y2={(height - ypad) * yscale} 
        />
      );
      legend.push(
        <text
          key={'legx-' + i}
          x={i * xscale}
          y={-.3 * yscale}
          className='Data-graph-grid-scale'
        >
        {i}
        </text>
      );
      i -= xinter;
    }
  }
  
  i = 0;
  while((i += yinter) < (height - ypad) ) {
    gridlines.push(
      <line 
        key={'gridy-' + i} 
        className='Data-graph-grid' 
        x1={x0 * xscale} 
        y1={i * yscale}
        x2={(x0 + width) * xscale} 
        y2={i * yscale} 
      />
    );
    legend.push(
      <text
        key={'legy-' + i}
        x={.1 * xscale}
        y={(i + .1) * yscale}
        className='Data-graph-grid-scale'
      >
      {i}
      </text>
    );
  }
    
  return (
    <g>
      {gridlines}
      {legend}
    </g>
  );
}

export default Chart;