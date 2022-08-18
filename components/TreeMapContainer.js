import { useState, useEffect, useRef } from 'react';

import { Container, Button } from 'react-bootstrap';

import TreeMap from './TreeMap';

import styles from './styles/TreeMapContainer.module.css';

import gamesData from '../assets/games.json';
import moviesData from '../assets/movies.json';
import kickstarterData from '../assets/kickstarter.json';

// Information about each dataset, with formatting functions for category and value entries
const datasets = {
  games: {
    url: 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json',
    title: 'Video Game Sales',
    subtitle: 'Top 100 Best-Selling Games, Grouped by Platform',
    categoryFormatter: (categoryStr) => `Platform: ${categoryStr}`,
    valueFormatter: (valueStr) => `Sales: ${valueStr} million units`,
    backup: gamesData,
  },
  movies: {
    url: 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json',
    title: 'Movie Box Office',
    subtitle:
      'Top 100 Highest-Grossing (U.S. Domestic) Movies, Grouped by Genre',
    categoryFormatter: (categoryStr) => `Genre: ${categoryStr}`,
    valueFormatter: (valueStr) =>
      `Domestic Box Office: $${
        Math.round(valueStr / 10 ** 4) / 10 ** 2
      } million`,
    backup: moviesData,
  },
  kickstarter: {
    url: 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json',
    title: 'Kickstarter Pledges',
    subtitle:
      'Top 100 Highest-Pledged Kickstarter Campaigns, Grouped by Category',
    categoryFormatter: (categoryStr) => `Category: ${categoryStr}`,
    valueFormatter: (valueStr) =>
      `Total Pledged: $${Math.round(valueStr / 10 ** 4) / 10 ** 2} million`,
    backup: kickstarterData,
  },
};

function TreeMapContainer() {
  const [currentDatasetName, setCurrentDatasetName] = useState('games');

  const [plotDatasets, setPlotDatasets] = useState({});
  const [currentDataset, setCurrentDataset] = useState({
    title: null,
    subtitle: null,
    categoryFormatter: null,
    valueFormatter: null,
    data: null,
  });
  const [loadingData, setLoadingData] = useState(true);

  const [containerWidth, setContainerWidth] = useState(1000);

  const containerRef = useRef(null);

  // Load Current Dataset by Name it whenever the current Dataset Changes:
  useEffect(() => {
    const { url, title, subtitle, categoryFormatter, valueFormatter, backup } =
      datasets[currentDatasetName];

    const plotInfo = { title, subtitle, categoryFormatter, valueFormatter };

    if (plotDatasets[currentDatasetName]) {
      setCurrentDataset({
        ...plotInfo,
        data: plotDatasets[currentDatasetName],
      });
      return;
    }

    // Otherwise we need to fetch the data via API or file backup
    setLoadingData(true);
    fetch(url)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }

        throw new Error(
          'Bad status from API request, switching to backup data'
        );
      })
      .then((data) => {
        console.log('GOT DATA: ', data);
        setPlotDatasets({ ...plotDatasets, [currentDatasetName]: data });
        setCurrentDataset({
          ...plotInfo,
          data,
        });
      })
      .catch((err) => {
        // Revert to backup dataset JSON
        console.log('ERROR during fetch: ', err.message);
        setPlotDatasets({
          ...plotDatasets,
          [currentDatasetName]: datasets[currentDatasetName].backup,
        });
        setCurrentDataset({
          ...plotInfo,
          data: datasets[currentDatasetName].backup,
        });
      })
      .finally(() => {
        setLoadingData(false);
      });
  }, [currentDatasetName, plotDatasets]);

  // Set up event listener to update plot width on window resize
  useEffect(() => {
    const handleWindowResize = () => {
      setContainerWidth(containerRef.current.clientWidth);
    };
    handleWindowResize();
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  return (
    <main>
      <Container className={styles.treemapcontainer} ref={containerRef}>
        <div className={styles.databuttoncontainer}>
          <h5>Select Dataset: </h5>
          <Button
            className={styles.databutton}
            onClick={() => setCurrentDatasetName('games')}
          >
            Games
          </Button>
          <Button
            className={styles.databutton}
            onClick={() => setCurrentDatasetName('movies')}
          >
            Movies
          </Button>
          <Button
            className={styles.databutton}
            onClick={() => setCurrentDatasetName('kickstarter')}
          >
            Kickstarter
          </Button>
        </div>
        <TreeMap
          plotInfo={currentDataset}
          dataReady={!loadingData}
          containerWidth={containerWidth}
        />
      </Container>
    </main>
  );
}

export default TreeMapContainer;
