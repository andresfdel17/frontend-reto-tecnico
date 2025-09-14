import React from 'react';
import { Dropdown, Badge, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCheck, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNotifications } from '@hooks';
import { useTranslation } from 'react-i18next';
import type { INotification } from '@types';

export const NotificationDropdown: React.FC = () => {
    const { t } = useTranslation();
    const {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        formatTime,
    } = useNotifications();

    const getNotificationIcon = (type: INotification['type']) => {
        switch (type) {
            case 'success': return '✅';
            case 'warning': return '⚠️';
            case 'error': return '❌';
            default: return 'ℹ️';
        }
    };

    const getNotificationClass = (type: INotification['type']) => {
        switch (type) {
            case 'success': return 'text-success';
            case 'warning': return 'text-warning';
            case 'error': return 'text-danger';
            default: return 'text-info';
        }
    };

    return (
        <Dropdown align="end" className='mt-2'>
            <Dropdown.Toggle 
                variant="link" 
                size="sm"
                className="nav-link position-relative p-1"
                style={{ border: 'none', background: 'none' }}
            >
                <FontAwesomeIcon icon={faBell} />
                {unreadCount > 0 && (
                    <Badge 
                        bg="danger" 
                        pill 
                        className="position-absolute top-0 start-100 translate-middle"
                        style={{ fontSize: '0.7rem' }}
                    >
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </Badge>
                )}
            </Dropdown.Toggle>

            <Dropdown.Menu 
                className="shadow-lg border-0"
                style={{ 
                    width: 'min(320px, calc(100vw - 30px))', 
                    maxHeight: '400px', 
                    overflowY: 'auto',
                    right: '10px',
                    left: 'auto'
                }}
            >
                <div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom">
                    <h6 className="mb-0 fw-bold">{t("notifications")}</h6>
                    <div>
                        {unreadCount > 0 && (
                            <Button
                                variant="link"
                                size="sm"
                                className="p-1 me-2"
                                onClick={markAllAsRead}
                                title="Marcar todas como leídas"
                            >
                                <FontAwesomeIcon icon={faCheck} />
                            </Button>
                        )}
                        {notifications.length > 0 && (
                            <Button
                                variant="link"
                                size="sm"
                                className="p-1 text-danger"
                                onClick={clearNotifications}
                                title="Limpiar todas"
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </Button>
                        )}
                    </div>
                </div>

                {notifications.length === 0 ? (
                    <div className="text-center py-4 text-muted">
                        <FontAwesomeIcon icon={faBell} size="2x" className="mb-2 opacity-50" />
                        <p className="mb-0">{t("no-notifications")}</p>
                    </div>
                ) : (
                    <div className="py-1">
                        {notifications.slice(0, 10).map((notification) => (
                            <Dropdown.Item
                                key={notification.id}
                                className={`px-3 py-2 border-0 ${!notification.read ? 'bg-light' : ''}`}
                                onClick={() => !notification.read && markAsRead(notification.id)}
                                style={{ cursor: notification.read ? 'default' : 'pointer' }}
                            >
                                <div className="d-flex align-items-start">
                                    <span className="me-2 mt-1">
                                        {getNotificationIcon(notification.type)}
                                    </span>
                                    <div className="flex-grow-1">
                                        <div 
                                            className={`small ${getNotificationClass(notification.type)} ${!notification.read ? 'fw-bold' : ''}`}
                                            style={{ 
                                                fontSize: '0.85rem',
                                                lineHeight: '1.3',
                                                wordBreak: 'break-word'
                                            }}
                                        >
                                            {notification.message}
                                        </div>
                                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                                            {formatTime(notification.timestamp)}
                                            {notification.from && notification.from !== 'system' && (
                                                <span className="ms-1">• {notification.from}</span>
                                            )}
                                        </div>
                                    </div>
                                    {!notification.read && (
                                        <div 
                                            className="bg-primary rounded-circle ms-2 mt-1"
                                            style={{ width: '8px', height: '8px' }}
                                        />
                                    )}
                                </div>
                            </Dropdown.Item>
                        ))}
                        
                        {notifications.length > 10 && (
                            <div className="text-center py-2 border-top">
                                <small className="text-muted">
                                    {t("showing-notifications", { count: notifications.length })}
                                </small>
                            </div>
                        )}
                    </div>
                )}
            </Dropdown.Menu>
        </Dropdown>
    );
};
