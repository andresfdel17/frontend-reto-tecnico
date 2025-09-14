import { useState, useEffect, useCallback } from 'react';
import { useSocket } from './useSocket';
import { useAuth } from '@contexts';
import type { INotification } from '@types';

export function useNotifications() {
    const [notifications, setNotifications] = useState<INotification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const { token } = useAuth();
    const socket = useSocket('http://localhost:3000');

    // Agregar nueva notificación
    const addNotification = useCallback((notification: Omit<INotification, 'id' | 'read'>) => {
        const newNotification: INotification = {
            ...notification,
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            read: false,
        };

        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);
    }, []);

    // Marcar notificación como leída
    const markAsRead = useCallback((notificationId: string) => {
        setNotifications(prev => 
            prev.map(notification => 
                notification.id === notificationId 
                    ? { ...notification, read: true }
                    : notification
            )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
    }, []);

    // Marcar todas como leídas
    const markAllAsRead = useCallback(() => {
        setNotifications(prev => 
            prev.map(notification => ({ ...notification, read: true }))
        );
        setUnreadCount(0);
    }, []);

    // Limpiar notificaciones
    const clearNotifications = useCallback(() => {
        setNotifications([]);
        setUnreadCount(0);
    }, []);

    // Formatear tiempo relativo
    const formatTime = useCallback((timestamp: string) => {
        const now = new Date();
        const notificationTime = new Date(timestamp);
        const diffInMinutes = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60));

        if (diffInMinutes < 1) return 'Ahora';
        if (diffInMinutes < 60) return `${diffInMinutes}m`;
        
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays}d`;
    }, []);

    // Configurar Socket.io
    useEffect(() => {
        if (socket && token) {
            // Autenticar con el servidor
            socket.emit('authenticate', { token });

            // Escuchar confirmación de autenticación
            socket.on('authenticated', () => {
                //console.log('🔐 Socket authenticated for:', data.email);
            });

            // Escuchar errores de autenticación
            socket.on('authentication-error', () => {
                //console.error('❌ Socket authentication failed:', data.message);
            });

            socket.on('login-success', (data) => {
                addNotification({
                    message: `${data.userName}`,
                    type: 'success',
                    timestamp: data.timestamp,
                    from: 'system',
                });
            });

            // Escuchar notificaciones privadas
            socket.on('private-notification', (data) => {
                addNotification({
                    message: data.message,
                    type: data.type || 'info',
                    timestamp: data.timestamp,
                    from: data.from || 'system',
                });
            });

            // Escuchar notificaciones generales
            socket.on('notification', (data) => {
                addNotification({
                    message: data.message,
                    type: data.type || 'info',
                    timestamp: data.timestamp,
                    from: data.from || 'system',
                });
            });

            // Escuchar actualizaciones de estado del sistema
            socket.on('system-status-update', (data) => {
                addNotification({
                    message: `Estado del sistema: ${data.details || data.status}`,
                    type: data.status === 'maintenance' ? 'warning' : 'info',
                    timestamp: data.timestamp,
                    from: 'system',
                });
            });

            return () => {
                socket.off('authenticated');
                socket.off('authentication-error');
                socket.off('login-success');
                socket.off('private-notification');
                socket.off('notification');
                socket.off('system-status-update');
            };
        }
    }, [socket, token, addNotification]);

    return {
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        formatTime,
    };
}
