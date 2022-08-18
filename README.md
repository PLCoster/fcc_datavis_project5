# Free Code Camp: Data Visualisation Project 5 - Treemap Diagram

### Interactive Game Sales / Movie Box Office / Kickstarter Pledges Treemap

The aim of this project was to build a small web app and data visualisation with functionality similar to: https://codepen.io/freeCodeCamp/full/KaNGNR

- **JavaScript** with **[Node.js](https://nodejs.org/en/) / [NPM](https://www.npmjs.com/)** for package management
- **[React](https://reactjs.org/)** for application view with React Hooks to handle the application state
- **[D3](https://d3js.org/)** to generate the SVG Treemap from the data, using the`d3.hierachy()` and `d3.treemap()` APIs.
- **[React-Bootstrap](https://react-bootstrap.github.io/)** for react components with **[Bootstrap](https://getbootstrap.com/)** styles, along with some custom CSS
- **[Bootstrap Icons](https://icons.getbootstrap.com/)** for icons
- **[Next.js](https://nextjs.org/)** as a React Framework to develop and build the project

### Project Requirements

- **User Story #1:** My tree map should have a title with a corresponding `id="title"`.

- **User Story #2:** My tree map should have a description with a corresponding `id="description"`.

- **User Story #3:** My tree map should have `rect` elements with a corresponding `class="tile"` that represent the data.

- **User Story #4:** There should be at least 2 different fill colors used for the tiles.

- **User Story #5:** Each tile should have the properties `data-name`, `data-category`, and `data-value` containing their corresponding `name`, `category`, and `value`.

- **User Story #6:** The area of each tile should correspond to the `data-value` amount: tiles with a larger `data-value` should have a bigger area.

- **User Story #7:** My tree map should have a legend with corresponding `id="legend"`.

- **User Story #8:** My legend should have `rect` elements with a corresponding `class="legend-item"`.

- **User Story #9:** The `rect` elements in the legend should use at least 2 different fill colors.

- **User Story #10:** I can mouse over an area and see a tooltip with a corresponding `id="tooltip"` which displays more information about the area.

- **User Story #11:** My tooltip should have a `data-value` property that corresponds to the `data-value` of the active area.

### Project Writeup:

For the fifth Free Code Camp: Data Visualisation Project, I decided to build the Treemap inside a small Next.js app. The final project build is a static (i.e. serverless) website built in React, with application state controlled using React Hooks (`useState`, `useEffect`, `useRef`).

Going beyond the required User Stories above, uses can switch between three datasets and view a corresponding Treemap for each one. When a dataset is selected by clicking the corresponding button, the desired dataset is fetched (if not previously loaded), and then the Treemap is built.

A `window.onresize` event listener is added using a `useEffect` hook inside the `TreeMapContainer` component. When the window size changes, the plot container width is passed as props to the `TreeMap` component, which causes the D3 SVG to be re-rendered according to the available size. Details of the Treemap (font sizes, spacing etc) are adjusted based on the size available to render the Treemap.

### Project Files:

- `/public` - this folder contains all public content for the app, such as favicon images and the web manifest.

- `/pages` - in the Next.js framework, pages are associated with routes in the app based on the file name. In this app there is only a single route (`/`), and the React components that build the page are in `index.js`.

  - the `_app.js` page file is a special component that wraps every other page. In this project this just renders the `NavBar` component on every page, and adds in the FCC testing script.
  - `index.js` is the only page in this application, it renders the `Timer` component.
  - `404.js` is a custom error page that is set to redirect users immediately to the app if reached.

- `/components/helpers/buildTreeMap.js` - contains a set of functions that build the Treemap and append it to a desired DOM element. Rendering the Treemap us done using `<rect>` elements and D3's `hierachy()` and `treemap()` functionalities. Tiles are color coded by their parent category using D3's `scaleOrdinal()` API.

An `on:hover` tooltip is also added to the graph - it is a small div element which has its position, visibility and contents adjusted dynamically based on the current mouse position, using the `mouseover` event on Treemap `.tile-group` elements.

- `/styles` contains a global style sheet for the application.

### Components:

- `NavBar.js` is a presentational navbar component, providing links to other projects / sites.

- `TreeMapContainer.js` - This component renders the dataset-switching buttons, and the `TreeMap` component. After mounting, this component uses two `useEffect` hooks. One of these hooks is responsible for loading / updating the current dataset to be displayed, and is triggered whenever the `currentDatasetName` state is changed (by clicking on a dataset button). The other hook sets up the `window.onresize` event listener, listening for window resize events and then passing the current width of the `.appcontainer` element to the `TreeMap` component so it knows the size of plot to create.

  - `TreeMap.js` - this component uses a `useEffect` hook to render the Treemap SVG after the component mounts, and also whenever either the dataset is switched (`plotInfo` prop changes) or the `containerWidth` prop changes. The Treemap is built and mounted to the `#treemap-container` element using D3 by the functions in `helpers/buildTreeMap.js`. After building the graph for the first time, the opacity of the `.appcontainer` element is set to 1 using the `setContainerOpacity` dispatch function, making the graph visible.

### Usage

Requires Node.js / NPM in order to install required packages. After downloading the repo, install required dependencies with:

`npm install`

The Next development server can then be started with:

`npm run dev`

The development can then be viewed at `http://localhost:3000/` in the browser.

A static production build can be created in the `out/` folder using:

`npm run build`

This production build can then be served using:

`npm run start`
