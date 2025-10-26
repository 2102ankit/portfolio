import { notFound } from 'next/navigation';
import { Calendar, Clock, User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { getBlogPostBySlug, getBlogPosts } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} - Ankit Mishra`,
    description: post.excerpt,
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.published_at || undefined,
      authors: [post.author],
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
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
                <span>{format(new Date(post.published_at), 'MMMM dd, yyyy')}</span>
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
              __html: post.content
                .split('\n')
                .map((line) => {
                  if (line.startsWith('# ')) {
                    return `<h1>${line.substring(2)}</h1>`;
                  }
                  if (line.startsWith('## ')) {
                    return `<h2>${line.substring(3)}</h2>`;
                  }
                  if (line.startsWith('### ')) {
                    return `<h3>${line.substring(4)}</h3>`;
                  }
                  if (line.startsWith('- ')) {
                    return `<li>${line.substring(2)}</li>`;
                  }
                  if (line.trim() === '') {
                    return '<br/>';
                  }
                  return `<p>${line}</p>`;
                })
                .join('\n'),
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
