/**
 * Some useful links for treemaps in D3:
 *
 * Basic TreeMap from JSON data:
 * https://d3-graph-gallery.com/graph/treemap_json.html
 *
 * TreeMap with color groups:
 * https://bl.ocks.org/mbostock/6bbb0a7ff7686b124d80
 *
 * Ordinal Color Scales:
 * https://observablehq.com/@d3/d3-scaleordinal
 *
 */

import * as d3 from 'd3';

import styles from '../styles/TreeMap.module.css';

// Helper that updates tooltip when a county is moused over
const handleMouseOver = (
  event,
  tileData,
  valueFormatter,
  categoryFormatter,
  colorScale
) => {
  const tooltip = d3.select('#tooltip');
  // const tooltipBackgroundColor = colorScale(countyData.bachelorsOrHigher);
  const screenWidth = d3.select('body').node().getBoundingClientRect().width;

  // Display tooltip at cursor position, add county data and dynamic color
  tooltip
    .html('')
    .attr('data-value', tileData.data.value)
    .style('top', `${event.layerY - 100}px`)
    .style(
      'left',
      `${event.layerX + 20}px`
      // event.layerX > screenWidth / 2
      //   ? `${event.layerX - 200}px`
      //   : `${event.layerX + 20}px`
    )
    // .style(
    //   'color',
    //   COLOR_ARR.indexOf(tooltipBackgroundColor) > 4
    //     ? 'white'
    //     : `${BACKGROUND_COLOR}`
    // )
    .style('background-color', colorScale(tileData.data.category))
    .style('visibility', 'visible');
  // .style('display', 'block');

  tooltip.append('h5').text(`${tileData.data.name.split(/: | - |, |\. /)[0]}`);
  tooltip.append('h6').text(`Name: ${tileData.data.name}`);
  tooltip.append('h6').text(categoryFormatter(tileData.data.category));
  tooltip.append('h6').text(valueFormatter(tileData.data.value));
};

// Hide tooltip on county mouseout
const handleMouseOut = () => {
  d3.select('#tooltip').style('visibility', 'hidden');
};

function buildTreeMap(
  { data, valueFormatter, categoryFormatter },
  parentSelector
) {
  console.log('Trying to build tree map!');
  console.log(valueFormatter, categoryFormatter);

  const plotDiv = d3.select(parentSelector);
  plotDiv.html('');

  const width = 1000;
  const height = 0.8 * width;
  const padding = {
    right: 140,
    tileInner: 1,
    tileTextInner: 5,
  };
  const tileFontSize = width / 100;

  const graphSVG = plotDiv
    .append('svg')
    .attr('class', 'treemap-svg')
    .attr('width', width)
    .attr('height', height);

  // Add tooltip element
  plotDiv
    .append('div')
    .attr('id', 'tooltip')
    .attr('class', styles.tooltip)
    .style('position', 'absolute')
    .style('visibility', 'hidden');

  // Create a color scale for the tiles
  const colorScale = d3.scaleOrdinal(d3.schemeTableau10.concat(d3.schemeDark2));

  // Determine the size of the root node (containing all the children)
  const root = d3
    .hierarchy(data)
    .sum((d) => d.value)
    .sort(function (a, b) {
      return b.height - a.height || b.value - a.value;
    });

  // Then d3.treemap computes the position of each element of the hierarchy
  d3
    .treemap()
    .size([width - padding.right, height])
    .paddingInner(padding.tileInner)(root);

  // Add a group element for each tile
  graphSVG
    .selectAll('g')
    .data(root.leaves())
    .enter()
    .append('g')
    .attr('class', 'tile-group')
    .on('mouseover', (event, tileData) =>
      handleMouseOver(
        event,
        tileData,
        valueFormatter,
        categoryFormatter,
        colorScale
      )
    )
    .on('mousemove', (event, tileData) =>
      handleMouseOver(
        event,
        tileData,
        valueFormatter,
        categoryFormatter,
        colorScale
      )
    )
    .on('mouseout', (event, tileData) => handleMouseOut());

  // Add colored tiles for each game / movie / project
  graphSVG
    .selectAll('.tile-group')
    .append('rect')
    .attr('class', 'tile')
    .attr('x', (d, i) => d.x0)
    .attr('y', (d) => d.y0)
    .attr('width', (d) => d.x1 - d.x0)
    .attr('height', (d) => d.y1 - d.y0)
    .attr('data-name', (d) => d.data.name)
    .attr('data-category', (d) => d.data.category)
    .attr('data-value', (d) => d.data.value)
    .style('stroke', 'black')
    .style('fill', (d) => colorScale(d.data.category));

  // Add text labels to each tile group
  graphSVG
    .selectAll('.tile-group')
    .append('text')
    .attr('class', 'tile-text')
    .attr('x', (d) => d.x0 + padding.tileInner)
    .attr('y', (d) => d.y0 + tileFontSize + padding.tileInner)
    .attr('font-size', `${tileFontSize}px`)
    .attr('fill', 'white')
    .selectAll('tspan')
    .data((d) => {
      // Smart-splitting of entry name to fit inside tile boundaries
      return d.data.name
        .replace(/\//, ' & ')
        .split(/ /)
        .reduce((accum, word) => {
          // If it is the first word in the name, add it immediately
          if (!accum.length) {
            accum.push({ word, x: d.x0, y: d.y0, h: d.y1 - d.y0 });
            return accum;
          }

          // Otherwise determine if the current word can be added onto the same line

          // Get approx width of last word:
          const lastDataObj = accum[accum.length - 1];
          const lastWordLength = lastDataObj.word.length;
          const availableTileWidth = d.x1 - d.x0 - 2 * padding.tileTextInner;

          // Determine if the current word will fit on the same line
          if ((lastWordLength + word.length + 1) * 6 < availableTileWidth) {
            // Current word will fit on line with previous word(s) -> combine into one token
            lastDataObj.word = lastDataObj.word + ' ' + word;
          } else {
            // Current word will not fit on same line, add it as separate token
            accum.push({ word, x: d.x0, y: d.y0, h: d.y1 - d.y0 });
          }

          return accum;
        }, []);
    })
    .enter()
    .append('tspan')
    .attr('x', (d) => d.x + padding.tileTextInner)
    .attr('y', (d, i) => d.y + tileFontSize + padding.tileTextInner + i * 10)
    .attr('visibility', (d, i) => {
      // Hide any tspan elements that would overflow bottom of tile
      return tileFontSize + padding.tileTextInner + (i + 1) * 10 > d.h
        ? 'hidden'
        : 'visible';
    })
    .text((d) => d.word);

  // Add category color legend:
  const categories = root.children.map((child) => child.data.name);
  console.log(categories);
  0;

  const rectSize = 20;
  const legendFontSize = 12;

  const legendGroup = graphSVG.append('g').attr('id', 'legend');

  legendGroup
    .selectAll('rect')
    .data(categories)
    .enter()
    .append('rect')
    .attr('class', 'legend-item')
    .attr('x', width - padding.right + 10)
    .attr('y', (d, i) => (i + 1) * rectSize * 2)
    .attr('width', rectSize)
    .attr('height', rectSize)
    .style('fill', (d) => colorScale(d));

  legendGroup
    .selectAll('text')
    .data(categories)
    .enter()
    .append('text')
    .attr('class', 'legend-text')
    .attr('x', width - padding.right + 20 + rectSize)
    .attr('y', (d, i) => (i + 1) * rectSize * 2 + 16)
    .attr('width', rectSize)
    .attr('height', rectSize)
    .style('fill', 'white')
    .attr('font-size', `${legendFontSize}px`)
    .text((d) => d);

  console.log('ROOT: ', root);
}

export default buildTreeMap;
