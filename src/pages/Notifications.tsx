
import React from 'react';
import { Bell, Heart, MessageCircle, Repeat } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type NotificationType = 'like' | 'comment' | 'mirror' | 'follow' | 'mention';

interface Notification {
  id: string;
  type: NotificationType;
  timestamp: string;
  user: {
    username: string;
    displayName: string;
    avatar?: string;
  };
  content?: string;
  postId?: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'like',
    timestamp: '2023-04-05T14:48:00.000Z',
    user: {
      username: 'lens_protocol',
      displayName: 'Lens Protocol',
      avatar: 'https://pbs.twimg.com/profile_images/1510169595379494912/I9Z1YJnw_400x400.jpg'
    },
    postId: '1'
  },
  {
    id: '2',
    type: 'comment',
    timestamp: '2023-04-04T09:23:00.000Z',
    user: {
      username: 'vitalik',
      displayName: 'Vitalik.eth',
      avatar: 'https://pbs.twimg.com/profile_images/977496875887558661/L86xyLF4_400x400.jpg'
    },
    content: 'Great insights! Would love to collaborate on this.',
    postId: '3'
  },
  {
    id: '3',
    type: 'mirror',
    timestamp: '2023-04-03T12:15:00.000Z',
    user: {
      username: 'blocksuser',
      displayName: 'Blocks Official',
      avatar: undefined
    },
    postId: '2'
  },
  {
    id: '4',
    type: 'follow',
    timestamp: '2023-04-02T18:30:00.000Z',
    user: {
      username: 'cryptoenthusiast',
      displayName: 'Crypto Enthusiast',
      avatar: undefined
    }
  },
  {
    id: '5',
    type: 'mention',
    timestamp: '2023-04-01T10:05:00.000Z',
    user: {
      username: 'web3developer',
      displayName: 'Web3 Dev',
      avatar: 'https://pbs.twimg.com/profile_images/1510169595379494912/I9Z1YJnw_400x400.jpg'
    },
    content: "Hey @you, check out this new tool I built for the Blocks ecosystem!",
    postId: '4'
  }
];

const NotificationItem = ({ notification }: { notification: Notification }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'like':
        return <Heart className="h-4 w-4 text-blocks-error" />;
      case 'comment':
        return <MessageCircle className="h-4 w-4 text-blocks-accent" />;
      case 'mirror':
        return <Repeat className="h-4 w-4 text-blocks-success" />;
      case 'follow':
      case 'mention':
        return <Bell className="h-4 w-4 text-blocks-accent" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationText = (notification: Notification) => {
    switch (notification.type) {
      case 'like':
        return 'liked your post';
      case 'comment':
        return 'commented on your post';
      case 'mirror':
        return 'mirrored your post';
      case 'follow':
        return 'followed you';
      case 'mention':
        return 'mentioned you';
      default:
        return 'interacted with you';
    }
  };

  return (
    <div className="flex items-start gap-3 p-4 border-b border-white/10 hover:bg-white/5 transition-colors">
      <Avatar className="h-10 w-10">
        <AvatarImage src={notification.user.avatar} />
        <AvatarFallback>{notification.user.displayName.slice(0, 2)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          {getNotificationIcon(notification.type)}
          <span className="text-sm font-medium">{notification.user.displayName}</span>
          <span className="text-sm text-muted-foreground">@{notification.user.username}</span>
          <span className="text-xs text-muted-foreground ml-auto">{formatDate(notification.timestamp)}</span>
        </div>
        <p className="text-sm">
          {getNotificationText(notification)}
        </p>
        {notification.content && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{notification.content}</p>
        )}
      </div>
    </div>
  );
};

const Notifications = () => {
  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <div className="sticky top-0 z-10 backdrop-blur-md bg-blocks-background/70 border-b border-white/10 px-4">
          <h1 className="text-xl font-bold py-4">Notifications</h1>
          <Tabs defaultValue="all">
            <TabsList className="w-full bg-transparent border-b border-white/10">
              <TabsTrigger 
                value="all" 
                className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-blocks-accent rounded-none"
              >
                All
              </TabsTrigger>
              <TabsTrigger 
                value="mentions" 
                className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-blocks-accent rounded-none"
              >
                Mentions
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              <div className="divide-y divide-white/10">
                {mockNotifications.map(notification => (
                  <NotificationItem key={notification.id} notification={notification} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="mentions" className="mt-0">
              <div className="divide-y divide-white/10">
                {mockNotifications
                  .filter(n => n.type === 'mention')
                  .map(notification => (
                    <NotificationItem key={notification.id} notification={notification} />
                  ))
                }
                {mockNotifications.filter(n => n.type === 'mention').length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">
                    <p>No mentions yet</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default Notifications;
