// components/MarkdownRenderer.tsx
"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="md-body text-gray-800 dark:text-gray-200">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          ul: ({node, ...props}) => (
            <ul className="list-disc list-outside pl-6 my-3 space-y-1" {...props} />
          ),
          ol: ({node, ...props}) => (
            <ol className="list-decimal list-outside pl-6 my-3 space-y-1" {...props} />
          ),
          li: ({node, ...props}) => (
            <li className="[&>p]:m-0" {...props} />
          ),
          p: ({node, ...props}) => (
            <p className="my-3" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}