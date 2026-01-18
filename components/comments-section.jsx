"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline"
import { commentAPI, authAPI } from "@/services/index"

export function CommentsSection({ animeSlug, episodeId = null }) {
  const router = useRouter()
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyText, setReplyText] = useState("")
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [posting, setPosting] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    fetchCurrentUser()
    fetchComments(1)
  }, [animeSlug, episodeId])

  const fetchCurrentUser = async () => {
    try {
      const response = await authAPI.me()
      if (response.data.success) {
        setCurrentUser(response.data.data)
      }
    } catch (e) {
      console.error("Failed to fetch user", e)
    }
  }

  const fetchComments = async (pageNum) => {
    try {
      if (pageNum === 1) setLoading(true)

      const response = await commentAPI.getComment({
        slug: animeSlug,
        episode_id: episodeId,
        page: pageNum,
        per_page: 10
      })

      if (response.data.success) {
        const formatted = formatComments(response.data.data)
        setComments(pageNum === 1 ? formatted : [...comments, ...formatted])
        setHasMore(response.data.meta.current_page < response.data.meta.last_page)
        setPage(pageNum)
      }
    } catch (e) {
      console.error("Fetch comments error", e)
    } finally {
      setLoading(false)
    }
  }

  const formatComments = (data) => {
    const parentComments = data.filter(c => c.parent_id === null)
    const allReplies = data.filter(c => c.parent_id !== null)
    
    const buildRepliesTree = (parentId, level = 0) => {
      return allReplies
        .filter(r => r.parent_id === parentId)
        .map(r => ({
          ...r,
          user: r.user?.username || "Anonymous",
          timestamp: formatTimestamp(r.created_at),
          level: level,
          replies: buildRepliesTree(r.id, level + 1)
        }))
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    }
    
    return parentComments.map(c => ({
      ...c,
      user: c.user?.username || "Anonymous",
      timestamp: formatTimestamp(c.created_at),
      level: 0,
      replies: buildRepliesTree(c.id, 1)
    })).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  }

  const flattenReplies = (replies) => {
    let result = []
    replies.forEach(reply => {
      result.push(reply)
      if (reply.replies && reply.replies.length > 0) {
        result = result.concat(flattenReplies(reply.replies))
      }
    })
    return result
  }

  const formatTimestamp = (dateStr) => {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000)
    if (diff < 60) return "just now"
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
    return new Date(dateStr).toLocaleDateString()
  }

  const handleAuthError = () => {
    alert("Please login to comment")
    router.push("/login")
  }

  const postComment = async () => {
    if (!newComment.trim() || posting) return
    
    if (!currentUser) {
      handleAuthError()
      return
    }
    
    setPosting(true)
    try {
      const response = await commentAPI.createComment({
        slug: animeSlug,
        episode_id: episodeId,
        content: newComment,
        parent_id: null
      })

      if (response.data?.data) {
        const comment = {
          ...response.data.data,
          user: currentUser.username,
          timestamp: "just now",
          level: 0,
          replies: []
        }
        
        setComments(prev => [comment, ...prev])
        setNewComment("")
      }
    } catch (e) {
      console.error("Post comment error", e)
      if (e.response?.status === 401) handleAuthError()
    } finally {
      setPosting(false)
    }
  }

  const postReply = async (parentId) => {
    if (!replyText.trim()) return
    
    if (!currentUser) {
      handleAuthError()
      return
    }
    
    try {
      const response = await commentAPI.createComment({
        slug: animeSlug,
        episode_id: episodeId,
        content: replyText,
        parent_id: parentId
      })

      if (response.data?.data) {
        const reply = {
          ...response.data.data,
          user: currentUser.username,
          timestamp: "just now",
          level: 1,
          replies: []
        }

        setComments(prev =>
          prev.map(c => {
            if (c.id === parentId) {
              return { ...c, replies: [...c.replies, reply] }
            }
            const addReplyToNested = (items) => {
              return items.map(item => {
                if (item.id === parentId) {
                  return { ...item, replies: [...item.replies, { ...reply, level: item.level + 1 }] }
                }
                if (item.replies && item.replies.length > 0) {
                  return { ...item, replies: addReplyToNested(item.replies) }
                }
                return item
              })
            }
            return { ...c, replies: addReplyToNested(c.replies) }
          })
        )
        setReplyText("")
        setReplyingTo(null)
      }
    } catch (e) {
      console.error("Reply error", e)
      if (e.response?.status === 401) handleAuthError()
    }
  }

  const Comment = ({ comment }) => {
    const allReplies = flattenReplies(comment.replies || [])
    
    return (
      <div className="border-b-2 border-primary/30 mb-4 pb-4 last:border-b-0">
        <div className="flex flex-col gap-0">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold text-sm">{comment.user}</span>
              <span className="text-xs text-gray-400">{comment.timestamp}</span>
            </div>
          </div>
          
          <p className="text-white text-sm leading-relaxed">{comment.content}</p>
          
          <div className="flex gap-3 text-xs text-gray-400">
            <button 
              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)} 
              className="hover:text-primary transition cursor-pointer"
            >
              Reply
            </button>
            {allReplies.length > 0 && (
              <span className="text-gray-500">
                {allReplies.length} {allReplies.length === 1 ? 'reply' : 'replies'}
              </span>
            )}
          </div>

          {replyingTo === comment.id && (
            <div className="mt-2 flex flex-col gap-2 bg-background/50 p-3 border border-border">
              <textarea
                placeholder={`Reply to ${comment.user}...`}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full p-2 text-sm bg-background text-white border border-border resize-none focus:outline-none focus:border-primary"
                rows={2}
                autoFocus
              />
              <div className="flex gap-2 self-end">
                <button 
                  onClick={() => { setReplyingTo(null); setReplyText("") }} 
                  className="px-3 py-1.5 text-xs border border-border text-gray-400 hover:bg-border/20 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => postReply(comment.id)} 
                  disabled={!replyText.trim()} 
                  className="px-3 py-1.5 bg-primary text-white text-xs disabled:opacity-50 hover:bg-primary/90 transition cursor-pointer"
                >
                  Reply
                </button>
              </div>
            </div>
          )}

          {allReplies.length > 0 && (
            <div className="mt-3 space-y-3 pl-4 border-l-2 border-primary/30">
              {allReplies.map(reply => (
                <div key={reply.id} className="flex flex-col gap-0">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span className="text-white text-xs font-semibold">{reply.user}</span>
                      <span className="text-xs text-gray-400">{reply.timestamp}</span>
                    </div>
                  </div>
                  
                  <p className="text-white text-xs leading-relaxed">{reply.content}</p>
                  
                  <div className="flex gap-3 text-xs text-gray-400">
                    <button 
                      onClick={() => setReplyingTo(replyingTo === reply.id ? null : reply.id)} 
                      className="hover:text-primary transition cursor-pointer"
                    >
                      Reply
                    </button>
                  </div>

                  {replyingTo === reply.id && (
                    <div className="mt-2 flex flex-col gap-2 bg-background/50 p-3 border border-border">
                      <textarea
                        placeholder={`Reply to ${reply.user}...`}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="w-full p-2 text-sm bg-background text-white border border-border resize-none focus:outline-none focus:border-primary"
                        rows={2}
                        autoFocus
                      />
                      <div className="flex gap-2 self-end">
                        <button 
                          onClick={() => { setReplyingTo(null); setReplyText("") }} 
                          className="px-3 py-1.5 text-xs border border-border text-gray-400 hover:bg-border/20 transition cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => postReply(reply.id)} 
                          disabled={!replyText.trim()} 
                          className="px-3 py-1.5 bg-primary text-white text-xs disabled:opacity-50 hover:bg-primary/90 transition cursor-pointer"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#1c1c1c] p-4 border border-border">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
        <ChatBubbleLeftEllipsisIcon className="w-5 h-5 text-primary" />
        <h2 className="text-white font-bold">Comments ({comments.length})</h2>
      </div>

      <div className="mb-6 flex flex-col gap-2">
        <textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full p-3 text-sm bg-background text-white border border-border resize-none focus:outline-none focus:border-primary"
          rows={3}
        />
        <button
          onClick={postComment}
          disabled={!newComment.trim() || posting}
          className="self-end px-4 py-2 bg-primary text-white text-xs w-full disabled:opacity-50 hover:bg-primary/90 transition cursor-pointer"
        >
          {posting ? "Posting..." : "Post Comment"}
        </button>
      </div>

      {loading && <p className="text-gray-400 text-sm">Loading comments...</p>}
      
      {!loading && comments.length === 0 && (
        <p className="text-gray-400 text-sm text-center py-8">
          No comments yet. Be the first to comment!
        </p>
      )}

      <div className="space-y-0">
        {comments.map(comment => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-6 text-center pt-4 border-t border-border">
          <button
            onClick={() => fetchComments(page + 1)}
            className="px-5 py-2 text-sm border border-border text-white hover:bg-border/20 transition cursor-pointer"
          >
            Load More Comments
          </button>
        </div>
      )}
    </div>
  )
}