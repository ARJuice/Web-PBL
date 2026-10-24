'use client';

import React, { useState, useCallback } from 'react';
import { Navbar } from '@/components/Navbar';
import { LandingView } from '@/components/LandingView';
import { LoginModal } from '@/components/LoginModal';
import { OnboardingView } from '@/components/OnboardingView';
import { DashboardView } from '@/components/DashboardView';
import { MatchingScreen } from '@/components/MatchingScreen';
import { MatchResultModal } from '@/components/MatchResultModal';
import { ChatView } from '@/components/ChatView';
import { EditInterestsModal } from '@/components/EditInterestsModal';
import { SettingsModal } from '@/components/SettingsModal';
import { BlockDialog, ReportDialog } from '@/components/SafetyModals';
import { ToastContainer, ToastMessage } from '@/components/Toast';

import {
  AffiliateProduct,
  Conversation,
  Interest,
  Match,
  MatchMode,
  Message,
  ReportReason,
  User,
  UserProfile,
} from '@/types/match';

import {
  getCurrentUser,
  getStoredMatches,
  getStoredConversations,
  getStoredMessages,
  loginWithEmail,
  upsertProfile,
  executeMatchmaking,
  sendMessage,
  triggerSimulatedMatchReply,
  blockUser,
  reportUser,
  setCurrentUserId,
} from '@/lib/storage';

export default function HomePage() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    return getCurrentUser();
  });

  const [activeView, setActiveView] = useState<
    'landing' | 'onboarding' | 'dashboard' | 'matching' | 'chat'
  >(() => {
    const user = getCurrentUser();
    if (!user) return 'landing';
    return user.profileCompleted ? 'dashboard' : 'onboarding';
  });

  // App Data State
  const [matches, setMatches] = useState<Match[]>(() => getStoredMatches());
  const [conversations, setConversations] = useState<Conversation[]>(() => getStoredConversations());
  const [messages, setMessages] = useState<Record<string, Message[]>>(() => getStoredMessages());
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);

  // Matchmaking State
  const [currentFoundMatch, setCurrentFoundMatch] = useState<Match | null>(null);
  const [isMatchResultOpen, setIsMatchResultOpen] = useState(false);

  // Modal States
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [editInterestsModalOpen, setEditInterestsModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  // Safety Modals
  const [blockTarget, setBlockTarget] = useState<{ id: string; name: string } | null>(null);
  const [reportTarget, setReportTarget] = useState<{ id: string; name: string } | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastMessage['type'], message: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Login handler
  const handleLogin = (email: string) => {
    const user = loginWithEmail(email);
    setCurrentUser(user);
    setLoginModalOpen(false);

    // Refresh state for this user
    setMatches(getStoredMatches());
    setConversations(getStoredConversations());
    setMessages(getStoredMessages());

    if (!user.profileCompleted) {
      setActiveView('onboarding');
      addToast('info', 'Welcome to MATCH@ALL Valentine Matching! Please set up your profile.');
    } else {
      setActiveView('dashboard');
      addToast('cupid', `Welcome back, ${user.profile?.displayName || 'Student'}!`);
    }
  };

  // Logout
  const handleLogout = () => {
    setCurrentUserId(null);
    setCurrentUser(null);
    setSettingsModalOpen(false);
    setActiveView('landing');
    addToast('info', 'You have been logged out.');
  };

  // Onboarding Complete
  const handleOnboardingComplete = (profile: UserProfile) => {
    if (!currentUser) return;
    const updatedUser = upsertProfile(currentUser.id, profile);
    setCurrentUser(updatedUser);
    setActiveView('dashboard');
    addToast('cupid', 'Profile created! You can now find your Valentine match.');
  };

  // Toggle Matching Mode
  const handleToggleMatchMode = (newMode: MatchMode) => {
    if (!currentUser || !currentUser.profile) return;
    const updatedProfile: UserProfile = {
      ...currentUser.profile,
      matchMode: newMode,
    };
    const updatedUser = upsertProfile(currentUser.id, updatedProfile);
    setCurrentUser(updatedUser);
    addToast(
      'info',
      newMode === 'INTERESTS'
        ? 'Switched to Interest-Based Cupid Matching'
        : 'Switched to Random Serendipity Match Mode'
    );
  };

  // Save Interests from Edit Modal
  const handleSaveInterests = (newInterests: Interest[]) => {
    if (!currentUser || !currentUser.profile) return;
    const updatedProfile: UserProfile = {
      ...currentUser.profile,
      interests: newInterests,
    };
    const updatedUser = upsertProfile(currentUser.id, updatedProfile);
    setCurrentUser(updatedUser);
    addToast('success', 'Interests updated successfully!');
  };

  // Save Profile from Settings Modal
  const handleSaveSettingsProfile = (updatedProfile: UserProfile) => {
    if (!currentUser) return;
    const updatedUser = upsertProfile(currentUser.id, updatedProfile);
    setCurrentUser(updatedUser);
    addToast('success', 'Profile settings saved!');
  };

  // Initiate 10-second Matching
  const handleStartMatching = () => {
    if (!currentUser || !currentUser.profile) {
      setActiveView('onboarding');
      return;
    }
    setActiveView('matching');
  };

  // When 10-second timer finishes
  const handleMatchingComplete = () => {
    if (!currentUser) {
      setActiveView('dashboard');
      return;
    }

    const result = executeMatchmaking(currentUser);

    if (result) {
      // Refresh matches and conversations
      const updatedMatches = getStoredMatches();
      const updatedConvs = getStoredConversations();
      const updatedMsgs = getStoredMessages();

      setMatches(updatedMatches);
      setConversations(updatedConvs);
      setMessages(updatedMsgs);

      setCurrentFoundMatch(result);
      setIsMatchResultOpen(true);
      setActiveView('dashboard');
    } else {
      setActiveView('dashboard');
      addToast(
        'error',
        'No new eligible matches available right now. You may have matched with all active candidates!'
      );
    }
  };

  // Copy Affiliate Product Link (Section 27)
  const handleCopyProductLink = (product: AffiliateProduct) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(product.affiliateUrl).catch(() => {});
    }
    addToast('cupid', 'Link copied! Save it — you might need it later. 💌');
  };

  // Start Chatting from Match Result
  const handleStartChat = (conversationId: string) => {
    setIsMatchResultOpen(false);
    setActiveConversationId(conversationId);
    setActiveView('chat');
  };

  // Open Chat directly
  const handleOpenChat = (conversationId: string) => {
    setActiveConversationId(conversationId);
    setActiveView('chat');
  };

  // Send Message
  const handleSendMessage = (conversationId: string, content: string) => {
    if (!currentUser) return;

    try {
      const newMsg = sendMessage(conversationId, currentUser.id, content);

      // Update local message list
      setMessages((prev) => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] || []), newMsg],
      }));

      // Update conversation lastMessage
      setConversations(getStoredConversations());

      // Find other participant for simulated real-time reply
      const conv = conversations.find((c) => c.id === conversationId);
      if (conv) {
        setIsPartnerTyping(true);
        triggerSimulatedMatchReply(
          conversationId,
          conv.otherUser.displayName,
          conv.otherUser.id,
          (replyMsg) => {
            setIsPartnerTyping(false);
            setMessages((prev) => ({
              ...prev,
              [conversationId]: [...(prev[conversationId] || []), replyMsg],
            }));
            setConversations(getStoredConversations());
            addToast(
              'cupid',
              `New message from ${conv.otherUser.displayName}: "${replyMsg.content.slice(0, 30)}..."`
            );
          }
        );
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Could not send message';
      addToast('error', errorMsg);
    }
  };

  // Block User Action
  const handleConfirmBlock = () => {
    if (!blockTarget) return;
    blockUser(blockTarget.id);

    // Refresh state
    setMatches(getStoredMatches());
    setConversations(getStoredConversations());

    addToast('info', `${blockTarget.name} has been blocked.`);
    setBlockTarget(null);
    setActiveView('dashboard');
  };

  // Report User Action
  const handleSubmitReport = (reason: ReportReason, note?: string) => {
    if (!reportTarget || !currentUser) return;
    reportUser({
      targetUserId: reportTarget.id,
      reporterUserId: currentUser.id,
      reason,
      note,
    });
    addToast(
      'info',
      `Thank you. Your report for ${reportTarget.name} has been submitted to campus moderation.`
    );
    setReportTarget(null);
  };

  // Calculate unread total
  const unreadTotal = conversations.reduce(
    (acc, curr) => acc + (curr.unreadCount || 0),
    0
  );

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-rose-200">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Top Navigation */}
      <Navbar
        currentUser={currentUser}
        activeView={activeView}
        unreadTotal={unreadTotal}
        onNavigate={(view) => {
          if (!currentUser && view !== 'landing') {
            setLoginModalOpen(true);
            return;
          }
          setActiveView(view);
        }}
        onOpenSettings={() => setSettingsModalOpen(true)}
        onLogout={handleLogout}
        onOpenLogin={() => setLoginModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeView === 'landing' && (
          <LandingView
            onStart={() => {
              if (currentUser) {
                setActiveView(
                  currentUser.profileCompleted ? 'dashboard' : 'onboarding'
                );
              } else {
                setLoginModalOpen(true);
              }
            }}
          />
        )}

        {activeView === 'onboarding' && currentUser && (
          <OnboardingView
            currentUser={currentUser}
            onComplete={handleOnboardingComplete}
          />
        )}

        {activeView === 'dashboard' && currentUser && (
          <DashboardView
            currentUser={currentUser}
            matches={matches}
            conversations={conversations}
            onFindMatch={handleStartMatching}
            onToggleMatchMode={handleToggleMatchMode}
            onOpenEditInterests={() => setEditInterestsModalOpen(true)}
            onOpenChat={handleOpenChat}
            onOpenSettings={() => setSettingsModalOpen(true)}
          />
        )}

        {activeView === 'matching' && (
          <MatchingScreen
            onComplete={handleMatchingComplete}
            onCopyProductLink={handleCopyProductLink}
            matchMode={currentUser?.profile?.matchMode}
          />
        )}

        {activeView === 'chat' && currentUser && (
          <ChatView
            currentUser={currentUser}
            conversations={conversations}
            activeConversationId={activeConversationId}
            messages={messages}
            onSelectConversation={setActiveConversationId}
            onSendMessage={handleSendMessage}
            onOpenBlock={(name, id) => setBlockTarget({ name, id })}
            onOpenReport={(name, id) => setReportTarget({ name, id })}
            onBackToDashboard={() => setActiveView('dashboard')}
            isPartnerTyping={isPartnerTyping}
          />
        )}
      </main>

      {/* Login Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLogin={handleLogin}
      />

      {/* Match Result Celebration Dialog */}
      <MatchResultModal
        match={currentFoundMatch}
        isOpen={isMatchResultOpen}
        onClose={() => setIsMatchResultOpen(false)}
        onStartChat={handleStartChat}
      />

      {/* Quick Edit Interests Modal */}
      {currentUser?.profile && (
        <EditInterestsModal
          isOpen={editInterestsModalOpen}
          currentInterests={currentUser.profile.interests}
          onClose={() => setEditInterestsModalOpen(false)}
          onSave={handleSaveInterests}
        />
      )}

      {/* Settings / Profile Edit Modal */}
      {currentUser && (
        <SettingsModal
          isOpen={settingsModalOpen}
          currentUser={currentUser}
          onClose={() => setSettingsModalOpen(false)}
          onSaveProfile={handleSaveSettingsProfile}
          onLogout={handleLogout}
        />
      )}

      {/* Block Confirmation Dialog */}
      <BlockDialog
        isOpen={!!blockTarget}
        targetName={blockTarget?.name || 'User'}
        onClose={() => setBlockTarget(null)}
        onConfirmBlock={handleConfirmBlock}
      />

      {/* Report Dialog */}
      <ReportDialog
        isOpen={!!reportTarget}
        targetName={reportTarget?.name || 'User'}
        onClose={() => setReportTarget(null)}
        onSubmitReport={handleSubmitReport}
      />
    </div>
  );
}
