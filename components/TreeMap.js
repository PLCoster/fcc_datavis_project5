import { useEffect } from 'react';

import buildTreeMap from './helpers/buildTreeMap';

import styles from './styles/TreeMap.module.css';

const parentContainerClassName = 'treemap-container';

function TreeMap({ plotInfo, dataReady }) {
  useEffect(() => {
    // When data is ready, update plot using helper
    if (dataReady) {
      buildTreeMap(plotInfo, `.${parentContainerClassName}`);
    }
  }, [plotInfo, dataReady]);

  return (
    <div>
      <h1 id="title" className={`display-6 ${styles.title}`}>
        {plotInfo.title}
      </h1>
      <h2 id="description" className={`display-6 ${styles.subtitle}`}>
        {plotInfo.subtitle}
      </h2>
      <div className={parentContainerClassName}></div>
    </div>
  );
}

export default TreeMap;
