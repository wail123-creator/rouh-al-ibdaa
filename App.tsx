
import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from './components/Layout';
import { Navbar } from './components/Navbar';
import { Header } from './components/Header';
import { Login } from './views/Login';
import { Feed } from './views/Feed';
import { Create } from './views/Create';
import { Profile } from './views/Profile';
import { Search } from './views/Search';
import { Messages } from './views/Messages';
import { ChatDetail } from './views/ChatDetail';
import { Notifications } from './views/Notifications';
import { FollowList } from './views/FollowList';
import { PostDetail } from './views/PostDetail';
import { AdminDashboard } from './views/AdminDashboard';
import { View, Post, User, Comment, Chat, ChatMessage, AppNotification } from './types';
import { INITIAL_POSTS, MOCK_USER, MOCK_CHATS, MOCK_NOTIFICATIONS } from './constants';

// Firebase Imports
import { auth, db } from './services/firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  doc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove,
  getDoc,
  setDoc,
  deleteDoc,
  Timestamp,
  increment,
  where,
  limit,
  getDocs,
  serverTimestamp
} from 'firebase/firestore';

const ADMIN_EMAIL = 'wail.amal.0123456@gmail.com';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('LOGIN');
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });
  
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [followListViewMode, setFollowListViewMode] = useState<'FOLLOWERS' | 'FOLLOWING'>('FOLLOWERS');
  const [feedFilter, setFeedFilter] = useState<'ALL' | 'FOLLOWING'>('ALL');

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), 3000);
  };

  const isAdmin = useMemo(() => user?.email === ADMIN_EMAIL, [user]);

  // 1. Auth & Online Status Tracker
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const userRef = doc(db, 'users', fbUser.uid);
        
        // Set Online
        await updateDoc(userRef, { 
          isOnline: true, 
          lastSeen: serverTimestamp() 
        }).catch(() => {});

        // Status Listeners for window close/hide
        const handleStatus = (online: boolean) => {
          updateDoc(userRef, { isOnline: online, lastSeen: serverTimestamp() }).catch(() => {});
        };

        const onVisibilityChange = () => handleStatus(document.visibilityState === 'visible');
        const onBeforeUnload = () => handleStatus(false);

        window.addEventListener('visibilitychange', onVisibilityChange);
        window.addEventListener('beforeunload', onBeforeUnload);

        onSnapshot(userRef, (snapshot) => {
          if (snapshot.exists()) {
            setUser(snapshot.data() as User);
          } else {
            const newProfile: User = {
              id: fbUser.uid,
              name: fbUser.displayName || fbUser.email?.split('@')[0] || 'مبدع',
              email: fbUser.email || '',
              bio: '',
              savedPostIds: [],
              followingIds: [],
              followerIds: [],
              followersCount: 0,
              followingCount: 0,
              isVerified: false,
              isOnline: true,
              lastSeen: serverTimestamp()
            };
            setDoc(userRef, newProfile);
            setUser(newProfile);
          }
        });

        // Notifications Listener
        const notifQuery = query(
          collection(db, 'notifications'), 
          where('userId', '==', fbUser.uid)
        );
        onSnapshot(notifQuery, (snapshot) => {
          const fbNotifs = snapshot.docs.map(doc => {
            const data = doc.data();
            let displayDate = 'الآن';
            if (data.createdAt) {
              const date = data.createdAt.toDate ? data.createdAt.toDate() : new Date();
              displayDate = date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
            }
            return { ...data, id: doc.id, date: displayDate } as AppNotification;
          });
          setNotifications(fbNotifs.sort((a, b) => {
            const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
            const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
            return timeB - timeA;
          }).slice(0, 30));
        });

        // Chats Listener with real-time participant status
        const chatsQuery = query(
          collection(db, 'chats'),
          where('participants', 'array-contains', fbUser.uid)
        );
        onSnapshot(chatsQuery, async (snapshot) => {
          const fbChats = await Promise.all(snapshot.docs.map(async (chatDoc) => {
            const data = chatDoc.data();
            const otherId = data.participants.find((p: string) => p !== fbUser.uid);
            
            // Fetch other participant's status
            const otherUserSnap = await getDoc(doc(db, 'users', otherId));
            const otherUserData = otherUserSnap.exists() ? otherUserSnap.data() as User : null;

            return {
              id: chatDoc.id,
              participantId: otherId,
              participantName: data.participantNames?.[otherId] || 'مبدع',
              lastMessage: data.lastMessage || '',
              timestamp: data.lastMessageAt?.toDate ? data.lastMessageAt.toDate().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }) : 'الآن',
              messages: [],
              isOnline: otherUserData?.isOnline || false,
              lastMessageAt: data.lastMessageAt
            } as any;
          }));

          const sortedChats = fbChats.sort((a, b) => {
            const timeA = a.lastMessageAt?.toMillis ? a.lastMessageAt.toMillis() : 0;
            const timeB = b.lastMessageAt?.toMillis ? b.lastMessageAt.toMillis() : 0;
            return timeB - timeA;
          });
          setChats(sortedChats as Chat[]);
        });

        if (currentView === 'LOGIN') setCurrentView('FEED');

        return () => {
          handleStatus(false);
          window.removeEventListener('visibilitychange', onVisibilityChange);
          window.removeEventListener('beforeunload', onBeforeUnload);
        };
      } else {
        setUser(null);
        setCurrentView('LOGIN');
      }
      setLoading(false);
    });
    return () => unsubscribeAuth();
  }, [currentView]);

  // 2. Real-time Posts
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fbPosts = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        date: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate().toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' }) : 'الآن'
      })) as Post[];
      setPosts(fbPosts.length > 0 ? fbPosts : INITIAL_POSTS);
    });
    return () => unsubscribe();
  }, [user]);

  const filteredPosts = useMemo(() => {
    if (feedFilter === 'ALL' || !user) return posts;
    return posts.filter(p => (user.followingIds || []).includes(p.authorId));
  }, [posts, feedFilter, user]);

  const handleLogout = async () => {
    if (user) {
      await updateDoc(doc(db, 'users', user.id), { 
        isOnline: false, 
        lastSeen: serverTimestamp() 
      }).catch(() => {});
    }
    await signOut(auth);
    showToast('تم تسجيل الخروج');
  };

  const handleLogin = async (email: string, pass: string, isNew: boolean) => {
    try {
      if (isNew) {
        await createUserWithEmailAndPassword(auth, email, pass);
        showToast('تم إنشاء الحساب بنجاح!');
      } else {
        await signInWithEmailAndPassword(auth, email, pass);
        showToast('مرحباً بعودتك!');
      }
    } catch (err: any) {
      alert("حدث خطأ: " + err.message);
    }
  };

  const publishPost = async (content: string, imageUrl?: string) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'posts'), {
        authorId: user.id,
        authorName: user.name,
        content,
        likes: 0,
        likedBy: [],
        createdAt: serverTimestamp(),
        imageUrl: imageUrl || null,
        comments: [],
        isVerifiedAuthor: user.isVerified || false
      });
      setCurrentView('FEED');
      showToast('تم نشر خاطرتك بنجاح!');
    } catch (err) { console.error(err); }
  };

  const toggleLike = async (postId: string) => {
    if (!user) return;
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    const isLiked = (post.likedBy || []).includes(user.id);
    try {
      await updateDoc(doc(db, 'posts', postId), {
        likedBy: isLiked ? arrayRemove(user.id) : arrayUnion(user.id),
        likes: increment(isLiked ? -1 : 1)
      });
      if (!isLiked && post.authorId !== user.id) {
        await addDoc(collection(db, 'notifications'), {
          userId: post.authorId,
          fromId: user.id,
          fromName: user.name,
          type: 'LIKE',
          content: 'أعجب بخاطرتك',
          postId: postId,
          createdAt: serverTimestamp(),
          isRead: false
        });
        showToast('تم الإعجاب بالخاطرة!');
      }
    } catch (err) { console.error(err); }
  };

  const addComment = async (postId: string, text: string) => {
    if (!user) return;
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    const newComment: Comment = {
      id: Date.now().toString(),
      authorId: user.id,
      authorName: user.name,
      content: text,
      date: 'الآن',
    };
    try {
      await updateDoc(doc(db, 'posts', postId), { comments: arrayUnion(newComment) });
      if (post.authorId !== user.id) {
        await addDoc(collection(db, 'notifications'), {
          userId: post.authorId,
          fromId: user.id,
          fromName: user.name,
          type: 'COMMENT',
          content: 'علق على خاطرتك',
          postId: postId,
          createdAt: serverTimestamp(),
          isRead: false
        });
      }
      showToast('تم إضافة تعليقك');
    } catch (err) { console.error(err); }
  };

  const handleFollow = async (targetUserId: string) => {
    if (!user) return;
    const isFollowing = (user.followingIds || []).includes(targetUserId);
    try {
      await updateDoc(doc(db, 'users', user.id), {
        followingIds: isFollowing ? arrayRemove(targetUserId) : arrayUnion(targetUserId),
        followingCount: increment(isFollowing ? -1 : 1)
      });
      await updateDoc(doc(db, 'users', targetUserId), {
        followerIds: isFollowing ? arrayRemove(user.id) : arrayUnion(user.id),
        followersCount: increment(isFollowing ? -1 : 1)
      });
      if (!isFollowing) {
        await addDoc(collection(db, 'notifications'), {
          userId: targetUserId,
          fromId: user.id,
          fromName: user.name,
          type: 'FOLLOW',
          content: 'بدأ بمتابعتك الآن',
          createdAt: serverTimestamp(),
          isRead: false
        });
        showToast('تمت المتابعة!');
      } else { showToast('تم إلغاء المتابعة'); }
    } catch (err) { console.error(err); }
  };

  const markNotificationRead = async (id: string) => {
    try { await updateDoc(doc(db, 'notifications', id), { isRead: true }); } catch (err) { console.error(err); }
  };

  const startChatWithUser = async (targetUser: User) => {
    if (!user) return;
    const qChat = query(collection(db, 'chats'), where('participants', 'array-contains', user.id));
    const snap = await getDocs(qChat);
    let existingChat = snap.docs.find(d => d.data().participants.includes(targetUser.id));

    if (existingChat) {
      setActiveChat({
        id: existingChat.id,
        participantId: targetUser.id,
        participantName: targetUser.name,
        lastMessage: existingChat.data().lastMessage,
        timestamp: 'الآن',
        messages: [],
        isOnline: targetUser.isOnline
      });
    } else {
      const newChatRef = await addDoc(collection(db, 'chats'), {
        participants: [user.id, targetUser.id],
        participantNames: { [user.id]: user.name, [targetUser.id]: targetUser.name },
        lastMessage: '',
        lastMessageAt: serverTimestamp()
      });
      setActiveChat({
        id: newChatRef.id,
        participantId: targetUser.id,
        participantName: targetUser.name,
        lastMessage: '',
        timestamp: 'الآن',
        messages: [],
        isOnline: targetUser.isOnline
      });
    }
    setCurrentView('CHAT_DETAIL');
  };

  const handleSendMessage = async (chatId: string, text: string) => {
    if (!user) return;
    try {
      await addDoc(collection(db, `chats/${chatId}/messages`), {
        text,
        senderId: user.id,
        createdAt: serverTimestamp()
      });
      await updateDoc(doc(db, 'chats', chatId), {
        lastMessage: text,
        lastMessageAt: serverTimestamp()
      });
    } catch (err) { console.error(err); }
  };

  const navigateToProfile = async (userId: string) => {
    if (user && userId === user.id) { setCurrentView('PROFILE'); return; }
    setLoading(true);
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        setSelectedUser(userDoc.data() as User);
        setCurrentView('PUBLIC_PROFILE');
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const navigateToPost = (post: Post) => {
    setSelectedPost(post);
    setCurrentView('POST_DETAIL');
  };

  // Admin Actions
  const adminVerifyUser = async (userId: string, isVerified: boolean) => {
    try {
      await updateDoc(doc(db, 'users', userId), { isVerified });
      showToast(isVerified ? 'تم توثيق المستخدم' : 'تم إلغاء التوثيق');
    } catch (err) { console.error(err); }
  };

  const adminDeleteUser = async (userId: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الحساب نهائياً؟')) return;
    try {
      await deleteDoc(doc(db, 'users', userId));
      showToast('تم حذف الحساب');
    } catch (err) { console.error(err); }
  };

  const adminDeletePost = async (postId: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الخاطرة؟')) return;
    try {
      await deleteDoc(doc(db, 'posts', postId));
      showToast('تم حذف الخاطرة');
    } catch (err) { console.error(err); }
  };

  const renderView = () => {
    if (loading) return (
      <div className="flex-1 flex items-center justify-center bg-[#0f172a]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#fbbf24]/20 border-t-[#fbbf24] rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-slate-400 font-bold animate-pulse">جاري التحميل...</p>
        </div>
      </div>
    );
    if (!user && currentView !== 'LOGIN' && currentView !== 'SIGNUP') return <Login setView={setCurrentView} onLogin={handleLogin} />;
    
    // Protected Admin Route
    if (currentView === 'ADMIN' && !isAdmin) {
      setCurrentView('FEED');
      return null;
    }

    switch (currentView) {
      case 'LOGIN': return <Login setView={setCurrentView} onLogin={handleLogin} />;
      case 'FEED': return (
        <Feed 
          posts={filteredPosts} 
          onAddComment={addComment} 
          onSave={(id) => updateDoc(doc(db, 'users', user!.id), { savedPostIds: (user?.savedPostIds.includes(id) ? arrayRemove(id) : arrayUnion(id)) })} 
          onToggleLike={toggleLike} 
          onProfileClick={navigateToProfile} 
          onPostClick={navigateToPost}
          filter={feedFilter} 
          onSetFilter={setFeedFilter} 
          currentUserId={user?.id} 
        />
      );
      case 'SEARCH': return <Search onProfileClick={navigateToProfile} />;
      case 'MESSAGES': return <Messages chats={chats} onSelectChat={(chat) => { setActiveChat(chat); setCurrentView('CHAT_DETAIL'); }} />;
      case 'CHAT_DETAIL': return activeChat && user ? <ChatDetail chat={activeChat} currentUser={user} onBack={() => setCurrentView('MESSAGES')} onSendMessage={handleSendMessage} /> : null;
      case 'POST_DETAIL': return selectedPost && user ? (
        <PostDetail 
          post={selectedPost} 
          currentUser={user} 
          onBack={() => setCurrentView('FEED')}
          onAddComment={addComment}
          onSave={(id) => updateDoc(doc(db, 'users', user!.id), { savedPostIds: (user?.savedPostIds.includes(id) ? arrayRemove(id) : arrayUnion(id)) })}
          onToggleLike={toggleLike}
          onProfileClick={navigateToProfile}
        />
      ) : null;
      case 'ADMIN': return isAdmin ? (
        <AdminDashboard 
          onBack={() => setCurrentView('PROFILE')} 
          onVerifyUser={adminVerifyUser}
          onDeleteUser={adminDeleteUser}
          onDeletePost={adminDeletePost}
        />
      ) : null;
      case 'NOTIFICATIONS': return <Notifications notifications={notifications} onMarkRead={markNotificationRead} onProfileClick={navigateToProfile} />;
      case 'CREATE': return <Create onPublish={publishPost} onCancel={() => setCurrentView('FEED')} />;
      case 'PROFILE': return user ? <Profile user={user} allPosts={posts} isOwnProfile={true} isAdmin={isAdmin} onLogout={handleLogout} onAddComment={addComment} onSave={(id) => updateDoc(doc(db, 'users', user!.id), { savedPostIds: (user?.savedPostIds.includes(id) ? arrayRemove(id) : arrayUnion(id)) })} onUpdateBio={(bio) => updateDoc(doc(db, 'users', user.id), { bio })} onProfileClick={navigateToProfile} onShowFollowList={(id, m) => { setSelectedUser(user); setFollowListViewMode(m); setCurrentView('FOLLOW_LIST'); }} onGoToAdmin={() => setCurrentView('ADMIN')} /> : null;
      case 'PUBLIC_PROFILE': return selectedUser && user ? <Profile user={selectedUser} allPosts={posts} isOwnProfile={false} onAddComment={addComment} onSave={(id) => updateDoc(doc(db, 'users', user!.id), { savedPostIds: (user?.savedPostIds.includes(id) ? arrayRemove(id) : arrayUnion(id)) })} onProfileClick={navigateToProfile} isFollowing={(user.followingIds || []).includes(selectedUser.id)} onFollow={() => handleFollow(selectedUser.id)} onShowFollowList={(id, m) => { setFollowListViewMode(m); setCurrentView('FOLLOW_LIST'); }} onStartChat={() => startChatWithUser(selectedUser)} /> : null;
      case 'FOLLOW_LIST': return selectedUser ? <FollowList mode={followListViewMode} userIds={followListViewMode === 'FOLLOWERS' ? (selectedUser.followerIds || []) : (selectedUser.followingIds || [])} onBack={() => setCurrentView(selectedUser.id === user?.id ? 'PROFILE' : 'PUBLIC_PROFILE')} onProfileClick={navigateToProfile} /> : null;
      default: return <Feed posts={posts} onAddComment={addComment} filter={feedFilter} onSetFilter={setFeedFilter} currentUserId={user?.id} onToggleLike={toggleLike} />;
    }
  };

  const showHeaderAndNav = user && currentView !== 'LOGIN' && currentView !== 'SIGNUP' && currentView !== 'CREATE' && currentView !== 'CHAT_DETAIL' && currentView !== 'POST_DETAIL' && currentView !== 'ADMIN' && !loading;

  return (
    <Layout>
      {showHeaderAndNav && <Header currentView={currentView} setView={setCurrentView} hasUnreadNotifications={notifications.some(n => !n.isRead)} />}
      <main className="flex-1 flex flex-col min-h-0 relative">
        {renderView()}
      </main>
      {showHeaderAndNav && <Navbar currentView={currentView} setView={setCurrentView} />}
      {toast.visible && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] bg-slate-800 border border-[#fbbf24]/30 text-white px-6 py-3 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-4 duration-300 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#fbbf24] animate-pulse"></div>
          <span className="text-sm font-bold italic">{toast.message}</span>
        </div>
      )}
    </Layout>
  );
};

export default App;
