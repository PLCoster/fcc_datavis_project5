import Head from 'next/head';
import TreeMapContainer from '../components/TreeMapContainer';

export default function Home() {
  return (
    <>
      <Head>
        <title>Treemap Diagram</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <TreeMapContainer />
    </>
  );
}
