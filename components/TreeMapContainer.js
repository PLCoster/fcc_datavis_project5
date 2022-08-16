import { useState, useEffect, useCallback } from 'react';

import { Container, Button } from 'react-bootstrap';

import styles from './styles/TreeMapContainer.module.css';

import gamesData from '../assets/games.json';
import moviesData from '../assets/movies.json';
import kickstarterData from '../assets/kickstarter.json';

const datasets = {
  games: {
    url: 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json',
    title: 'UPDATE THIS',
    backup: gamesData,
  },
  movies: {
    url: 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json',
    title: 'UPDATE THIS',
    backup: moviesData,
  },
  kickstarter: {
    url: 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json',
    title: 'UPDATE THIS',
    backup: kickstarterData,
  },
};

function TreeMapContainer() {
  const [currentDatasetName, setCurrentDatasetName] = useState('games');

  const [plotDatasets, setPlotDatasets] = useState({});
  const [currentDataset, setCurrentDataset] = useState(null);
  const [loadingData, setLoadingData] = useState(true);

  // Load Current Dataset by Name it whenever the current Dataset Changes:
  useEffect(() => {
    const { url, title, backup } = datasets[currentDatasetName];

    if (plotDatasets[currentDatasetName]) {
      setCurrentDataset({ title, data: plotDatasets[currentDatasetName] });
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
        setCurrentDataset({ title, data });
      })
      .catch((err) => {
        console.log('ERROR during fetch: ', err.message);
        setPlotDatasets({
          ...plotDatasets,
          [currentDatasetName]: datasets[currentDatasetName],
        });
        setCurrentDataset({ title, data: datasets[currentDatasetName] });
      })
      .finally(() => {
        setLoadingData(false);
      });
  }, [currentDatasetName, plotDatasets]);

  return (
    <>
      <Container className={styles.treemapcontainer}>
        <Button onClick={() => setCurrentDatasetName('games')}>Games</Button>
        <Button onClick={() => setCurrentDatasetName('movies')}>Movies</Button>
        <Button onClick={() => setCurrentDatasetName('kickstarter')}>
          Kickstarter
        </Button>
        <p>{currentDatasetName}</p>
        {loadingData ? (
          <p>Loading Data...</p>
        ) : (
          <p>{JSON.stringify(currentDataset)}</p>
        )}
      </Container>
    </>
  );
}

export default TreeMapContainer;
