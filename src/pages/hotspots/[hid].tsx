import React from "react";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import { QueryCache } from "react-query";
import { dehydrate } from "react-query/hydration";


import { prefetchBlockHeight, prefetchHotspot, useHotspot } from "../../api";

import { Page } from "../../components/Page";
import { Heading } from "../../components/Heading";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { Container } from "../../components/Container";

export default function Hotspot({
  hotspotId,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();
  const hotspotQuery = useHotspot(hotspotId);
  const hotspot = hotspotQuery.data;

  // TODO(ehesp): Handle not found pages
  const title = router.isFallback ? "" : hotspot?.name;
  const isLoading = router.isFallback || !hotspot;

  return (
    <Page title={title}>
      <Header />
      <section className="bg-helium-dark py-16">
        <Container>
          {isLoading && <div>Loading....</div>}

          {!isLoading && (
            <div>
              <Heading type="h1">{hotspot.name}</Heading>
              <div className="flex items-center space-x-2">
                <img src="https://explorer.helium.com/static/media/hotspot.7112996e.svg" alt="Hotspot" className="h-4" />
                <code className="text-gray-300 text-sm leading-relaxed">{hotspotId}</code>
              </div>
            </div>
          )}
        </Container>
      </section>
      <Footer />
    </Page>
  );
}


export const getStaticProps: GetStaticProps = async ({ params }) => {
  const hotspotId = params.hid.toString();
  const queryCache = new QueryCache();

  await prefetchBlockHeight(queryCache);
  await prefetchHotspot(queryCache, hotspotId);

  return {
    props: {
      hotspotId,
      dehydratedState: dehydrate(queryCache),
    },
  };
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}
