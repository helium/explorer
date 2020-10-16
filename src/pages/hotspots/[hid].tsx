import React from "react";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import Error from "next/error";
import { useRouter } from "next/router";
import { QueryCache } from "react-query";
import { dehydrate } from "react-query/hydration";

import { prefetchBlockHeight, prefetchHotspot, useHotspot } from "../../api";

import { Page } from "../../components/Page";
import { Heading } from "../../components/Heading";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { Container } from "../../components/Container";
import { Star } from "../../components/Star";

export default function Hotspot({
  hotspotId,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { isFallback } = useRouter();

  const hotspotQuery = useHotspot(isFallback ? undefined : hotspotId);
  const hotspot = hotspotQuery.data;

  // TODO(ehesp): Handle not found pages
  const isLoading = isFallback || hotspotQuery.isLoading;

  if (!isLoading && !hotspot) {
    return <Error statusCode={404} title="This hotspot could not be found." />;
  }

  const title = isLoading && hotspot?.name;

  return (
    <Page title={title}>
      <Header />
      <section className="bg-helium-dark py-16">
        <Container>
          {isLoading && <div>Loading....</div>}

          {!isLoading && (
            <div className="text-white">
              <Heading type="h1">{hotspot.name}</Heading>
              <div className="mt-4 flex items-center space-x-2">
                <img
                  src="https://explorer.helium.com/static/media/hotspot.7112996e.svg"
                  alt="Hotspot"
                  className="h-4"
                />
                <code className="text-gray-300 text-sm leading-relaxed">
                  {hotspotId}
                </code>
                <Star id={`hotspot:${hotspotId}`} />
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
  // TODO(ehesp): Iterate through known hotspots & add as paths.
  // Note; we still allow fallbacks incase new ones are added after build.
  return {
    paths: [],
    fallback: true,
  };
}
