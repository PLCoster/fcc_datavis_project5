/**
 * Some useful links for treemaps in D3:
 *
 * Basic TreeMap from JSON data:
 * https://d3-graph-gallery.com/graph/treemap_json.html
 *
 * TreeMap with color groups:
 * https://bl.ocks.org/mbostock/6bbb0a7ff7686b124d80
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
  const padding = { left: 40, bottom: 40, top: 40, right: 40 };

  const graphSVG = plotDiv
    .append('svg')
    .attr('class', 'treemap-svg')
    .attr('width', width)
    .attr('height', height);

  graphSVG.append('rect').attr('width', width).attr('height', height);

  // Create a color scale
  // !!! TODO
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
  d3.treemap().size([width, height]).paddingInner(1).round(true)(root);

  // use this information to add rectangles:
  graphSVG
    .selectAll('rect')
    .data(root.leaves())
    .enter()
    .append('rect')
    .attr('x', function (d, i) {
      console.log('i is: ', i);
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
    .style('fill', 'slateblue');

  // and to add the text labels
  graphSVG
    .selectAll('text')
    .data(root.leaves())
    .enter()
    .append('text')
    .attr('x', function (d) {
      return d.x0 + 5;
    }) // +10 to adjust position (more right)
    .attr('y', function (d) {
      return d.y0 + 20;
    }) // +20 to adjust position (lower)
    .text(function (d) {
      return d.data.name;
    })
    .attr('font-size', '15px')
    .attr('fill', 'white');

  console.log('ROOT is: ', root);
}

export default buildTreeMap;
