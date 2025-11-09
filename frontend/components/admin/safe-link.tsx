"use client";

import React, { forwardRef } from "react";
import Link, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { useAdminContext } from "@/contexts/admin-context";

type AnchorProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick">

interface SafeLinkProps extends LinkProps, AnchorProps {
  confirmMessage?: string;
}

export const SafeLink = forwardRef<HTMLAnchorElement, SafeLinkProps>(
  (
    {
      href,
      onClick,
      confirmMessage = "You have unsaved changes that will be lost. Continue?",
      children,
      ...rest
    },
    ref
  ) => {
    const pathname = usePathname();
    const {
      hasUnsavedChanges,
      setShowModalUnsavedChanges,
    } = useAdminContext();

    const isModifiedClick = (e: React.MouseEvent<HTMLAnchorElement>) =>
      e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1;

    const isSamePath = () => {
      if (typeof href !== "string") return false;
      return pathname === href || pathname + "/" === href;
    };

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      onClick?.(e);
      if (e.defaultPrevented) return;

      if (rest.target === "_blank" || isModifiedClick(e)) return;

      if (isSamePath()) return;

      if (hasUnsavedChanges) {
        setShowModalUnsavedChanges(true)
      }
    };

    return (
      <Link ref={ref} href={href} {...rest} onClick={handleClick}>
        {children}
      </Link>
    );
  }
);

SafeLink.displayName = "SafeLink";
