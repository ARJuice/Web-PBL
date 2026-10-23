'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Send,
  MoreVertical,
  ShieldAlert,
  Flag,
  Sparkles,
  Heart,
  ArrowLeft,
  Calendar,
  MessageCircleHeart,
  Users,
} from 'lucide-react';
import { Conversation, Message, User } from '@/types/match';

interface ChatViewProps {
  currentUser: User;
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Record<string, Message[]>;
  onSelectConversation: (id: string) => void;
  onSendMessage: (conversationId: string, content: string) => void;
  onOpenBlock: (targetName: string, targetUserId: string) => void;
  onOpenReport: (targetName: string, targetUserId: string) => void;
  onBackToDashboard: () => void;
  isPartnerTyping?: boolean;
}

const ICEBREAKERS = [
  '☕ Hey! Free to grab chai at the canteen this week?',
  '🎶 What kind of music is on your repeat playlist lately?',
  '🎬 Any good movie or anime recommendations?',
  '🪄 How are your semester lectures going so far?',
];

export const ChatView: React.FC<ChatViewProps> = ({
  currentUser,
  conversations,
  activeConversationId,
  messages,
  onSelectConversation,
  onSendMessage,
  onOpenBlock,
  onOpenReport,
  onBackToDashboard,
  isPartnerTyping = false,
}) => {
  const [inputText, setInputText] = useState('');
  const [safetyMenuOpen, setSafetyMenuOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const activeConv =
    conversations.find((c) => c.id === activeConversationId) ||
    conversations[0] ||
    null;

  const currentMessages = activeConv ? messages[activeConv.id] || [] : [];

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages.length, isPartnerTyping]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!activeConv || !inputText.trim()) return;

    onSendMessage(activeConv.id, inputText.trim());
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleUseIcebreaker = (icebreaker: string) => {
    setInputText(icebreaker);
  };

  if (conversations.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4 border border-rose-100">
          <MessageCircleHeart className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-stone-900 mb-2">
          No active conversations yet
        </h2>
        <p className="text-xs text-stone-500 max-w-sm mx-auto mb-6">
          Your matches and conversations will appear here once Cupid pairs you with fellow Sahrdaya students.
        </p>
        <button
          onClick={onBackToDashboard}
          className="px-6 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold shadow-sm transition-all"
        >
          Find a Match
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-6 py-4 sm:py-6 h-[calc(100vh-5rem)]">
      <div className="h-full bg-white/95 backdrop-blur-md rounded-3xl border border-rose-100 shadow-xl shadow-rose-950/5 flex overflow-hidden">
        {/* Left Sidebar: Conversation List (Section 35) */}
        <div
          className={`w-full md:w-80 border-r border-rose-100 flex flex-col shrink-0 ${
            activeConv && 'hidden md:flex'
          }`}
        >
          {/* Header */}
          <div className="p-4 border-b border-rose-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircleHeart className="w-5 h-5 text-rose-500" />
              <h3 className="font-serif text-base font-bold text-stone-900">
                Matches &amp; Chats
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
              {conversations.length}
            </span>
          </div>

          {/* List items */}
          <div className="flex-1 overflow-y-auto divide-y divide-rose-50/80">
            {conversations.map((conv) => {
              const isSelected = activeConv?.id === conv.id;
              const other = conv.otherUser;

              return (
                <button
                  key={conv.id}
                  onClick={() => onSelectConversation(conv.id)}
                  className={`w-full p-3.5 text-left flex items-center gap-3 transition-colors ${
                    isSelected
                      ? 'bg-rose-50/80 border-l-4 border-l-rose-500'
                      : 'hover:bg-rose-50/40'
                  }`}
                >
                  <div className="relative shrink-0">
                    {other.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={other.avatarUrl}
                        alt={other.displayName}
                        className="w-11 h-11 rounded-full object-cover ring-2 ring-rose-200"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-rose-200 text-rose-700 flex items-center justify-center font-bold text-sm">
                        {other.displayName.charAt(0)}
                      </div>
                    )}
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                        {other.displayName}
                      </span>
                      <span className="text-[10px] text-stone-400 shrink-0">
                        {conv.lastMessage?.createdAt
                          ? new Date(conv.lastMessage.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : ''}
                      </span>
                    </div>

                    <p className="text-[11px] text-stone-500 truncate mt-0.5">
                      {conv.lastMessage?.content || 'Say hello...'}
                    </p>

                    <div className="text-[10px] text-rose-600/90 mt-0.5 font-medium">
                      Year {other.year} · {other.sharedInterests.slice(0, 2).join(', ')}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Main Panel: Active Conversation Window (Section 34) */}
        {activeConv ? (
          <div className="flex-1 flex flex-col h-full bg-[#fffafb] min-w-0">
            {/* Conversation Header */}
            <div className="px-4 py-3 bg-white border-b border-rose-100 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={onBackToDashboard}
                  className="md:hidden p-1.5 rounded-lg text-stone-500 hover:bg-stone-100"
                  aria-label="Back to conversations"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>

                {activeConv.otherUser.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={activeConv.otherUser.avatarUrl}
                    alt={activeConv.otherUser.displayName}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-200 shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-rose-200 text-rose-700 flex items-center justify-center font-bold text-sm shrink-0">
                    {activeConv.otherUser.displayName.charAt(0)}
                  </div>
                )}

                <div className="min-w-0">
                  <h4 className="font-serif text-sm sm:text-base font-bold text-stone-900 truncate">
                    {activeConv.otherUser.displayName}
                  </h4>
                  <p className="text-[11px] text-stone-500 flex items-center gap-1.5 truncate">
                    <span>Year {activeConv.otherUser.year}</span>
                    <span>·</span>
                    <span className="text-rose-600 font-medium">
                      {activeConv.otherUser.sharedInterests.length} shared interest
                      {activeConv.otherUser.sharedInterests.length === 1 ? '' : 's'}
                    </span>
                  </p>
                </div>
              </div>

              {/* Safety Menu (Section 36 & 37) */}
              <div className="relative shrink-0">
                <button
                  id="safety-menu-trigger-btn"
                  onClick={() => setSafetyMenuOpen(!safetyMenuOpen)}
                  className="p-2 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors"
                  aria-label="Safety menu"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                <AnimatePresence>
                  {safetyMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 top-full mt-1 w-44 bg-white rounded-2xl shadow-xl border border-rose-100 p-1.5 z-30"
                    >
                      <button
                        onClick={() => {
                          setSafetyMenuOpen(false);
                          onOpenReport(
                            activeConv.otherUser.displayName,
                            activeConv.otherUser.id
                          );
                        }}
                        className="w-full px-3 py-2 rounded-xl text-xs font-medium text-stone-700 hover:bg-stone-50 flex items-center gap-2 text-left"
                      >
                        <Flag className="w-3.5 h-3.5 text-amber-500" />
                        <span>Report user</span>
                      </button>
                      <button
                        onClick={() => {
                          setSafetyMenuOpen(false);
                          onOpenBlock(
                            activeConv.otherUser.displayName,
                            activeConv.otherUser.id
                          );
                        }}
                        className="w-full px-3 py-2 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 text-left"
                      >
                        <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                        <span>Block user</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
              {/* Cupid Introduction Pill */}
              <div className="my-2 text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100/70 text-rose-700 text-[11px] font-semibold">
                  <Sparkles className="w-3 h-3" />
                  <span>Confidential Valentine Match Channel · Sahrdaya Campus</span>
                </div>
              </div>

              {currentMessages.map((msg) => {
                const isMine = msg.senderId === currentUser.id;
                const isSystem = msg.senderId === 'system';

                if (isSystem) {
                  return (
                    <div key={msg.id} className="text-center my-3">
                      <span className="inline-block px-3 py-1 rounded-xl bg-white text-stone-500 border border-rose-100 text-[11px] italic shadow-xs">
                        {msg.content}
                      </span>
                    </div>
                  );
                }

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[80%] sm:max-w-md px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                        isMine
                          ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-br-xs'
                          : 'bg-white text-stone-800 border border-rose-100/90 rounded-bl-xs'
                      }`}
                    >
                      {msg.content}
                    </div>
                    <span className="text-[9px] text-stone-400 mt-1 px-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isPartnerTyping && (
                <div className="flex items-center gap-1.5 text-stone-400 text-xs py-1 px-2">
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[11px] text-stone-400 ml-1">
                    {activeConv.otherUser.displayName} is typing...
                  </span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Icebreaker Suggestions (Section 34) */}
            <div className="px-4 py-2 bg-white/60 border-t border-rose-100/60 overflow-x-auto flex gap-2 shrink-0">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider self-center shrink-0">
                Icebreakers:
              </span>
              {ICEBREAKERS.map((ice, idx) => (
                <button
                  key={idx}
                  onClick={() => handleUseIcebreaker(ice)}
                  className="px-2.5 py-1 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-800 text-[11px] font-medium border border-rose-200/60 whitespace-nowrap transition-colors"
                >
                  {ice}
                </button>
              ))}
            </div>

            {/* Message Composer (Section 34) */}
            <form
              onSubmit={handleSend}
              className="p-3 sm:p-4 bg-white border-t border-rose-100 flex items-center gap-2.5 shrink-0"
            >
              <textarea
                id="chat-message-input"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder={`Message ${activeConv.otherUser.displayName}... (Press Enter to send)`}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-stone-50 border border-rose-200/70 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:bg-white resize-none"
              />

              <button
                id="chat-send-btn"
                type="submit"
                disabled={!inputText.trim()}
                className="w-10 h-10 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white flex items-center justify-center shadow-md shadow-rose-500/20 disabled:opacity-40 disabled:pointer-events-none transition-all"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-stone-400 text-xs">
            Select a match to start chatting
          </div>
        )}
      </div>
    </div>
  );
};
