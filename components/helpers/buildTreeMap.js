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

function buildTreeMap({ data }, parentSelector) {
  console.log('Trying to build tree map!');

  const plotDiv = d3.select(parentSelector);
  plotDiv.html('');

  const width = 1000;
  const height = 0.8 * width;
  const padding = {
    left: 40,
    bottom: 40,
    top: 40,
    right: 40,
    tileInner: 1,
    tileTextInner: 5,
  };
  const tileFontSize = width / 100;

  const graphSVG = plotDiv
    .append('svg')
    .attr('class', 'treemap-svg')
    .attr('width', width)
    .attr('height', height);

  // Create a color scale
  const color = d3.scaleOrdinal(d3.schemeTableau10.concat(d3.schemeAccent));

  // Determine the size of the root node (containing all the children)
  const root = d3
    .hierarchy(data)
    .sum((d) => d.value)
    .sort(function (a, b) {
      return b.height - a.height || b.value - a.value;
    });

  // Then d3.treemap computes the position of each element of the hierarchy
  d3.treemap().size([width, height]).paddingInner(padding.tileInner)(root);

  // graphSVG.selectAll('g').data(root.leaves()).enter().append('g');

  // Add colored tiles for each game / movie / project
  graphSVG
    .selectAll('rect')
    .data(root.leaves())
    .enter()
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
    .style('fill', (d) => color(d.data.category));

  // Add text labels to each tile
  graphSVG
    .selectAll('text')
    .data(root.leaves())
    .enter()
    .append('text')
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
          // If no word has been added yet
          if (!accum.length) {
            accum.push({ word, x: d.x0, y: d.y0, h: d.y1 - d.y0 });
            return accum;
          }
          // Get approx width of last word:
          const lastDataObj = accum[accum.length - 1];
          const lastWordLength = lastDataObj.word.length;
          const availableTileWidth = d.x1 - d.x0 - 2 * padding.tileTextInner;
          // Determine if the current word will fit on the same line
          if ((lastWordLength + word.length + 1) * 6 < availableTileWidth) {
            lastDataObj.word = lastDataObj.word + ' ' + word;
          } else {
            accum.push({ word, x: d.x0, y: d.y0, h: d.y1 - d.y0 });
          }

          return accum;
        }, []);
    })
    // .data((d) => {
    //   return d.data.name
    //     .split(/ /)
    //     .map((word) => ({ word, x: d.x0, y: d.y0, h: d.y1 - d.y0 }));
    // })
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

  const categories = data.children.map((child) => child.name);
  console.log(categories);
}

export default buildTreeMap;
