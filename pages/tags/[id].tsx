import React, { useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Pool, PoolConfig } from "pg";
import config from "../../config";
import retitle from "../../lib/retitle";
import NavigationView from "../../components/ui/NavigationView";
import { Tag } from ".";
import Breadcrumbs from "../../components/ui/Breadcrumbs";

type ItemFromDb = {
  id: string;
  content_type: string;
  body: any;
  created_at: string;
  modified_at: string;
};

type ItemResult = {
  id: string;
  contentType: string;
  body: any;
  createdAt: Date;
  modifiedAt: Date;
};

function mapDbItemToResult(results: ItemFromDb[]): ItemResult[] {
  return results.map((result) => ({
    id: result.id,
    contentType: result.content_type,
    body: result.body,
    createdAt: new Date(result.created_at),
    modifiedAt: new Date(result.modified_at)
  }));
}

function TagListResult({ item }: { item: ItemResult }) {
  let title = "Untitled";
  let contentType: string = item.contentType;
  let url = "/";

  switch (item.contentType) {
  case "blog_post":
    title = item.body.title;
    contentType = "Post";
    url = `/posts/${item.body.urlSlug}`;
    break;
  case "project":
    title = item.body.title;
    contentType = "Project";
    url = `/projects/${item.body.urlSlug}`;
    break;
  case "tv_show":
    title = item.body.name;
    contentType = "Watching";
    url = `/watching/show/${item.body.imdbId}`;
    break;
  }

  return (
    <li>
      <h3>
        <Link href={url}>{title}</Link>
      </h3>
      <sub>{contentType}</sub>
    </li>
  );
}

function TagListPage({ items }: { items: any }) {
  const router = useRouter();
  const { id } = router.query;
  const results: ItemResult[] = mapDbItemToResult(items ? JSON.parse(items) : []);

  useEffect(() => {
    document.getElementById(config.rootElementId)?.scrollTo({ top: 0 });
  }, []);
  
  return (
    <>
      <Head>
        <title>{retitle(`Tags - ${id}`)}</title>
        <meta property="og:title" content={retitle(`Tags - ${id}`)} key="title" />
      </Head>
      <Breadcrumbs
        items={[
          {
            title: "Tags",
            href: "/tags"
          },
          {
            title: id as string | "Tag"
          }
        ]}
      />
      <NavigationView
        content={
          <article className="app-page">
            <h2>{id}</h2>
            <ul className="tags-result-list">
              {results.map((result: ItemResult) => (
                <TagListResult key={result.id} item={result} />
              ))}
            </ul>
          </article>
        }
      />
    </>
  );
}

export async function getStaticPaths() {
  const pool = new Pool(config.database as PoolConfig);
  const result = await pool.query("SELECT value::TEXT, COUNT(value) FROM (SELECT * FROM item WHERE item.body->>'tags' IS NOT NULL) a, jsonb_array_elements(a.body->'tags') GROUP BY value;");
  const tags: Tag[] = result.rows
    .map((tag: any) => ({
      value: tag.value.replaceAll("\"", ""),
      count: Number(tag.count)
    }))
    .sort((a: any, b: any) => a.count < b.count ? 1 : -1);
 
  const paths = tags.map((tag: Tag) => ({
    params: { id: encodeURI(tag.value) },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }: any) {
  const { id } = params;
  const pattern = /^[a-zA-Z0-9]+$/;
  if (!pattern.test(id)) return { props: { items: [] } };
  const pool = new Pool(config.database as PoolConfig);
  const result = await pool.query(`SELECT * FROM item WHERE body-> 'tags' IS NOT NULL AND body->>'tags' LIKE '%${id}%'`);
  const items = result.rows
    .map((item) => {
      if (item.body.body) item.body.body = atob(item.body.body);
      return item;
    });
  return { props: { items: JSON.stringify(items) } };
}

export default TagListPage;
