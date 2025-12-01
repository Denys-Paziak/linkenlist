import { commands, TextState, TextAreaTextApi } from "@uiw/react-md-editor";
import {
  ExternalLink,
  Tag,
  Users,
  Image,
  AlertCircle,
  ArrowDown,
  File,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Bookmark,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  Copy,
  Download,
  Edit,
  Eye,
  EyeOff,
  FileText,
  Folder,
  Globe,
  Heart,
  HelpCircle,
  Home,
  Info,
  Link,
  Mail,
  MapPin,
  Menu,
  Minus,
  Phone,
  Plus,
  Search,
  Settings,
  Share2,
  Star,
  Trash2,
  Upload,
  X,
} from "lucide-react";

export const MD_ICONS = {
  [ExternalLink.displayName || ""]: ExternalLink,
  [Tag.displayName || ""]: Tag,
  [Users.displayName || ""]: Users,

  [Home.displayName || ""]: Home,
  [Menu.displayName || ""]: Menu,
  [Search.displayName || ""]: Search,
  [Plus.displayName || ""]: Plus,
  [Minus.displayName || ""]: Minus,
  [X.displayName || ""]: X,
  [Check.displayName || ""]: Check,

  [Trash2.displayName || ""]: Trash2,
  [Edit.displayName || ""]: Edit,
  [Copy.displayName || ""]: Copy,
  [Bookmark.displayName || ""]: Bookmark,
  [Upload.displayName || ""]: Upload,
  [Download.displayName || ""]: Download,
  [Share2.displayName || ""]: Share2,

  [Image.displayName || ""]: Image,
  [File.displayName || ""]: File,
  [FileText.displayName || ""]: FileText,
  [Folder.displayName || ""]: Folder,
  [Link.displayName || ""]: Link,

  [Calendar.displayName || ""]: Calendar,
  [Clock.displayName || ""]: Clock,

  [Mail.displayName || ""]: Mail,
  [Phone.displayName || ""]: Phone,
  [MapPin.displayName || ""]: MapPin,

  [Eye.displayName || ""]: Eye,
  [EyeOff.displayName || ""]: EyeOff,
  [Settings.displayName || ""]: Settings,
  [AlertCircle.displayName || ""]: AlertCircle,
  [Info.displayName || ""]: Info,
  [HelpCircle.displayName || ""]: HelpCircle,

  [ChevronDown.displayName || ""]: ChevronDown,
  [ChevronUp.displayName || ""]: ChevronUp,
  [ChevronLeft.displayName || ""]: ChevronLeft,
  [ChevronRight.displayName || ""]: ChevronRight,
  [ArrowRight.displayName || ""]: ArrowRight,
  [ArrowLeft.displayName || ""]: ArrowLeft,
  [ArrowUp.displayName || ""]: ArrowUp,
  [ArrowDown.displayName || ""]: ArrowDown,

  [Globe.displayName || ""]: Globe,
  [Star.displayName || ""]: Star,
  [Heart.displayName || ""]: Heart,
};

export const insertIconCommand = commands.group([], {
  name: "insertIcon",
  groupName: "insertIcon",
  buttonProps: { title: "Insert icon", "aria-label": "Insert icon" },

  icon: <Image className="w-3 h-3" strokeWidth={3} />,

  children: ({ close, textApi }) => {
    console.log(MD_ICONS);

    return (
      <div className="rounded-md border bg-popover shadow-md p-1 flex flex-wrap gap-2 max-w-[180px] bg-white">
        {Object.values(MD_ICONS).map((Icon) => (
          <button
            key={Icon.displayName}
            type="button"
            className="flex items-center text-sm "
            onClick={() => {
              textApi?.replaceSelection(`\`icon:${Icon.displayName}\``);
              close();
            }}
          >
            <Icon className="w-5 h-5 hover:text-accent" />
          </button>
        ))}
      </div>
    );
  },

  execute: (state: TextState, api: TextAreaTextApi) => {},
});
