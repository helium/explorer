import { NextApiRequest, NextApiResponse } from "next";
import algoliasearch from "algoliasearch";

import Hotspot from "@helium/http/build/models/Hotspot";

import { client } from "../../api";

const algolia = algoliasearch("LOSRZ1CP06", process.env.ALGOLIA_API_KEY);
const index = algolia.initIndex(process.env.ALGOLIA_INDEX);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.statusCode = 404;
    res.end();
    return;
  }

  const { token } = req.body;

  if (token !== process.env.SYNC_HOTSPOTS_TOKEN) {
    res.statusCode = 401;
    res.end();
    return;
  }

  const hotspots = await client.hotspots.list();
  const all: Hotspot[] = await hotspots.take(2000);

  const objects = all.map((hotspot) => {
    const serialized = JSON.parse(JSON.stringify(hotspot));
    delete serialized["client"];

    return {
      ...serialized,
      objectID: serialized.address,
    };
  });

  await index.saveObjects(objects);

  res.status(200).end("Ok");
};
