import React from 'react';
import Head from 'next/head';
import LamentationWall from '../components/LamentationWall';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';

export default function Home() {
  return (
    <>
      <Head>
        <title>Lamentation Wall - Place Your Prayer Requests</title>
        <meta name="description" content="A sacred space to pour out your heart before God. Submit prayer requests, petitions, thanksgiving, and intercessions." />
        <meta property="og:title" content="Lamentation Wall - Prayer Request Platform" />
        <meta property="og:description" content="Share your prayers and support others in their spiritual journey" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      
      <LamentationWall />
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  };
};
