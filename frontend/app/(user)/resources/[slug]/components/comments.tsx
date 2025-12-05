"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../../../components/ui/dialog";
import { Mail, Phone, ThumbsDown, ThumbsUp } from "lucide-react";
import { Button } from "../../../../../components/ui/button";

// Mock comments data for the comments section
const mockComments = [
  {
    id: 1,
    author: "John Smith",
    content:
      "This Adobe discount saved me hundreds! Perfect for my photography side business.",
    timestamp: "2 hours ago",
    likes: 12,
    avatar: "/placeholder.svg?height=40&width=40&text=JS",
  },
  {
    id: 2,
    author: "Sarah Johnson",
    content:
      "Verification process was quick and easy. Highly recommend this deal to all military families.",
    timestamp: "5 hours ago",
    likes: 8,
    avatar: "/placeholder.svg?height=40&width=40&text=SJ",
  },
  {
    id: 3,
    author: "Mike Rodriguez",
    content:
      "Been using this for 6 months now. The creative tools are incredible and the military pricing makes it affordable.",
    timestamp: "1 day ago",
    likes: 15,
    avatar: "/placeholder.svg?height=40&width=40&text=MR",
  },
  {
    id: 4,
    author: "Lisa Chen",
    content:
      "Great deal! The verification through ID.me was straightforward and I was approved within 24 hours.",
    timestamp: "2 days ago",
    likes: 6,
    avatar: "/placeholder.svg?height=40&width=40&text=LC",
  },
  {
    id: 5,
    author: "David Wilson",
    content:
      "This discount is a game-changer for military creatives. All the professional tools you need at an unbeatable price.",
    timestamp: "3 days ago",
    likes: 9,
    avatar: "/placeholder.svg?height=40&width=40&text=DW",
  },
];

// Mock user profile data for the profile modal
const mockUserProfiles: Record<string, any> = {
  "John Smith": {
    name: "John Smith",
    initials: "JS",
    role: "Military Veteran",
    phone: "(555) 123-4567",
    email: "john.smith@email.com",
    companyName: "Smith Photography LLC",
    memberSince: "January 2022 (2 years, 8 months)",
    listings: { forSale: 0, forRent: 0 },
    professionalTitle: "Real Estate Agent",
  },
  "Sarah Johnson": {
    name: "Sarah Johnson",
    initials: "SJ",
    role: "Active Duty Military",
    phone: "(555) 987-6543",
    email: "sarah.johnson@mil.gov",
    companyName: "Johnson Consulting",
    memberSince: "March 2021 (3 years, 6 months)",
    listings: { forSale: 2, forRent: 1 },
    professionalTitle: "Real Estate Agent",
  },
  "Mike Rodriguez": {
    name: "Mike Rodriguez",
    initials: "MR",
    role: "Military Spouse",
    phone: "(555) 456-7890",
    email: "mike.rodriguez@email.com",
    companyName: "Rodriguez Creative Studio",
    memberSince: "June 2020 (4 years, 3 months)",
    listings: { forSale: 5, forRent: 3 },
    professionalTitle: "Real Estate Agent",
  },
  "Lisa Chen": {
    name: "Lisa Chen",
    initials: "LC",
    role: "Veteran",
    phone: "(555) 321-0987",
    email: "lisa.chen@email.com",
    companyName: "Chen Design Co.",
    memberSince: "September 2023 (1 year)",
    listings: { forSale: 1, forRent: 0 },
    professionalTitle: "Real Estate Agent",
  },
  "David Wilson": {
    name: "David Wilson",
    initials: "DW",
    role: "Military Retiree",
    phone: "(555) 654-3210",
    email: "david.wilson@email.com",
    companyName: "Wilson Media Group",
    memberSince: "December 2019 (4 years, 9 months)",
    listings: { forSale: 8, forRent: 4 },
    professionalTitle: "Real Estate Agent",
  },
};

export function Comments() {
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showAllComments, setShowAllComments] = useState(false);
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [likedComments, setLikedComments] = useState<Set<number>>(new Set());
  const [dislikedComments, setDislikedComments] = useState<Set<number>>(
    new Set()
  );
  const [editText, setEditText] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  const handleUserProfileClick = (userName: string) => {
    const userProfile = mockUserProfiles[userName];
    if (userProfile) {
      setSelectedUser(userProfile);
      setShowUserProfile(true);
    }
  };

  const visibleComments = showAllComments
    ? mockComments
    : mockComments.slice(0, 3);

  const handleLike = (commentId: number) => {
    setLikedComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
        setDislikedComments((prevDislikes) => {
          const newDislikes = new Set(prevDislikes);
          newDislikes.delete(commentId);
          return newDislikes;
        });
      }
      return newSet;
    });
  };

  const handleDislike = (commentId: number) => {
    setDislikedComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
        setLikedComments((prevLikes) => {
          const newLikes = new Set(prevLikes);
          newLikes.delete(commentId);
          return newLikes;
        });
      }
      return newSet;
    });
  };

  const handleEdit = (commentId: number, currentText: string) => {
    setEditingComment(commentId);
    setEditText(currentText);
  };

  const saveEdit = (commentId: number) => {
    setEditingComment(null);
    setEditText("");
  };

  const cancelEdit = () => {
    setEditingComment(null);
    setEditText("");
  };

  const handleReply = (commentId: number) => {
    setReplyingTo(replyingTo === commentId ? null : commentId);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-border p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-foreground text-lg">
            Comments ({mockComments.length})
          </h3>
        </div>

        <div className="mb-8 pb-6 border-b border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-4">Leave a comment</h4>
          <div className="space-y-4">
            <div>
              <textarea
                id="comment-text"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Share your thoughts about this deal..."
              />
            </div>
            <div className="flex items-center gap-3">
              <Button className="bg-[#003366] hover:bg-[#003366]/90 text-white">
                Post Comment
              </Button>
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:border-gray-600 hover:bg-gray-100 hover:text-gray-900 bg-transparent"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-6 relative">
          {visibleComments.map((comment, index) => (
            <div key={comment.id} className="flex gap-4">
              <button
                onClick={() => handleUserProfileClick(comment.author)}
                className="flex-shrink-0 hover:opacity-80 transition-opacity"
              >
                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-white font-semibold cursor-pointer">
                  {comment.author
                    .split(" ")
                    .map((name) => name[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900 text-sm">
                    @{comment.author.toLowerCase().replace(/\s+/g, "")}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {comment.timestamp}
                  </span>
                </div>

                {editingComment === comment.id ? (
                  <div className="mb-2">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                      rows={3}
                    />
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        size="sm"
                        onClick={() => saveEdit(comment.id)}
                        className="bg-[#003366] hover:bg-[#003366]/90 text-white text-xs px-3 py-1"
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={cancelEdit}
                        className="text-xs px-3 py-1 bg-transparent"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">
                    {comment.content}
                  </p>
                )}

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleLike(comment.id)}
                    className={`flex items-center gap-1 text-xs transition-all duration-200 px-2 py-1 rounded-md ${
                      likedComments.has(comment.id)
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    <ThumbsUp
                      className={`h-3 w-3 ${
                        likedComments.has(comment.id) ? "fill-current" : ""
                      }`}
                    />
                    <span>
                      {comment.likes + (likedComments.has(comment.id) ? 1 : 0)}
                    </span>
                  </button>

                  <button
                    onClick={() => handleDislike(comment.id)}
                    className={`flex items-center gap-1 text-xs transition-all duration-200 px-2 py-1 rounded-md ${
                      dislikedComments.has(comment.id)
                        ? "text-red-600 bg-red-50"
                        : "text-gray-500 hover:text-red-600 hover:bg-red-50"
                    }`}
                  >
                    <ThumbsDown
                      className={`h-3 w-3 ${
                        dislikedComments.has(comment.id) ? "fill-current" : ""
                      }`}
                    />
                  </button>

                  <button
                    onClick={() => handleReply(comment.id)}
                    className="text-gray-500 hover:text-white hover:bg-gray-700 text-xs transition-all duration-200 px-2 py-1 rounded-md"
                  >
                    Reply
                  </button>

                  {comment.author === "You" &&
                    editingComment !== comment.id && (
                      <button
                        onClick={() => handleEdit(comment.id, comment.content)}
                        className="text-gray-500 hover:text-white hover:bg-gray-700 text-xs transition-all duration-200 px-2 py-1 rounded-md"
                      >
                        Edit
                      </button>
                    )}
                </div>

                {replyingTo === comment.id && (
                  <div className="mt-4 pl-4 border-l-2 border-gray-200">
                    <textarea
                      placeholder="Write a reply..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                      rows={2}
                    />
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        size="sm"
                        className="bg-[#003366] hover:bg-[#003366]/90 text-white text-xs px-3 py-1"
                      >
                        Reply
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setReplyingTo(null)}
                        className="text-xs px-3 py-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Fading Effect */}
          {!showAllComments && mockComments.length > 3 && (
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none" />
          )}
        </div>

        {/* Show More/Less Buttons */}
        {!showAllComments && mockComments.length > 3 && (
          <div className="text-center mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setShowAllComments(true);
                setShowCommentForm(true);
              }}
              className="border-gray-300 text-gray-700 hover:border-gray-600 hover:bg-gray-100 hover:text-gray-900 bg-transparent"
            >
              Show more comments ({mockComments.length - 3} more)
            </Button>
          </div>
        )}

        {showAllComments && mockComments.length > 3 && (
          <div className="text-center mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setShowAllComments(false);
                setShowCommentForm(false);
              }}
              className="border-gray-300 text-gray-700 hover:border-gray-600 hover:bg-gray-100 hover:text-gray-900 bg-transparent"
            >
              Show less
            </Button>
          </div>
        )}
      </div>

      <Dialog open={showUserProfile} onOpenChange={setShowUserProfile}>
        <DialogContent className="w-[95vw] max-w-sm sm:max-w-md bg-white rounded-xl border border-primary/30">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-bold text-[#222222] flex items-center justify-between">
              Agent Profile
            </DialogTitle>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4 sm:space-y-6 pt-2">
              {/* Profile Header */}
              <div className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <span className="text-white text-xl sm:text-2xl font-bold">
                    {selectedUser.initials}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#222222] mb-1">
                  {selectedUser.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {selectedUser.professionalTitle}
                </p>
              </div>

              {/* Contact Information */}
              <div>
                <h4 className="font-semibold text-[#222222] mb-2 sm:mb-3 text-sm sm:text-base">
                  Contact Information
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[#222222]/70 text-sm">
                    <Phone className="h-4 w-4" />
                    <span>{selectedUser.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#222222]/70 text-sm">
                    <Mail className="h-4 w-4" />
                    <span>{selectedUser.email}</span>
                  </div>
                </div>
              </div>

              {/* Company Name */}
              <div>
                <h4 className="font-semibold text-[#222222] mb-2 text-sm sm:text-base">
                  Company Name
                </h4>
                <p className="text-[#222222]/70 text-sm">
                  {selectedUser.companyName}
                </p>
              </div>

              {/* LinkEnlist Experience */}
              <div>
                <h4 className="font-semibold text-[#222222] mb-2 text-sm sm:text-base">
                  LinkEnlist Experience
                </h4>
                <p className="text-[#222222]/70 text-sm">
                  Member since: {selectedUser.memberSince}
                </p>
              </div>

              {/* Property Listings */}
              <div>
                <h4 className="font-semibold text-[#222222] mb-2 sm:mb-3 text-sm sm:text-base">
                  Property Listings
                </h4>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 sm:p-4 text-center">
                    <div className="text-xl sm:text-2xl font-bold text-primary mb-1">
                      {selectedUser.listings.forSale}
                    </div>
                    <div className="text-xs sm:text-sm text-[#222222]/70">
                      For Sale
                    </div>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 text-center">
                    <div className="text-xl sm:text-2xl font-bold text-red-600 mb-1">
                      {selectedUser.listings.forRent}
                    </div>
                    <div className="text-xs sm:text-sm text-[#222222]/70">
                      For Rent
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
