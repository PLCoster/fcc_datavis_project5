import { useState, useEffect, useCallback } from 'react';

import { Container, Button } from 'react-bootstrap';

import TreeMap from './TreeMap';

import styles from './styles/TreeMapContainer.module.css';

import gamesData from '../assets/games.json';
import moviesData from '../assets/movies.json';
import kickstarterData from '../assets/kickstarter.json';

const datasets = {
  games: {
    url: 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json',
    title: 'Video Game Sales',
    subtitle: 'Top 100 Best-Selling Games, Grouped by Platform',
    backup: gamesData,
  },
  movies: {
    url: 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json',
    title: 'Movie Box Office',
    subtitle:
      'Top 100 Highest-Grossing (U.S. Domestic) Movies, Grouped by Genre',
    backup: moviesData,
  },
  kickstarter: {
    url: 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json',
    title: 'Kickstarter Pledges',
    subtitle:
      'Top 100 Highest-Pledged Kickstarter Campaigns, Grouped by Category',
    backup: kickstarterData,
  },
};

function TreeMapContainer() {
  const [currentDatasetName, setCurrentDatasetName] = useState('games');

  const [plotDatasets, setPlotDatasets] = useState({});
  const [currentDataset, setCurrentDataset] = useState({
    title: null,
    subtitle: null,
    data: null,
  });
  const [loadingData, setLoadingData] = useState(true);

  // Load Current Dataset by Name it whenever the current Dataset Changes:
  useEffect(() => {
    const { url, title, subtitle, backup } = datasets[currentDatasetName];

    if (plotDatasets[currentDatasetName]) {
      setCurrentDataset({
        title,
        subtitle,
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
        <div className={styles.databuttoncontainer}>
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
        <TreeMap plotInfo={currentDataset} dataReady={!loadingData} />
      </Container>
    </>
  );
}

export default TreeMapContainer;
