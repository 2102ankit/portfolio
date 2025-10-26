import { notFound } from "next/navigation";
import { Calendar, Clock, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const parseMarkdown = (content: string) => {
  // Split content into lines
  const lines = content.split("\n");
  let output = [];
  let inCodeBlock = false;
  let codeBlockContent = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Handle code blocks (```)
    if (line.trim().startsWith("```")) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeBlockContent = [];
      } else {
        inCodeBlock = false;
        output.push(`<pre><code>${codeBlockContent.join("\n")}</code></pre>`);
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      continue;
    }

    // Process inline Markdown within the line
    line = processInlineMarkdown(line);

    // Handle block-level Markdown
    if (line.startsWith("# ")) {
      output.push(`<h1>${line.substring(2)}</h1>`);
    } else if (line.startsWith("## ")) {
      output.push(`<h2>${line.substring(3)}</h2>`);
    } else if (line.startsWith("### ")) {
      output.push(`<h3>${line.substring(4)}</h3>`);
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      // Handle lists, wrapping in <ul> if needed
      let listItems = [];
      while (
        i < lines.length &&
        (lines[i].startsWith("- ") || lines[i].startsWith("* "))
      ) {
        listItems.push(
          `<li>${processInlineMarkdown(lines[i].substring(2))}</li>`
        );
        i++;
      }
      i--; // Step back one line since the loop advances one extra
      output.push(`<ul>${listItems.join("")}</ul>`);
    } else if (line.startsWith("> ")) {
      output.push(`<blockquote>${line.substring(2)}</blockquote>`);
    } else if (line.trim() === "") {
      output.push("<br/>");
    } else {
      output.push(`<p>${line}</p>`);
    }
  }

  return output.join("");
};

// Helper function to process inline Markdown (bold, italic, inline code, links, images)
const processInlineMarkdown = (text: string) => {
  // Handle images: ![alt](url)
  text = text.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1">');

  // Handle links: [text](url)
  text = text.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');

  // Handle bold: **text** or __text__
  text = text.replace(/(?:\*\*|__)(.*?)(?:\*\*|__)/g, "<strong>$1</strong>");

  // Handle italic: *text* or _text_
  text = text.replace(/(?:\*|_)(.*?)(?:\*|_)/g, "<em>$1</em>");

  // Handle inline code: `text`
  text = text.replace(/`(.*?)`/g, "<code>$1</code>");

  return text;
};

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title} - Ankit Mishra`,
    description: post.excerpt,
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.published_at || undefined,
      authors: [post.author],
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Button asChild variant="ghost" className="mb-8 gap-2">
          <Link href="/blog">
            <ArrowLeft size={16} /> Back to Blog
          </Link>
        </Button>

        <header className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold mb-4">{post.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>{post.author}</span>
            </div>
            {post.published_at && (
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>
                  {format(new Date(post.published_at), "MMMM dd, yyyy")}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{post.reading_time} min read</span>
            </div>
          </div>
        </header>

        <Card className="p-6 sm:p-8 prose prose-neutral dark:prose-invert max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-code:text-primary prose-code:before:content-none prose-code:after:content-none prose-img:rounded-lg">
          <div
            dangerouslySetInnerHTML={{
              __html: parseMarkdown(post.content),
            }}
          />
        </Card>

        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Written by</p>
              <p className="font-semibold">{post.author}</p>
            </div>
            <Button asChild>
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
