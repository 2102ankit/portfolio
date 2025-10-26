"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, Tag } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getBlogPosts, type BlogPost } from "@/lib/data";
import { format } from "date-fns";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    async function loadPosts() {
      try {
        const data = await getBlogPosts();
        setPosts(data);
      } catch (error) {
        console.error("Error loading blog posts:", error);
      } finally {
        setLoading(false);
      }
    }
    loadPosts();
  }, []);

  const allTags = Array.from(
    new Set(posts.flatMap((post) => post.tags))
  ).sort();

  const filteredPosts = selectedTag
    ? posts.filter((post) => post.tags.includes(selectedTag))
    : posts;

  if (loading) {
    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-muted rounded w-1/3 mx-auto" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 bg-muted rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Blog</h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto ">
            Thoughts, tutorials, and insights about software development,
            technology, and my journey
          </p>
        </motion.div>

        {allTags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-3">
              <Tag size={18} className="text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Filter by topic:</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={selectedTag === null ? "default" : "outline"}
                className="cursor-pointer hover:border-foreground/50 transition-all"
                onClick={() => setSelectedTag(null)}
              >
                All Posts
              </Badge>
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  className="px-3 py-1.5 cursor-pointer hover:border-foreground/50 transition-all hover:bg-gray-500/30"
                  onClick={() => setSelectedTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </motion.div>
        )}

        {filteredPosts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-lg text-muted-foreground">
              No blog posts found. Check back soon for new content!
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredPosts.map((post) => (
              <motion.div key={post.id} variants={itemVariants}>
                <Card className="h-full flex flex-col hover:border-foreground/20 transition-all group">
                  <CardHeader>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>
                          {post.published_at
                            ? format(
                                new Date(post.published_at),
                                "MMM dd, yyyy"
                              )
                            : "Draft"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{post.reading_time} min read</span>
                      </div>
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors text-xl leading-tight">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 pt-2 leading-tight">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="flex flex-wrap gap-2">
                      {post.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      asChild
                      variant="ghost"
                      className="w-full gap-2 group-hover:gap-3 transition-all"
                    >
                      <Link href={`/blog/${post.slug}`}>
                        Read More <ArrowRight size={16} />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
