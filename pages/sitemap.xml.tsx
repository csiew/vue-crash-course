import React from "react";
import path from "path";
import { Post } from "../manifests/@types";
import { nowPostManifest } from "../manifests/now";
import { postManifest } from "../manifests/posts";
import config from "../config";

const generateSiteMap = (posts: Post[]) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     ${["/", "now", "now/archive", "posts", "playlists", "projects", "now-watching"]
    .map((suffixUrl) => {
      return `
      <url>
          <loc>${path.join(config.host.baseUrl, suffixUrl)}</loc>
      </url>
      `;
    })
    .join("")}
     ${posts
    .map(({ slug, layout }) => {
      const prefixUrl: string = layout === "now" ? "now" : "posts";
      return `
      <url>
          <loc>${path.join(config.host.baseUrl, prefixUrl, slug!)}</loc>
      </url>
      `;
    })
    .join("")}
   </urlset>
 `;
};

const SiteMap = () => {
  // getServerSideProps will do the heavy lifting
  return <></>;
};

export const getServerSideProps = async (context: any) => {
  const posts = [...postManifest.entries(), ...nowPostManifest.entries()]
    .map(([slug, post]) => {
      return { ...post, slug };
    });

  // We generate the XML sitemap with the posts data
  const sitemap = generateSiteMap(posts);

  context.res.setHeader("Content-Type", "text/xml");
  // we send the XML to the browser
  context.res.write(sitemap);
  context.res.end();

  return {
    props: {},
  };
};

export default SiteMap;
