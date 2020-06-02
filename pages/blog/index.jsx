const BlogIndex = ({ posts }) => {
  return <main>
    <ul>
      {posts.map((post) => (<li key={post.slug}><a href={`/blog/${post.slug}`}>{post.title}</a></li>))}
    </ul>
  </main>
}

export default BlogIndex;

export const getStaticProps = async ({ params }) => {
  const { getAllPosts } = await import("../../lib/api");
  const posts = await getAllPosts([
    "title",
    "slug",
  ]);

  return {
    props: {
      posts,
    },
  };
};
