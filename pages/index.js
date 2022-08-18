import Head from 'next/head';
import TreeMapContainer from '../components/TreeMapContainer';

const basePrefix = process.env.NEXT_PUBLIC_BASE_PATH || '';

export default function Home() {
  return (
    <>
      <Head>
        <title>Treemap Diagram</title>
        <link rel="icon" href={basePrefix + '/favicon.ico'} />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href={basePrefix + '/apple-touch-icon.png'}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={basePrefix + '/favicon-32x32.png'}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={basePrefix + '/favicon-16x16.png'}
        />
        <link rel="manifest" href={basePrefix + '/site.webmanifest'} />
      </Head>
      <TreeMapContainer />
    </>
  );
}
