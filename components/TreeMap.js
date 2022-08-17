import { useEffect } from 'react';

import buildTreeMap from './helpers/buildTreeMap';

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
      {dataReady ? (
        <>
          <h1 id="title">{plotInfo.title}</h1>
          <h2 id="description">{plotInfo.subtitle}</h2>
          <p>dataReady: {`${dataReady}`}</p>
          <div className={parentContainerClassName}></div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default TreeMap;
