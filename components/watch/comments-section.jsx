"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChatBubbleLeftEllipsisIcon, HeartIcon, EllipsisVerticalIcon } from "@heroicons/react/24/outline"
import { commentAPI } from "@/services/index"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

export function CommentsSection({ animeId, animeSlug }) {
  const router = useRouter()
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyText, setReplyText] = useState("")
  const [showReplies, setShowReplies] = useState(new Set())
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    fetchComments(1)
  }, [animeSlug])

  const fetchComments = async (pageNum) => {
    try {
      setLoading(pageNum === 1)
      const response = await commentAPI.getComments({
        anime_slug: animeSlug,
        page: pageNum,
        per_page: 10
      })

      if (response.data.success) {
        const formattedComments = response.data.data.map(comment => ({
          id: comment.id,
          user: comment.user?.name || "Anonymous",
          avatar: comment.user?.avatar_url || "/placeholder.svg",
          comment: comment.content,
          timestamp: formatTimestamp(comment.created_at),
          likes: comment.likes_count || 0,
          replies: comment.replies_count || 0,
          repliesData: comment.replies?.map(reply => ({
            id: reply.id,
            user: reply.user?.name || "Anonymous",
            avatar: reply.user?.avatar_url || "/placeholder.svg",
            comment: reply.content,
            timestamp: formatTimestamp(reply.created_at),
            likes: reply.likes_count || 0
          })) || []
        }))

        if (pageNum === 1) {
          setComments(formattedComments)
        } else {
          setComments(prev => [...prev, ...formattedComments])
        }

        setHasMore(response.data.meta.current_page < response.data.meta.last_page)
        setPage(pageNum)
      }
    } catch (error) {
      console.error("Error fetching comments:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatTimestamp = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)

    if (diffInSeconds < 60) return "just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
    return date.toLocaleDateString()
  }

  const handlePostComment = async () => {
    if (!newComment.trim()) return

    try {
      setPosting(true)
      const response = await commentAPI.createComment({
        anime_id: animeId,
        content: newComment,
        parent_id: null
      })

      if (response.data.success) {
        setNewComment("")
        fetchComments(1) // Reload comments
      }
    } catch (error) {
      console.error("Error posting comment:", error)
      if (error.response?.status === 401) {
        alert("Please login to comment")
        router.push("/login")
      } else {
        alert("Failed to post comment")
      }
    } finally {
      setPosting(false)
    }
  }

  const handleReply = async (parentId) => {
    if (!replyText.trim()) return

    try {
      const response = await commentAPI.createComment({
        anime_id: animeId,
        content: replyText,
        parent_id: parentId
      })

      if (response.data.success) {
        setReplyText("")
        setReplyingTo(null)
        fetchComments(1) // Reload comments
      }
    } catch (error) {
      console.error("Error posting reply:", error)
      if (error.response?.status === 401) {
        alert("Please login to reply")
        router.push("/login")
      } else {
        alert("Failed to post reply")
      }
    }
  }

  const toggleReplies = (commentId) => {
    setShowReplies((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(commentId)) newSet.delete(commentId)
      else newSet.add(commentId)
      return newSet
    })
  }

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      fetchComments(page + 1)
    }
  }

  if (loading && comments.length === 0) {
    return (
      <div className="border border-border !bg-[#1c1c1c] p-4 sm:p-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-border">
          <Skeleton circle width={40} height={40} baseColor="#000000" highlightColor="#111111" />
          <div>
            <Skeleton width={120} height={24} className="!rounded-none mb-1" baseColor="#000000" highlightColor="#111111" />
            <Skeleton width={80} height={16} className="!rounded-none" baseColor="#000000" highlightColor="#111111" />
          </div>
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} className="mb-6">
            <div className="flex gap-3">
              <Skeleton circle width={48} height={48} baseColor="#000000" highlightColor="#111111" />
              <div className="flex-1">
                <Skeleton width={150} height={20} className="!rounded-none mb-2" baseColor="#000000" highlightColor="#111111" />
                <Skeleton count={2} className="!rounded-none" baseColor="#000000" highlightColor="#111111" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="border border-border !bg-[#1c1c1c] p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-border">
        <div className="p-1.5 sm:p-2 bg-primary/10 rounded-full">
          <ChatBubbleLeftEllipsisIcon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-foreground">Comments</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">{comments.length} comments</p>
        </div>
      </div>

      {/* Comment Input */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="hidden xs:flex w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full items-center justify-center flex-shrink-0">
            <span className="text-primary font-semibold text-xs sm:text-sm">You</span>
          </div>
          <div className="flex-1 space-y-3">
            <textarea
              placeholder="Share your thoughts about this anime..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full min-h-[60px] sm:min-h-[80px] resize-none border border-border rounded-md focus:border-primary focus:outline-none p-2 text-sm bg-background text-foreground"
            />
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
              <p className="text-xs text-muted-foreground order-2 sm:order-1">
                Be respectful and constructive in your comments
              </p>
              <div className="flex gap-2 order-1 sm:order-2 w-full sm:w-auto">
                <button
                  onClick={() => setNewComment("")}
                  className="text-muted-foreground hover:text-foreground flex-1 sm:flex-none text-xs sm:text-sm px-3 py-1 border border-border rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePostComment}
                  disabled={!newComment.trim() || posting}
                  className="bg-primary hover:bg-primary/90 flex-1 sm:flex-none text-xs sm:text-sm px-3 py-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {posting ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4 sm:space-y-6">
        {comments.map((comment, index) => (
          <div key={comment.id} className="group">
            <div className="flex gap-3 sm:gap-4">
              <img
                src={comment.avatar}
                alt={comment.user}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0 ring-2 ring-border"
              />
              <div className="flex-1 min-w-0">
                {/* Comment Header */}
                <div className="flex items-start sm:items-center justify-between mb-2 gap-2">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 min-w-0">
                    <span className="font-semibold text-foreground text-sm truncate">{comment.user}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground hidden sm:inline">•</span>
                      <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                    </div>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 sm:h-8 sm:w-8 p-0 flex-shrink-0 hover:bg-muted/50 rounded-full flex items-center justify-center">
                    <EllipsisVerticalIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>

                {/* Comment Content */}
                <div className="bg-muted/30 p-3 sm:p-4 mb-2 sm:mb-3 rounded-lg">
                  <p className="text-sm text-foreground leading-relaxed break-words">{comment.comment}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
                  <button className="flex items-center h-auto p-1 px-2 text-xs text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all duration-200">
                    <HeartIcon className="w-4 h-4 mr-1" />
                    <span className="font-medium">{comment.likes}</span>
                  </button>
                  <button
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    className="flex items-center h-auto p-1 px-2 text-xs text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 rounded-full transition-all duration-200"
                  >
                    Reply
                  </button>
                  {comment.replies > 0 && (
                    <button
                      onClick={() => toggleReplies(comment.id)}
                      className="h-auto p-1 px-2 text-xs text-primary hover:text-primary/80 hover:bg-primary/10 font-medium rounded-full transition-all duration-200"
                    >
                      <span className="hidden sm:inline">{showReplies.has(comment.id) ? "Hide" : "View"} </span>
                      {comment.replies} {comment.replies === 1 ? "reply" : "replies"}
                    </button>
                  )}
                </div>

                {/* Reply Input */}
                {replyingTo === comment.id && (
                  <div className="mt-4 ml-0 sm:ml-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-semibold text-xs">You</span>
                      </div>
                      <div className="flex-1 space-y-2">
                        <textarea
                          placeholder={`Reply to ${comment.user}...`}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="w-full min-h-[60px] resize-none border border-border focus:border-primary focus:outline-none p-2 text-sm rounded-md bg-background text-foreground"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setReplyingTo(null)
                              setReplyText("")
                            }}
                            className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded-md border border-border"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleReply(comment.id)}
                            disabled={!replyText.trim()}
                            className="text-xs px-2 py-1 rounded-md bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Replies List */}
                {showReplies.has(comment.id) && comment.repliesData && comment.repliesData.length > 0 && (
                  <div className="mt-4 ml-0 sm:ml-8 space-y-3 border-l-2 border-muted/30 pl-4">
                    {comment.repliesData.map((reply) => (
                      <div key={reply.id} className="flex gap-3 group/reply">
                        <img
                          src={reply.avatar}
                          alt={reply.user}
                          className="w-8 h-8 rounded-full object-cover flex-shrink-0 ring-1 ring-border"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-foreground text-xs">{reply.user}</span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">{reply.timestamp}</span>
                          </div>
                          <div className="bg-muted/20 p-2 sm:p-3 rounded-lg mb-2">
                            <p className="text-xs sm:text-sm text-foreground leading-relaxed break-words">
                              {reply.comment}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <button className="flex items-center h-auto p-1 px-2 text-xs text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all duration-200">
                              <HeartIcon className="w-3 h-3 mr-1" />
                              <span className="font-medium">{reply.likes}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Divider */}
            {index < comments.length - 1 && <div className="mt-4 sm:mt-6 border-b border-border/50" />}
          </div>
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="mt-6 sm:mt-8 text-center">
          <button 
            onClick={handleLoadMore}
            disabled={loading}
            className="w-full sm:w-auto bg-transparent border border-border text-sm px-4 py-2 rounded-md hover:bg-muted/10 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load More Comments"}
          </button>
        </div>
      )}

      {comments.length === 0 && !loading && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No comments yet. Be the first to comment!</p>
        </div>
      )}
    </div>
  )
}