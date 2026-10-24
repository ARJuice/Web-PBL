'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client/react';
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

interface MeData {
  me: User;
}

interface MyMatchesData {
  myMatches: Match[];
}

interface MyConversationsData {
  myConversations: Conversation[];
}

interface MessagesData {
  messages: Message[];
}

interface LoginData {
  login: {
    accessToken: string;
    user: User;
  };
}

interface UpdateProfileData {
  updateProfile: User;
}

interface UpdateInterestsData {
  updateInterests: User;
}

interface SetMatchModeData {
  setMatchMode: User;
}

interface ExecuteMatchData {
  executeMatch: Match;
}

interface SendMessageData {
  sendMessage: Message;
}

interface BlockUserData {
  blockUser: boolean;
}

interface ReportUserData {
  reportUser: boolean;
}

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

import {
  LOGIN_MUTATION,
  ME_QUERY,
  UPDATE_PROFILE_MUTATION,
  UPDATE_INTERESTS_MUTATION,
  SET_MATCH_MODE_MUTATION,
  EXECUTE_MATCH_MUTATION,
  MY_MATCHES_QUERY,
  MY_CONVERSATIONS_QUERY,
  MESSAGES_QUERY,
  SEND_MESSAGE_MUTATION,
  MARK_CONVERSATION_AS_READ_MUTATION,
  BLOCK_USER_MUTATION,
  REPORT_USER_MUTATION,
} from '@/lib/graphql/operations';

export default function HomePage() {
  const [hasToken, setHasToken] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('match_sahrdaya_token');
    }
    return false;
  });

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

  // GraphQL Hooks
  const [loginMutation] = useMutation<LoginData>(LOGIN_MUTATION);
  const [updateProfileMutation] = useMutation<UpdateProfileData>(UPDATE_PROFILE_MUTATION);
  const [updateInterestsMutation] = useMutation<UpdateInterestsData>(UPDATE_INTERESTS_MUTATION);
  const [setMatchModeMutation] = useMutation<SetMatchModeData>(SET_MATCH_MODE_MUTATION);
  const [executeMatchMutation] = useMutation<ExecuteMatchData>(EXECUTE_MATCH_MUTATION);
  const [sendMessageMutation] = useMutation<SendMessageData>(SEND_MESSAGE_MUTATION);
  const [markConversationAsReadMutation] = useMutation<{ markConversationAsRead: boolean }>(MARK_CONVERSATION_AS_READ_MUTATION);
  const [blockUserMutation] = useMutation<BlockUserData>(BLOCK_USER_MUTATION);
  const [reportUserMutation] = useMutation<ReportUserData>(REPORT_USER_MUTATION);

  const { data: meData } = useQuery<MeData>(ME_QUERY, {
    skip: !hasToken,
    fetchPolicy: 'network-only',
  });

  const { data: myMatchesData, refetch: refetchMatches } = useQuery<MyMatchesData>(MY_MATCHES_QUERY, {
    skip: !currentUser && !hasToken,
    fetchPolicy: 'network-only',
  });

  const { data: myConvsData, refetch: refetchConvs } = useQuery<MyConversationsData>(MY_CONVERSATIONS_QUERY, {
    skip: !currentUser && !hasToken,
    pollInterval: 10000,
    fetchPolicy: 'network-only',
  });

  const [fetchMessages, { data: messagesQueryData }] = useLazyQuery<MessagesData>(MESSAGES_QUERY, {
    fetchPolicy: 'network-only',
  });

  // Derived state combining GraphQL data and local fallbacks
  const activeUser = meData?.me || currentUser;
  const activeMatches = myMatchesData?.myMatches || matches;
  const activeConversations = myConvsData?.myConversations || conversations;
  const activeMessages =
    messagesQueryData?.messages && activeConversationId
      ? { ...messages, [activeConversationId]: messagesQueryData.messages }
      : messages;

  const handleSelectConversation = useCallback((id: string) => {
    setActiveConversationId(id);
    fetchMessages({ variables: { conversationId: id } }).catch(() => {});
    markConversationAsReadMutation({ variables: { conversationId: id } }).catch(() => {});
  }, [fetchMessages, markConversationAsReadMutation]);

  // Login handler
  const handleLogin = async (email: string) => {
    try {
      const response = await loginMutation({
        variables: { input: { email } },
      });

      if (response.data?.login) {
        const { accessToken, user } = response.data.login;
        if (typeof window !== 'undefined') {
          localStorage.setItem('match_sahrdaya_token', accessToken);
          localStorage.setItem('match_sahrdaya_current_user_id', user.id);
        }
        setHasToken(true);
        setCurrentUser(user);
        setLoginModalOpen(false);

        await Promise.allSettled([refetchMatches(), refetchConvs()]);

        if (!user.profileCompleted) {
          setActiveView('onboarding');
          addToast('info', 'Welcome to Sahrdaya Valentine Matching! Please set up your profile.');
        } else {
          setActiveView('dashboard');
          addToast('cupid', `Welcome back, ${user.profile?.displayName || 'Student'}! (Connected via GraphQL)`);
        }
        return;
      }
    } catch (graphQLErr) {
      console.warn('Backend GraphQL login failed, using local persistence fallback:', graphQLErr);
    }

    // Graceful fallback to storage.ts
    const user = loginWithEmail(email);
    setCurrentUser(user);
    setLoginModalOpen(false);

    setMatches(getStoredMatches());
    setConversations(getStoredConversations());
    setMessages(getStoredMessages());

    if (!user.profileCompleted) {
      setActiveView('onboarding');
      addToast('info', 'Welcome to Sahrdaya Valentine Matching! Please set up your profile.');
    } else {
      setActiveView('dashboard');
      addToast('cupid', `Welcome back, ${user.profile?.displayName || 'Student'}!`);
    }
  };

  // Logout
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('match_sahrdaya_token');
      localStorage.removeItem('match_sahrdaya_current_user_id');
    }
    setHasToken(false);
    setCurrentUserId(null);
    setCurrentUser(null);
    setSettingsModalOpen(false);
    setActiveView('landing');
    addToast('info', 'You have been logged out.');
  };

  // Onboarding Complete
  const handleOnboardingComplete = async (profile: UserProfile) => {
    if (!currentUser) return;

    try {
      const response = await updateProfileMutation({
        variables: {
          input: {
            displayName: profile.displayName,
            year: profile.year,
            bio: profile.bio || '',
            gender: profile.gender,
            showDob: profile.showDob,
            dateOfBirth: profile.dateOfBirth,
            intent: profile.intent,
            matchMode: profile.matchMode,
            interestIds: profile.interests.map((i) => i.id),
            avatarUrl: profile.avatarUrl,
          },
        },
      });

      if (response.data?.updateProfile) {
        setCurrentUser(response.data.updateProfile);
        setActiveView('dashboard');
        addToast('cupid', 'Profile created! You can now find your Valentine match.');
        return;
      }
    } catch (err) {
      console.warn('GraphQL updateProfile failed, falling back to local storage:', err);
    }

    const updatedUser = upsertProfile(currentUser.id, profile);
    setCurrentUser(updatedUser);
    setActiveView('dashboard');
    addToast('cupid', 'Profile created! You can now find your Valentine match.');
  };

  // Toggle Matching Mode
  const handleToggleMatchMode = async (newMode: MatchMode) => {
    if (!currentUser || !currentUser.profile) return;

    try {
      const response = await setMatchModeMutation({
        variables: { mode: newMode },
      });
      if (response.data?.setMatchMode) {
        setCurrentUser((prev) =>
          prev ? { ...prev, profile: { ...prev.profile!, matchMode: newMode } } : null
        );
        addToast(
          'info',
          newMode === 'INTERESTS'
            ? 'Switched to Interest-Based Cupid Matching'
            : 'Switched to Random Serendipity Match Mode'
        );
        return;
      }
    } catch (err) {
      console.warn('GraphQL setMatchMode failed, falling back to local storage:', err);
    }

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
  const handleSaveInterests = async (newInterests: Interest[]) => {
    if (!currentUser || !currentUser.profile) return;

    try {
      const response = await updateInterestsMutation({
        variables: { interestIds: newInterests.map((i) => i.id) },
      });
      if (response.data?.updateInterests) {
        setCurrentUser((prev) =>
          prev ? { ...prev, profile: { ...prev.profile!, interests: newInterests } } : null
        );
        addToast('success', 'Interests updated successfully!');
        return;
      }
    } catch (err) {
      console.warn('GraphQL updateInterests failed, falling back to local storage:', err);
    }

    const updatedProfile: UserProfile = {
      ...currentUser.profile,
      interests: newInterests,
    };
    const updatedUser = upsertProfile(currentUser.id, updatedProfile);
    setCurrentUser(updatedUser);
    addToast('success', 'Interests updated successfully!');
  };

  // Save Profile from Settings Modal
  const handleSaveSettingsProfile = async (updatedProfile: UserProfile) => {
    if (!currentUser) return;

    try {
      const response = await updateProfileMutation({
        variables: {
          input: {
            displayName: updatedProfile.displayName,
            year: updatedProfile.year,
            bio: updatedProfile.bio || '',
            gender: updatedProfile.gender,
            showDob: updatedProfile.showDob,
            dateOfBirth: updatedProfile.dateOfBirth,
            intent: updatedProfile.intent,
            matchMode: updatedProfile.matchMode,
            interestIds: updatedProfile.interests.map((i) => i.id),
            avatarUrl: updatedProfile.avatarUrl,
          },
        },
      });
      if (response.data?.updateProfile) {
        setCurrentUser(response.data.updateProfile);
        addToast('success', 'Profile settings saved!');
        return;
      }
    } catch (err) {
      console.warn('GraphQL updateProfile failed, falling back to local storage:', err);
    }

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
  const handleMatchingComplete = async () => {
    if (!currentUser) {
      setActiveView('dashboard');
      return;
    }

    try {
      const response = await executeMatchMutation({
        variables: { overrideMode: currentUser.profile?.matchMode },
      });

      if (response.data?.executeMatch) {
        const newMatch: Match = response.data.executeMatch;
        setCurrentFoundMatch(newMatch);
        setIsMatchResultOpen(true);
        setActiveView('dashboard');
        await Promise.allSettled([refetchMatches(), refetchConvs()]);
        return;
      }
    } catch (err: any) {
      console.warn('GraphQL executeMatch failed, checking fallback:', err);
      const graphQLErrorMsg = err?.message;
      if (graphQLErrorMsg && graphQLErrorMsg.includes('No new eligible matches')) {
        setActiveView('dashboard');
        addToast(
          'error',
          'No new eligible matches available right now. You have connected with all active candidates!'
        );
        return;
      }
    }

    // Local storage fallback
    const result = executeMatchmaking(currentUser);
    if (result) {
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
  const handleSendMessage = async (conversationId: string, content: string) => {
    if (!currentUser) return;

    try {
      const response = await sendMessageMutation({
        variables: {
          input: {
            conversationId,
            content,
          },
        },
      });

      if (response.data?.sendMessage) {
        const newMsg: Message = response.data.sendMessage;
        setMessages((prev) => ({
          ...prev,
          [conversationId]: [...(prev[conversationId] || []), newMsg],
        }));

        await refetchConvs();

        // Check if other participant should send an interactive reply
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
              refetchConvs();
              addToast(
                'cupid',
                `New message from ${conv.otherUser.displayName}: "${replyMsg.content.slice(0, 30)}..."`
              );
            }
          );
        }
        return;
      }
    } catch (err: unknown) {
      console.warn('GraphQL sendMessage failed, falling back to local:', err);
    }

    try {
      const newMsg = sendMessage(conversationId, currentUser.id, content);

      setMessages((prev) => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] || []), newMsg],
      }));

      setConversations(getStoredConversations());

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
  const handleConfirmBlock = async () => {
    if (!blockTarget) return;

    try {
      const response = await blockUserMutation({
        variables: { targetUserId: blockTarget.id },
      });
      if (response.data?.blockUser) {
        await Promise.allSettled([refetchMatches(), refetchConvs()]);
        addToast('info', `${blockTarget.name} has been blocked.`);
        setBlockTarget(null);
        setActiveView('dashboard');
        return;
      }
    } catch (err) {
      console.warn('GraphQL blockUser failed, falling back to local:', err);
    }

    blockUser(blockTarget.id);
    setMatches(getStoredMatches());
    setConversations(getStoredConversations());
    addToast('info', `${blockTarget.name} has been blocked.`);
    setBlockTarget(null);
    setActiveView('dashboard');
  };

  // Report User Action
  const handleSubmitReport = async (reason: ReportReason, note?: string) => {
    if (!reportTarget || !currentUser) return;

    try {
      const response = await reportUserMutation({
        variables: {
          input: {
            targetUserId: reportTarget.id,
            reason,
            note,
          },
        },
      });
      if (response.data?.reportUser) {
        addToast(
          'info',
          `Thank you. Your report for ${reportTarget.name} has been submitted to campus moderation.`
        );
        setReportTarget(null);
        return;
      }
    } catch (err) {
      console.warn('GraphQL reportUser failed, falling back to local:', err);
    }

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
  const unreadTotal = activeConversations.reduce(
    (acc, curr) => acc + (curr.unreadCount || 0),
    0
  );

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-rose-200">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Top Navigation */}
      <Navbar
        currentUser={activeUser}
        activeView={activeView}
        unreadTotal={unreadTotal}
        onNavigate={(view) => {
          if (!activeUser && view !== 'landing') {
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
              if (activeUser) {
                setActiveView(
                  activeUser.profileCompleted ? 'dashboard' : 'onboarding'
                );
              } else {
                setLoginModalOpen(true);
              }
            }}
          />
        )}

        {activeView === 'onboarding' && activeUser && (
          <OnboardingView
            currentUser={activeUser}
            onComplete={handleOnboardingComplete}
          />
        )}

        {activeView === 'dashboard' && activeUser && (
          <DashboardView
            currentUser={activeUser}
            matches={activeMatches}
            conversations={activeConversations}
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
            matchMode={activeUser?.profile?.matchMode}
          />
        )}

        {activeView === 'chat' && activeUser && (
          <ChatView
            currentUser={activeUser}
            conversations={activeConversations}
            activeConversationId={activeConversationId}
            messages={activeMessages}
            onSelectConversation={handleSelectConversation}
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
      {activeUser?.profile && (
        <EditInterestsModal
          isOpen={editInterestsModalOpen}
          currentInterests={activeUser.profile.interests}
          onClose={() => setEditInterestsModalOpen(false)}
          onSave={handleSaveInterests}
        />
      )}

      {/* Settings / Profile Edit Modal */}
      {activeUser && (
        <SettingsModal
          isOpen={settingsModalOpen}
          currentUser={activeUser}
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
