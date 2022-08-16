import Head from 'next/head';
import Image from 'next/image';

import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <>
      {/* !!! <div className={styles.container}> */}
      <Head>
        <title>Treemap Diagram</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <p>TreeMap</p>
    </>
  );
}
