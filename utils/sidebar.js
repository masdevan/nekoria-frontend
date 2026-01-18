import { HomeIcon, BookmarkIcon, MagnifyingGlassIcon, ArrowPathIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline"

export const sidebarMenu = [
  {
    icon: HomeIcon,
    href: "/",
    label: "Home",
    type: "link",
  },
  {
    icon: BookmarkIcon,
    href: "/bookmark",
    label: "Bookmark",
    type: "link",
  },
  {
    icon: MagnifyingGlassIcon,
    label: "Search",
    type: "modal",
  },
  {
    icon: ArrowPathIcon,
    label: "Random",
    type: "action",
    action: "random-anime",
  },
  {
    icon: QuestionMarkCircleIcon,
    href: "/help",
    label: "Help",
    type: "link",
  },
]
