import { useState, useEffect } from 'react';

import buildTreeMap from './helpers/buildTreeMap';

import styles from './styles/TreeMap.module.css';

const treemapParentID = 'treemap-container';

function TreeMap({ plotInfo, dataReady, containerWidth }) {
  const [containerOpacity, setContainerOpacity] = useState(0);

  useEffect(() => {
    // When data is ready, update plot using helper, make it visible
    if (dataReady) {
      buildTreeMap(plotInfo, `#${treemapParentID}`, containerWidth);
      setContainerOpacity(1);
    }
  }, [plotInfo, dataReady, containerWidth, setContainerOpacity]);

  return (
    <div
      className={styles.treemapContainer}
      style={{ opacity: containerOpacity }}
    >
      <h1 id="title" className={`display-6 ${styles.title}`}>
        {plotInfo.title}
      </h1>
      <h2 id="description" className={`display-6 ${styles.subtitle}`}>
        {plotInfo.subtitle}
      </h2>
      <div id={treemapParentID}></div>
    </div>
  );
}

export default TreeMap;
