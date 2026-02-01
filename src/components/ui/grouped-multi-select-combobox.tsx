"use client";

import * as React from "react";
import { Check, ChevronDown, ChevronRight, ChevronsUpDown, X } from "lucide-react";
import { cn } from "~/lib/utils";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { useCategoryIcon } from "~/lib/hooks/use-category-icon";

export interface GroupedOption {
  categoryId: number;
  categoryName: string;
  categoryIcon: string;
  items: string[];
}

interface GroupedMultiSelectComboboxProps {
  value: string[];
  onChange: (value: string[]) => void;
  groupedOptions: GroupedOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  maxDisplayedItems?: number;
}

export function GroupedMultiSelectCombobox({
  value,
  onChange,
  groupedOptions,
  placeholder = "Select items...",
  searchPlaceholder = "Search...",
  emptyMessage = "No items found.",
  className,
  maxDisplayedItems = 3,
}: GroupedMultiSelectComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [expandedCategories, setExpandedCategories] = React.useState<Set<number>>(
    new Set()
  );
  const [searchQuery, setSearchQuery] = React.useState("");
  const { getCategoryIcon } = useCategoryIcon();

  // Expand all categories by default when opening
  React.useEffect(() => {
    if (open && expandedCategories.size === 0) {
      setExpandedCategories(new Set(groupedOptions.map((g) => g.categoryId)));
    }
  }, [open, groupedOptions, expandedCategories.size]);

  const handleToggle = (item: string) => {
    if (value.includes(item)) {
      onChange(value.filter((v) => v !== item));
    } else {
      onChange([...value, item]);
    }
  };

  const handleRemove = (item: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== item));
  };

  const toggleCategory = (categoryId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  // Filter options based on search query
  const filteredGroups = React.useMemo(() => {
    if (!searchQuery.trim()) {
      return groupedOptions;
    }

    const query = searchQuery.toLowerCase();
    return groupedOptions
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => item.toLowerCase().includes(query)),
      }))
      .filter((group) => group.items.length > 0);
  }, [groupedOptions, searchQuery]);

  // Count selected items per category
  const getSelectedCountInCategory = (items: string[]) => {
    return items.filter((item) => value.includes(item)).length;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between h-auto min-h-10", className)}
        >
          <div className="flex flex-wrap gap-1 py-1">
            {value.length === 0 ? (
              <span className="text-muted-foreground font-normal">
                {placeholder}
              </span>
            ) : (
              <>
                {value.slice(0, maxDisplayedItems).map((item) => (
                  <Badge
                    key={item}
                    variant="secondary"
                    className="mr-1 mb-0 text-sm"
                  >
                    {item}
                    <button
                      className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={(e) => handleRemove(item, e)}
                    >
                      <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </button>
                  </Badge>
                ))}
                {value.length > maxDisplayedItems && (
                  <Badge variant="secondary" className="mr-1 mb-0 text-sm">
                    +{value.length - maxDisplayedItems} more
                  </Badge>
                )}
              </>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full min-w-[300px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={searchPlaceholder}
            className="focus:ring-0 focus:outline-none"
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList className="max-h-[300px]">
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            {filteredGroups.map((group) => {
              const isExpanded = expandedCategories.has(group.categoryId);
              const selectedCount = getSelectedCountInCategory(group.items);
              const IconComponent = getCategoryIcon(group.categoryIcon);

              return (
                <CommandGroup key={group.categoryId} className="p-0">
                  {/* Category header */}
                  <div
                    className="flex items-center px-2 py-2 cursor-pointer hover:bg-accent border-b border-border/50"
                    onClick={(e) => toggleCategory(group.categoryId, e)}
                  >
                    <div className="flex items-center gap-2">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                      <IconComponent className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-sm">
                        {group.categoryName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({selectedCount}/{group.items.length})
                      </span>
                    </div>
                  </div>

                  {/* Category items */}
                  {isExpanded && (
                    <div className="py-1">
                      {group.items.map((item) => (
                        <CommandItem
                          key={`${group.categoryId}-${item}`}
                          value={`${group.categoryId}-${item}`}
                          onSelect={() => handleToggle(item)}
                          className="pl-8"
                        >
                          <div
                            className={cn(
                              "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                              value.includes(item)
                                ? "bg-primary text-primary-foreground"
                                : "opacity-50 [&_svg]:invisible"
                            )}
                          >
                            <Check className="h-4 w-4" />
                          </div>
                          <span>{item}</span>
                        </CommandItem>
                      ))}
                    </div>
                  )}
                </CommandGroup>
              );
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
