import React, { useState } from 'react';
import { MessageSquare, Send, Heart, Flame } from 'lucide-react';
import { Comment } from '../types';

interface CommentsSectionProps {
  storyId: string;
  storyTitle: string;
  comments: Comment[];
  onAddComment: (storyId: string, content: string) => void;
  onLikeComment?: (commentId: string) => void;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({
  storyId,
  storyTitle,
  comments,
  onAddComment,
  onLikeComment,
}) => {
  const [commentText, setCommentText] = useState('');
  const [likedCommentIds, setLikedCommentIds] = useState<Set<string>>(new Set());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(storyId, commentText.trim());
    setCommentText('');
  };

  const handleToggleLikeComment = (id: string) => {
    setLikedCommentIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
    if (onLikeComment) {
      onLikeComment(id);
    }
  };

  return (
    <div id={`comments-section-${storyId}`} className="space-y-4 pt-2">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-red-950/40 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-950/70 border border-red-800/40 flex items-center justify-center text-red-400">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">
              همسات القراء ({comments.length.toLocaleString('ar-EG')})
            </h3>
            <span className="text-[11px] text-[#ac8884]">
              تفاعلات حية حول: {storyTitle}
            </span>
          </div>
        </div>
      </div>

      {/* Add Comment Input Form */}
      <form onSubmit={handleSubmit} className="relative flex flex-col gap-2">
        <div className="relative">
          <textarea
            id="new-comment-textarea"
            rows={2}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="اكتب همستك أو انطباعك بعد معايشة هذا الكابوس..."
            maxLength={300}
            className="w-full bg-[#18171a] border border-red-950/60 focus:border-red-600 rounded-xl p-3 text-sm text-white placeholder-[#7a6f72] focus:outline-none transition-colors resize-none leading-relaxed"
          />
          <div className="flex items-center justify-between px-1 text-[11px] text-[#8e7a78]">
            <span>احذر من إفساد المفاجأة على القراء الآخرين</span>
            <span>{commentText.length} / 300</span>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!commentText.trim()}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              commentText.trim()
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-[0_0_12px_rgba(220,38,38,0.5)] active:scale-95'
                : 'bg-[#252428] text-[#6c666a] cursor-not-allowed'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>نشر التعليق</span>
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-3 pt-1">
        {comments.length === 0 ? (
          <div className="p-6 text-center rounded-xl bg-[#18171a]/50 border border-white/5 text-xs text-[#ac8884]">
            كن أول من يترك همسة حول هذه القصة المرعبة!
          </div>
        ) : (
          comments.map((comment) => {
            const isLiked = likedCommentIds.has(comment.id);
            const currentLikes = comment.likesCount + (isLiked ? 1 : 0);

            return (
              <div
                key={comment.id}
                id={`comment-item-${comment.id}`}
                className="p-3.5 rounded-xl bg-[#19181b]/80 border border-red-950/30 hover:border-red-900/40 transition-colors flex flex-col space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-full ${comment.avatarColor || 'bg-red-900'} text-white flex items-center justify-center text-xs font-bold shadow-inner`}
                    >
                      {comment.authorName.charAt(0)}
                    </div>
                    <span className="text-xs font-semibold text-white">
                      {comment.authorName}
                    </span>
                  </div>

                  <span className="text-[10px] text-[#8e7a78] font-mono">
                    {comment.createdAt}
                  </span>
                </div>

                <p className="text-xs md:text-sm text-[#d7d0d4] leading-relaxed pr-9 select-text">
                  {comment.content}
                </p>

                {/* Comment Actions */}
                <div className="flex items-center justify-end gap-2 pr-9 pt-0.5">
                  <button
                    type="button"
                    onClick={() => handleToggleLikeComment(comment.id)}
                    className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md transition-colors ${
                      isLiked
                        ? 'text-red-400 bg-red-950/60'
                        : 'text-[#ac8884] hover:text-white bg-[#201f23]'
                    }`}
                  >
                    <Heart
                      className={`w-3 h-3 ${isLiked ? 'fill-red-500 text-red-500' : ''}`}
                    />
                    <span>{currentLikes.toLocaleString('ar-EG')}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
