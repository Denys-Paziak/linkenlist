"use client";

import MDEditor from "@uiw/react-md-editor";
import "./markdown-section.css";
import { Children, isValidElement } from "react";
import { MD_ICONS } from "./insert-icon-command";

export function MarkdownSection({ content }: { content: string }) {
  return (
    <section className="markdown-section bg-white rounded-lg shadow-sm border border-border p-8 scroll-mt-24">
      <MDEditor.Markdown
        source={content}
        components={{
          strong: ({ node, ...rest }) => (
            <strong {...rest} style={{ fontWeight: 700 }} />
          ),
          ol: ({ children, node, ...props }) => (
            <ol
              {...props}
              className="space-y-4 step-list"
              style={{ paddingLeft: 0 }}
            >
              {Children.map(children, (child, index) => {
                if (!isValidElement(child)) return null;

                return (
                  <li key={index} className="step-list-item">
                    <span>{child.props.children}</span>
                  </li>
                );
              })}
            </ol>
          ),
          ul: ({ children, node, ...props }) => (
            <ul {...props} className="space-y-3" style={{ paddingLeft: 0 }}>
              {Children.map(children, (child, index) => {
                if (!isValidElement(child)) return null;

                return (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-muted-foreground"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>

                    <span className="leading-relaxed">
                      {child.props.children}
                    </span>
                  </li>
                );
              })}
            </ul>
          ),
          code :({ children, ...props }) => {
            const text = String(children).trim();

            if (text.startsWith("icon:")) {
              const key = text.slice("icon:".length);
              const Icon = MD_ICONS[key];

              if (Icon) {
                return (
                  <Icon
                    className="h-5 w-5 inline-block align-text-bottom"
                    aria-hidden="true"
                  />
                );
              }
            }

            return <code {...props}>{children}</code>;
          },
          hr: ({node, ...props}) => {
            return <div {...props} style={{marginTop: "1.5rem", paddingTop: "1.5rem", borderTopWidth: "1px", borderColor: "hsl(var(--border))"}} />
          }
        }}
      />
    </section>
  );
}
