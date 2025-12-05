"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IResource } from "../../../../../types/Resource";

export function Navigate({ data }: { data: IResource }) {
  const router = useRouter();

  const [tocCollapsed, setTocCollapsed] = useState(true);

  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 shadow-sm p-4 mb-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-800 text-sm">Contents</h3>
        <button
          onClick={() => setTocCollapsed(!tocCollapsed)}
          className="p-1 hover:bg-gray-200 rounded transition-colors"
        >
          <ChevronDown
            className={`h-4 w-4 text-gray-600 transition-transform ${
              tocCollapsed ? "" : "rotate-180"
            }`}
          />
        </button>
      </div>
      {!tocCollapsed && (
        <nav className="space-y-2 mt-3">
          {data.sections.map((item) => {
            const id = item.title.replaceAll(" ", "_").toLocaleLowerCase() + "_" + item.id

            return (
            <Link
              href={"#" + id}
              scroll={false}
              onClick={(e) => {
                e.preventDefault();

                router.push(`#${id}`, {
                  scroll: false
                });

                const el = document.getElementById(id);
                el?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="group flex items-start gap-2 w-full text-left py-2 px-2 rounded transition-all duration-200 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            >
              <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2 transition-all duration-200 bg-gray-300 group-hover:bg-gray-400"></div>
              <span className="leading-relaxed break-words">{item.title}</span>
            </Link>
          )
          })}
        </nav>
      )}
    </div>
  );
}
