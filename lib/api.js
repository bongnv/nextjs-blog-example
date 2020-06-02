import { promises as fs } from "fs";
import path from "path";
import grayMatter from "gray-matter";
import { pick } from "lodash";
import remark from "remark";
import remarkHtml from "remark-html";
import visit from "unist-util-visit";

const contentDir = path.resolve(process.cwd(), "content");
const resolve = require.context("../content", true, /\.jpg$/, "lazy")

const remarkImages = () => {
  return (tree, file, next) => {
    const nodes = [];
    visit(tree, "image", (node) => {
      nodes.push(node);
    });

    Promise.all(
      nodes.map(async (node) => {
        const alt = node.alt ? `alt="${node.alt}"` : "";
        const result = await resolve(node.url);
        const rawHtml = `<img class="lazy" src="${result.trace}" data-src="${result.src}" ${alt}>`;
        node.type = "html";
        node.value = rawHtml;
      }),
    )
      .then(() => next && next(null, tree, file))
      .catch(err => {
        next && next(err, tree, file);
      });
  };
};

const markdownToHtml = async (markdown) => {
  const result = await remark()
    .use(remarkImages)
    .use(remarkHtml).process(markdown)
  return result.toString();
}

export const getPostBySlug = async (slug, fields) => {
  const filePath = path.join(contentDir, `${slug}.md`);
  const fileContent = await fs.readFile(filePath);
  const { data, content } = grayMatter(fileContent);
  const html = await markdownToHtml(content);
  return pick({
    ...data,
    html,
  }, fields);
}

export const getAllPosts = async (fields) => {
  const slugs = await getPostSlugs();
  const posts = await Promise.all(slugs.map(async (slug) => {
    const post = await getPostBySlug(slug, fields);
    return {
      ...post,
      slug,
    }
  }));
  return posts;
}

export const getPostSlugs = async () => {
  const files = await fs.readdir(contentDir);
  return files.filter(file => file.endsWith(".md")).map(file => file.slice(0, -3));
}
