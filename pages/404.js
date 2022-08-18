import { useEffect } from 'react';

import Error from 'next/error';
import { useRouter } from 'next/router';

export default function Custom404() {
  const router = useRouter();

  // Redirect to the app
  useEffect(() => {
    router.replace('/');
  });

  // Note this behaviour could possibly be achieved with next.js redirects
  // https://nextjs.org/docs/api-reference/next.config.js/redirects

  return (
    <Error statusCode={404} title="This page does not exist! Redirecting.." />
  );
}
