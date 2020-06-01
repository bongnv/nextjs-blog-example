const BlogPost = ({ post }) => {
  return <main>
    <h1>{post.title}</h1>
    <article
      dangerouslySetInnerHTML={{ __html: post.html }}
    />
  </main>
}

export default BlogPost;

export const getStaticProps = async ({ params }) => {
  const { getPostBySlug } = await import("../../lib/api");
  const post = await getPostBySlug(params.slug, [
    "title",
    "html",
  ]);

  return {
    props: {
      post,
    },
  };
};

export const getStaticPaths = async () => {
  const { getPostSlugs } = await import("../../lib/api");
  const slugs = await getPostSlugs();

  return {
    paths: slugs.map((slug) => {
      return {
        params: {
          slug,
        },
      };
    }),
    fallback: false,
  };
}
