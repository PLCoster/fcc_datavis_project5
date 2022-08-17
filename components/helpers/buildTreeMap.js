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
  console.log(data);

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
  const categories = data.children.map((child) => child.name);
  console.log(categories);

  // Determine the size of the root node (containing all the children)
  const root = d3
    .hierarchy(data)
    .sum((d) => d.value)
    .sort(function (a, b) {
      return b.height - a.height || b.value - a.value;
    });

  console.log('ROOT is: ', root);

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
    .attr('x', function (d, i) {
      return d.x0;
    })
    .attr('y', function (d) {
      return d.y0;
    })
    .attr('width', function (d) {
      return d.x1 - d.x0;
    })
    .attr('height', function (d) {
      return d.y1 - d.y0;
    })
    .style('stroke', 'black')
    .style('fill', (d) => {
      console.log('d is: ', d);
      return color(d.data.category);
    });

  // Add text labels to each cell
  graphSVG
    .selectAll('text')
    .data(root.leaves())
    .enter()
    .append('text')
    .attr('x', function (d) {
      return d.x0 + padding.tileInner;
    }) // +10 to adjust position (more right)
    .attr('y', function (d) {
      return d.y0 + tileFontSize + padding.tileInner;
    }) // +20 to adjust position (lower)
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
    .attr('fill-opacity', (d, i) => {
      //
      return tileFontSize + padding.tileTextInner + (i + 1) * 10 > d.h ? 0 : 1;
    })
    .text((d) => d.word);
}

export default buildTreeMap;
