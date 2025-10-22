import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { cn } from "@orderly.network/ui";

interface MenuItem {
  name: string;
  href: string;
}

interface MoreDropdownProps {
  items: MenuItem[];
}

export function MoreDropdown({ items }: MoreDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Check if any of the dropdown items is currently active
  const isActive = items.some(item => {
    if (item.href === "/") return location.pathname === "/";
    return location.pathname.startsWith(item.href);
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  return (
    <div className="oui-relative" ref={dropdownRef} style={{ zIndex: 100 }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "oui-flex oui-items-center oui-gap-1 oui-px-3 oui-py-2 oui-rounded-lg",
          "oui-text-sm oui-font-semibold oui-transition-colors",
          "hover:oui-bg-base-6",
          isActive
            ? "oui-text-base-contrast-80 oui-bg-base-6"
            : "oui-text-base-contrast-54"
        )}
      >
        More
        <ChevronDown
          className={cn(
            "oui-w-4 oui-h-4 oui-transition-transform",
            isOpen && "oui-rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div 
          className="oui-absolute oui-top-full oui-left-0 oui-mt-2 oui-min-w-[160px] oui-bg-base-8 oui-border oui-border-line-12 oui-rounded-lg oui-shadow-2xl oui-py-2"
          style={{ zIndex: 9999 }}
        >
          {items.map((item) => {
            const itemIsActive = item.href === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "oui-block oui-px-4 oui-py-2 oui-text-sm oui-font-medium",
                  "hover:oui-bg-base-7 oui-transition-colors oui-no-underline",
                  itemIsActive
                    ? "oui-text-base-contrast-80 oui-bg-base-7"
                    : "oui-text-base-contrast-54"
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

