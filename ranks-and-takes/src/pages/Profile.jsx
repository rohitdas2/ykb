import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';
import '../styles/Pages.css';

const Profile = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [activeTab, setActiveTab] = useState('takes');
  const [isEditing, setIsEditing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(user?.createdAt ? new Date(user.createdAt) : new Date());
  const [likedTakes, setLikedTakes] = useState(new Set());
  const [actionStates, setActionStates] = useState(new Map());
  const [showDMs, setShowDMs] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [conversations, setConversations] = useState([
    {
      id: 1,
      name: 'Sports Analyst',
      handle: '@sportsanalyst',
      avatar: '👨‍💼',
      lastMessage: 'Great take on the Celtics!',
      lastMessageTime: '2 hours ago',
      unread: 2,
      messages: [
        { id: 1, sender: 'Sports Analyst', text: 'Hey! Loved your recent take', timestamp: '1 hour ago', isOwn: false },
        { id: 2, sender: 'You', text: 'Thanks! Appreciate the feedback', timestamp: '58 minutes ago', isOwn: true },
        { id: 3, sender: 'Sports Analyst', text: 'Great take on the Celtics!', timestamp: '2 minutes ago', isOwn: false }
      ]
    },
    {
      id: 2,
      name: 'Hoops Lover',
      handle: '@hoopslover',
      avatar: '👩‍🦱',
      lastMessage: 'Want to collab on a video?',
      lastMessageTime: '5 hours ago',
      unread: 0,
      messages: [
        { id: 1, sender: 'Hoops Lover', text: 'Want to collab on a video?', timestamp: '5 hours ago', isOwn: false }
      ]
    },
    {
      id: 3,
      name: 'Basketball Eyes',
      handle: '@basketballeyes',
      avatar: '👨‍🦨',
      lastMessage: 'Check out my latest analysis',
      lastMessageTime: '1 day ago',
      unread: 0,
      messages: [
        { id: 1, sender: 'Basketball Eyes', text: 'Check out my latest analysis', timestamp: '1 day ago', isOwn: false }
      ]
    }
  ]);
  const [friends, setFriends] = useState([
    { id: 1, name: 'Sports Analyst', handle: '@sportsanalyst', avatar: '👨‍💼', isFriend: true },
    { id: 2, name: 'Hoops Lover', handle: '@hoopslover', avatar: '👩‍🦱', isFriend: false },
    { id: 3, name: 'Basketball Eyes', handle: '@basketballeyes', avatar: '👨‍🦨', isFriend: true },
  ]);
  const [showFriendsModal, setShowFriendsModal] = useState(false);
  const [profilePicture, setProfilePicture] = useState(localStorage.getItem('userProfilePicture') || null);
  const notifications = useNotificationStore((state) => state.notifications);
  const markNotificationAsRead = useNotificationStore((state) => state.markNotificationAsRead);
  const dismissNotification = useNotificationStore((state) => state.dismissNotification);
  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleFriend = (friendId) => {
    setFriends(prevFriends =>
      prevFriends.map(friend =>
        friend.id === friendId ? { ...friend, isFriend: !friend.isFriend } : friend
      )
    );
  };

  const handleProfilePictureUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result;
        setProfilePicture(base64String);
        localStorage.setItem('userProfilePicture', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfilePicture = () => {
    setProfilePicture(null);
    localStorage.removeItem('userProfilePicture');
  };

  const handleLike = (takeId) => {
    const newLikedTakes = new Set(likedTakes);
    if (newLikedTakes.has(takeId)) {
      newLikedTakes.delete(takeId);
    } else {
      newLikedTakes.add(takeId);
    }
    setLikedTakes(newLikedTakes);
  };

  const handleActionClick = (takeId, actionType) => {
    const key = `${takeId}-${actionType}`;
    const newActionStates = new Map(actionStates);

    if (newActionStates.has(key)) {
      newActionStates.delete(key);
    } else {
      newActionStates.set(key, true);
    }
    setActionStates(newActionStates);
  };

  const handleSendMessage = () => {
    if (messageText.trim() && selectedConversation !== null) {
      const newMessage = {
        id: Date.now(),
        sender: 'You',
        text: messageText,
        timestamp: 'now',
        isOwn: true
      };

      setConversations(prevConversations =>
        prevConversations.map(conv =>
          conv.id === selectedConversation
            ? { ...conv, messages: [...conv.messages, newMessage], lastMessage: messageText, lastMessageTime: 'now' }
            : conv
        )
      );

      setMessageText('');
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const userScores = [
    { category: 'Accuracy', score: 7.8, description: 'How accurate your takes are', icon: '🎯' },
    { category: 'Popularity', score: 8.2, description: 'Community engagement', icon: '🌟' },
    { category: 'Analysis', score: 8.0, description: 'Quality of takes', icon: '📊' },
  ];

  const followers = [
    { id: 1, name: 'Sports Analyst', handle: '@sportsanalyst', avatar: '👨‍💼' },
    { id: 2, name: 'Hoops Lover', handle: '@hoopslover', avatar: '👩‍🦱' },
    { id: 3, name: 'Basketball Eyes', handle: '@basketballeyes', avatar: '👨‍🦨' },
    { id: 4, name: 'Stats Nerd', handle: '@statsnerd', avatar: '👩‍💻' },
  ];

  const userTakes = [
    {
      id: 1,
      take: 'The Celtics are the most complete team in the NBA this season',
      rank: 8.2,
      numRatings: 523,
      likes: 234,
      timestamp: '2 days ago',
      comments: [
        {
          id: 1,
          author: 'Sports Analyst',
          avatar: '👨‍💼',
          text: 'Completely agree! Their defense is elite.',
          timestamp: '1 day ago'
        },
        {
          id: 2,
          author: 'Hoops Lover',
          avatar: '👩‍🦱',
          text: 'Their bench depth is unreal',
          timestamp: '18 hours ago'
        }
      ]
    },
    {
      id: 2,
      take: 'Jayson Tatum is a top-5 player in the league',
      rank: 8.7,
      numRatings: 812,
      likes: 456,
      timestamp: '5 days ago',
      comments: [
        {
          id: 3,
          author: 'Basketball Eyes',
          avatar: '👨‍🦨',
          text: 'Tatum is looking incredible this season!',
          timestamp: '4 days ago'
        }
      ]
    },
  ];

  return (
    <div className="page-container">
      <header className="app-header">
        <div className="header-left">
          <h1>Ranks & Takes</h1>
        </div>
        <div className="header-center">
          <nav className="main-nav">
            <a href="/rankings" className="nav-item">Rankings</a>
            <a href="/player-stats" className="nav-item">Player Stats</a>
            <a href="/home" className="nav-item">Home</a>
            <a href="/search" className="nav-item">Search</a>
            <a href="/scores" className="nav-item">Scores</a>
            <a href="/profile" className="nav-item">Profile</a>
          </nav>
        </div>
        <div className="header-right">
          <button className="btn btn-icon" onClick={() => setShowDMs(!showDMs)}>💬</button>
          <div className="notification-button-wrapper">
            <button className="btn btn-icon notification-btn" onClick={() => setShowNotifications(!showNotifications)}>🔔</button>
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </div>
          <button className="btn btn-icon" title="Settings" onClick={() => setShowSettings(true)} style={{ fontSize: '20px', fontWeight: 'bold', padding: '8px 12px', minWidth: 'auto' }}>
            ⋮
          </button>
        </div>
      </header>

      <main className="main-content profile-page">
        <div className="profile-header">
          <div className="profile-cover">
          </div>

          <div className="profile-info">
            <div className="profile-avatar-container">
              {profilePicture ? (
                <img src={profilePicture} alt="Profile" className="profile-avatar-image" />
              ) : (
                <div className="profile-avatar">👤</div>
              )}
              {isEditing && (
                <label className="profile-avatar-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureUpload}
                    style={{ display: 'none' }}
                  />
                  <span>📷</span>
                </label>
              )}
            </div>
            <div className="profile-details">
              <h2>{user?.displayName || 'Your Name'}</h2>
              <p className="profile-username">@{user?.username || 'username'}</p>
              <p className="profile-bio">Basketball enthusiast & takes connoisseur</p>
              <p className="profile-joined" style={{ cursor: 'pointer', color: '#00274C' }} onClick={() => setShowDatePicker(true)}>📅 Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Recently'}</p>
              <div className="profile-stats">
                <div className="stat">
                  <span className="stat-value">#247</span>
                  <span className="stat-label">Overall Rank</span>
                </div>
                <div className="stat" style={{ cursor: 'pointer' }} onClick={() => setShowFollowers(true)}>
                  <span className="stat-value" style={{ color: '#00274C' }}>2.4K</span>
                  <span className="stat-label">Followers</span>
                </div>
                <div className="stat">
                  <span className="stat-value">856</span>
                  <span className="stat-label">Following</span>
                </div>
                <div className="stat">
                  <span className="stat-value">234</span>
                  <span className="stat-label">Friends</span>
                </div>
              </div>
            </div>

            {!isEditing && (
              <div className="profile-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="edit-profile-section">
            <h3>Edit Profile</h3>
            <form className="edit-form">
              <div className="form-group">
                <label>Profile Picture</label>
                <div className="profile-picture-section">
                  <div className="picture-preview">
                    {profilePicture ? (
                      <>
                        <img src={profilePicture} alt="Profile" style={{ maxHeight: '150px', borderRadius: '8px' }} />
                        <button type="button" className="btn btn-danger" onClick={removeProfilePicture} style={{ marginTop: '12px', width: '100%' }}>
                          Remove Picture
                        </button>
                      </>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '24px', color: '#999' }}>
                        <p style={{ fontSize: '48px', margin: '0 0 12px 0' }}>📷</p>
                        <p style={{ margin: 0, fontSize: '14px' }}>No picture uploaded</p>
                      </div>
                    )}
                  </div>
                  <label className="upload-button">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureUpload}
                      style={{ display: 'none' }}
                    />
                    <span>Choose Image</span>
                  </label>
                </div>
              </div>
              <div className="form-group">
                <label>Display Name</label>
                <input type="text" defaultValue={user?.displayName} />
              </div>
              <div className="form-group">
                <label>Bio</label>
                <textarea rows="3" placeholder="Tell us about yourself"></textarea>
              </div>
              <div className="form-group">
                <label>Favorite Team</label>
                <select>
                  <option>Select a team...</option>
                  <option>Boston Celtics</option>
                  <option>Los Angeles Lakers</option>
                  <option>Golden State Warriors</option>
                  <option>Denver Nuggets</option>
                  <option>Phoenix Suns</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-primary" onClick={() => setIsEditing(false)}>
                  Save Changes
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="content-wrapper">
          <div className="feed-section">
            <div className="profile-tabs">
              <button
                className={`tab ${activeTab === 'takes' ? 'active' : ''}`}
                onClick={() => setActiveTab('takes')}
              >
                Takes ({userTakes.length})
              </button>
              <button
                className={`tab ${activeTab === 'ratings' ? 'active' : ''}`}
                onClick={() => setActiveTab('ratings')}
              >
                Ratings (124)
              </button>
              <button
                className={`tab ${activeTab === 'likes' ? 'active' : ''}`}
                onClick={() => setActiveTab('likes')}
              >
                Likes (89)
              </button>
            </div>

            {activeTab === 'takes' && (
              <div className="takes-list">
                {userTakes.map((take) => (
                  <div key={take.id} className="take-card">
                    <div className="take-content">
                      <p className="take-text">{take.take}</p>
                    </div>

                    <div className="take-rating">
                      <div className="rating-display">
                        <div className="rating-score">
                          <span className="score">{take.rank}</span>
                          <span className="label">Score</span>
                        </div>
                        <div className="rating-stats">
                          <p>{take.numRatings.toLocaleString()} ratings</p>
                        </div>
                      </div>
                    </div>

                    <div className="take-actions">
                      <button
                        className={`action-btn ${actionStates.has(`${take.id}-comment`) ? 'active' : ''}`}
                        onClick={() => handleActionClick(take.id, 'comment')}
                      >
                        💬
                      </button>
                      <button
                        className={`action-btn ${likedTakes.has(take.id) ? 'active liked' : ''}`}
                        onClick={() => handleLike(take.id)}
                      >
                        {likedTakes.has(take.id) ? '❤️' : '🤍'} {take.likes}
                      </button>
                      <button
                        className={`action-btn ${actionStates.has(`${take.id}-share`) ? 'active' : ''}`}
                        onClick={() => handleActionClick(take.id, 'share')}
                      >
                        ⤴️
                      </button>
                      <button
                        className={`action-btn delete ${actionStates.has(`${take.id}-delete`) ? 'active' : ''}`}
                        onClick={() => handleActionClick(take.id, 'delete')}
                      >
                        🗑️
                      </button>
                    </div>

                    {take.comments && take.comments.length > 0 && (
                      <div className="top-comment-section">
                        <div className="comment-divider"></div>
                        <div className="top-comment">
                          <div className="comment-header">
                            <span className="comment-avatar">{take.comments[0].avatar}</span>
                            <div className="comment-author-info">
                              <p className="comment-author">{take.comments[0].author}</p>
                              <p className="comment-time">{take.comments[0].timestamp}</p>
                            </div>
                          </div>
                          <p className="comment-text">{take.comments[0].text}</p>
                          {take.comments.length > 1 && (
                            <button
                              className="view-more-comments-btn"
                              onClick={() => handleActionClick(take.id, 'comment')}
                            >
                              View {take.comments.length - 1} more comment{take.comments.length - 1 > 1 ? 's' : ''}
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'ratings' && (
              <div className="empty-state">
                <p>📊 View all your ratings here</p>
                <small>You've rated 124 takes so far</small>
              </div>
            )}

            {activeTab === 'likes' && (
              <div className="empty-state">
                <p>❤️ Liked takes will appear here</p>
                <small>You've liked 89 takes</small>
              </div>
            )}

          </div>

          {/* Sidebar */}
          <aside className="sidebar">
            <div className="sidebar-card">
              <h3 style={{ margin: '0 0 16px 0' }}>Stats</h3>
              <div className="profile-stats-grid">
                <div className="profile-stat-item">
                  <span style={{ fontSize: '12px', color: '#999', fontWeight: '500' }}>Takes</span>
                  <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#00274C', marginTop: '4px' }}>34</span>
                </div>

                <div className="profile-stat-item">
                  <span style={{ fontSize: '12px', color: '#999', fontWeight: '500' }}>Games Watched</span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#00274C', marginTop: '4px' }}>67/82</span>
                  <div className="stat-bar-container" style={{ height: '4px', background: '#eee', borderRadius: '2px', overflow: 'hidden', marginTop: '6px' }}>
                    <div className="stat-bar-progress" style={{ width: '81.71%', height: '100%', background: '#00274C', borderRadius: '2px' }}></div>
                  </div>
                </div>

                <div className="profile-stat-item">
                  <span style={{ fontSize: '12px', color: '#999', fontWeight: '500' }}>Ball Knowledge</span>
                  <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#00274C', marginTop: '4px' }}>75/100</span>
                </div>

              </div>
            </div>

            <div className="sidebar-card">
              <h3>Achievements</h3>
              <div className="achievements-list">
                <div className="achievement">
                  <span className="icon">🏆</span>
                  <p>Verified User</p>
                </div>
                <div className="achievement">
                  <span className="icon">💬</span>
                  <p>20+ Takes</p>
                </div>
                <div className="achievement">
                  <span className="icon">⭐</span>
                  <p>Avg 7.5+ Rating</p>
                </div>
              </div>
            </div>

          </aside>
        </div>
      </main>

      {/* Notifications Modal */}
      {showNotifications && (
        <div className="notifications-modal-overlay" onClick={() => setShowNotifications(false)}>
          <div className="notifications-modal" onClick={(e) => e.stopPropagation()}>
            <div className="notifications-header">
              <h2>Notifications</h2>
              {unreadCount > 0 && (
                <button className="mark-all-read-btn" onClick={markAllAsRead}>Mark all as read</button>
              )}
            </div>

            <div className="notifications-list">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <div key={notif.id} className={`notification-item ${notif.read ? '' : 'unread'}`}>
                    <div className="notification-avatar">{notif.avatar}</div>
                    <div className="notification-content">
                      <p className="notification-text">
                        <strong>{notif.user}</strong> {notif.action}
                      </p>
                      <p className="notification-message">{notif.message}</p>
                      <span className="notification-time">{notif.time}</span>
                    </div>
                    <button
                      className="dismiss-btn"
                      onClick={() => dismissNotification(notif.id)}
                    >
                      ✕
                    </button>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>🔔 No notifications yet</p>
                  <small>Check back soon for updates</small>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Friends Management Modal */}
      {showFriendsModal && (
        <div className="modal-overlay" onClick={() => setShowFriendsModal(false)}>
          <div className="modal-content" style={{ maxHeight: '600px', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Manage Friends</h2>
              <button className="modal-close" onClick={() => setShowFriendsModal(false)}>✕</button>
            </div>

            <div className="modal-body">
              <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#00274C', margin: 0 }}>
                    {friends.filter(f => f.isFriend).length}
                  </p>
                  <p style={{ fontSize: '12px', color: '#666', margin: '4px 0 0 0' }}>Friends</p>
                </div>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#999', margin: 0 }}>
                    {friends.filter(f => !f.isFriend).length}
                  </p>
                  <p style={{ fontSize: '12px', color: '#666', margin: '4px 0 0 0' }}>Add</p>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#000' }}>Your Friends</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {friends.filter(f => f.isFriend).map((friend) => (
                    <div key={friend.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      backgroundColor: '#f9f9f9',
                      borderRadius: '8px',
                      border: '1px solid #e0e0e0'
                    }}>
                      <span style={{ fontSize: '32px' }}>{friend.avatar}</span>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#000' }}>{friend.name}</p>
                        <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#666' }}>{friend.handle}</p>
                      </div>
                      <button
                        onClick={() => toggleFriend(friend.id)}
                        style={{
                          background: '#ff4444',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#000' }}>Add Friends</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {friends.filter(f => !f.isFriend).map((friend) => (
                    <div key={friend.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      backgroundColor: '#f9f9f9',
                      borderRadius: '8px',
                      border: '1px solid #e0e0e0'
                    }}>
                      <span style={{ fontSize: '32px' }}>{friend.avatar}</span>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#000' }}>{friend.name}</p>
                        <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#666' }}>{friend.handle}</p>
                      </div>
                      <button
                        onClick={() => toggleFriend(friend.id)}
                        style={{
                          background: '#00274C',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Settings</h2>
              <button className="modal-close" onClick={() => setShowSettings(false)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="settings-section">
                <h3>Account Details</h3>
                <div className="account-info">
                  <p><strong>Email:</strong> {user?.email || 'user@example.com'}</p>
                  <p><strong>Phone:</strong> {user?.phoneNumber || '+1 (555) 000-0000'}</p>
                  <p><strong>Username:</strong> @{user?.username || 'username'}</p>
                  <p><strong>Joined:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}</p>
                  <p><strong>Verified:</strong> ✓ Phone</p>
                </div>
              </div>

              <div className="settings-section">
                <h3>Preferences</h3>
                <div className="preference-item">
                  <label>
                    <input type="checkbox" defaultChecked />
                    <span>Email notifications</span>
                  </label>
                </div>
                <div className="preference-item">
                  <label>
                    <input type="checkbox" defaultChecked />
                    <span>Game updates</span>
                  </label>
                </div>
              </div>

              <div className="settings-section">
                <h3>Danger Zone</h3>
                <button className="btn btn-danger" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Followers Modal */}
      {showFollowers && (
        <div className="modal-overlay" onClick={() => setShowFollowers(false)}>
          <div className="modal-content modal-followers" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Followers (2.4K)</h2>
              <button className="modal-close" onClick={() => setShowFollowers(false)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="followers-list">
                {followers.map((follower) => (
                  <div key={follower.id} className="follower-item">
                    <span className="avatar">{follower.avatar}</span>
                    <div className="follower-info">
                      <p className="name">{follower.name}</p>
                      <p className="handle">{follower.handle}</p>
                    </div>
                    <button className="btn btn-small">Following</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Date Picker Modal */}
      {showDatePicker && (
        <div className="modal-overlay" onClick={() => setShowDatePicker(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Select Join Date</h2>
              <button className="modal-close" onClick={() => setShowDatePicker(false)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="date-picker-container">
                <input
                  type="date"
                  value={selectedDate.toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  style={{
                    padding: '12px',
                    fontSize: '16px',
                    border: '2px solid #00274C',
                    borderRadius: '8px',
                    width: '100%',
                    marginBottom: '16px'
                  }}
                />
                <p style={{ textAlign: 'center', color: '#666', marginBottom: '16px' }}>
                  {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowDatePicker(false)}
                  style={{ width: '100%' }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DM Modal */}
      {showDMs && (
        <div className="dm-modal-overlay" onClick={() => setShowDMs(false)}>
          <div className="dm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dm-header">
              <h2>Messages</h2>
              <button className="close-btn" onClick={() => setShowDMs(false)}>✕</button>
            </div>

            <div className="dm-container">
              <div className="conversations-list">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={`conversation-item ${selectedConversation === conv.id ? 'active' : ''} ${conv.unread > 0 ? 'unread' : ''}`}
                    onClick={() => setSelectedConversation(conv.id)}
                  >
                    <div className="conversation-avatar">{conv.avatar}</div>
                    <div className="conversation-info">
                      <p className="conversation-name">{conv.name}</p>
                      <p className="conversation-preview">{conv.lastMessage}</p>
                    </div>
                    <div className="conversation-meta">
                      <p className="conversation-time">{conv.lastMessageTime}</p>
                      {conv.unread > 0 && <span className="unread-badge">{conv.unread}</span>}
                    </div>
                  </div>
                ))}
              </div>

              {selectedConversation !== null && (
                <div className="dm-chat">
                  {(() => {
                    const activeConv = conversations.find(c => c.id === selectedConversation);
                    return (
                      <>
                        <div className="chat-header">
                          <div className="chat-user">
                            <span className="avatar">{activeConv.avatar}</span>
                            <div>
                              <p className="user-name">{activeConv.name}</p>
                              <p className="user-handle">{activeConv.handle}</p>
                            </div>
                          </div>
                        </div>

                        <div className="messages-container">
                          {activeConv.messages.map((msg) => (
                            <div key={msg.id} className={`message ${msg.isOwn ? 'own' : 'other'}`}>
                              <div className="message-content">{msg.text}</div>
                              <div className="message-time">{msg.timestamp}</div>
                            </div>
                          ))}
                        </div>

                        <div className="message-input-box">
                          <input
                            type="text"
                            placeholder="Type a message..."
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            className="message-input"
                          />
                          <button className="send-btn" onClick={handleSendMessage}>Send</button>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

              {selectedConversation === null && (
                <div className="dm-empty">
                  <p>Select a conversation to start chatting</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
