import React, { useEffect } from "react";
import fs from "fs";
import path from "path";
import Head from "next/head";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import retitle from "../../lib/retitle";
import { BlogPost, postManifest } from "../../manifests/posts";
import config from "../../config";
import NavigationView from "../../components/ui/NavigationView";
import Breadcrumbs from "../../components/ui/Breadcrumbs";

const BlogPostPage = ({ post }: { post: BlogPost }) => {
  useEffect(() => {
    document.getElementById(config.rootElementId)?.scrollTo({ top: 0 });
  }, []);

  return (
    <>
      <Head>
        <title>{retitle(post?.title)}</title>
        <meta property="og:title" content={retitle(post?.title)} key="title" />
      </Head>
      <Breadcrumbs
        items={[
          {
            title: "Posts",
            href: "/posts"
          },
          {
            title: post?.title ?? "Post"
          }
        ]} />
      <NavigationView
        content={(
          <article className="content-page">
            <div className="header">
              <h2>{post?.title}</h2>
              {post?.subtitle && <span className="subtitle">{post?.subtitle}</span>}
              <span className="timestamp">
                {post?.publishedAt ? new Date(post?.publishedAt).toDateString() : ""}
              </span>
            </div>
            <div className="content">
              <ReactMarkdown>
                {decodeURI(post?.content ?? "")}
              </ReactMarkdown>
            </div>
            <hr />
            <p style={{ width: "100%", textAlign: "center" }}>
              <small><Link href="/posts">&larr; See all posts</Link></small>
            </p>
          </article>
        )} />
    </>
  );
};

export const getStaticPaths = async () => {
  return {
    paths: [...postManifest.keys()].map((slug) => ({ params: { slug } })),
    fallback: false
  };
};

export const getStaticProps = async (context: any) => {
  const postContentDir = path.join(process.cwd(), "content", "posts");
  const definition = postManifest.get(context.params.slug);
  if (!definition) throw new Error(`Manifest for post '${context.params.slug}' not found`);
  const content = fs.readFileSync(path.join(postContentDir, definition.filePath), { encoding: "utf8" });
  const post: BlogPost = {
    ...definition,
    publishedAt: (definition?.publishedAt as Date).getTime(),
    slug: context.params.slug,
    content
  };
  return {
    props: { post },
  };
};

export default BlogPostPage;
