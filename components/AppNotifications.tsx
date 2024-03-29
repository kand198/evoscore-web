import { Notification, ScrollArea, Stack } from '@mantine/core';
import { Check, X } from 'tabler-icons-react';
import useNotifications, { INotification } from '../lib/NotificationContext';

const AppNotifications = () => {
  const { notifications, removeNotification } = useNotifications();

  const getNotificationIcon = (notification: INotification) => {
    switch (notification?.type) {
      case 'success':
        return <Check size={18} />;
      case 'failure':
        return <X size={18} />;
      default:
        return null;
    }
  };

  const getNotificationTitle = (notification: INotification) =>
    notification.title || (notification!.type.at(0)?.toUpperCase() || '') + notification!.type.slice(1);

  const getNotificationColour = (notification: INotification) => {
    switch (notification?.type) {
      case 'success':
        return 'green';
      case 'failure':
        return 'red';
      default:
        return 'orange';
    }
  };

  return (
    <ScrollArea
      type='hover'
      className={(notifications || []).length > 0 ? '!fixed right-0 top-0 mt-4 mb-4 pb-8 ml-8 mr-4 pr-4 max-w-md h-full' : 'hidden'}
      style={{ zIndex: 110 }}
    >
      <Stack className='h-full' style={{ zIndex: 110 }}>
        {notifications?.map((notification, i) => (
          <Notification
            icon={getNotificationIcon(notification)}
            title={getNotificationTitle(notification)}
            color={getNotificationColour(notification)}
            className='bg-white/30 backdrop-blur-md'
            classNames={{ title: 'text-lg' }}
            onClose={() => removeNotification!(notification)}
            // eslint-disable-next-line react/no-array-index-key
            key={i}
          >
            {notification.content}
          </Notification>
        ))}
      </Stack>
    </ScrollArea>
  );
};

export default AppNotifications;
