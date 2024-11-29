'use client'

import React, { createContext, useState, useContext, useEffect } from 'react'
import api from '../services/api'
import { useAuth } from './AuthContext'

interface Notification {
  _id: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  createdAt: string
  read: boolean
}

type NotificationContextType = {
  notifications: Notification[]
  markAsRead: (id: string) => void
  clearAll: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      const fetchNotifications = async () => {
        try {
          const response = await api.get('/notifications')
          setNotifications(response.data)
        } catch (error) {
          console.error('Error fetching notifications:', error)
        }
      }
      fetchNotifications()

      // Set up WebSocket connection for real-time notifications
      const socket = new WebSocket(process.env.NEXT_PUBLIC_WS_URL as string)
      socket.onmessage = (event) => {
        const newNotification = JSON.parse(event.data)
        setNotifications(prev => [newNotification, ...prev])
      }

      return () => {
        socket.close()
      }
    }
  }, [user])

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`)
      setNotifications(notifications.map(notif =>
        notif._id === id ? { ...notif, read: true } : notif
      ))
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const clearAll = async () => {
    try {
      await api.delete('/notifications')
      setNotifications([])
    } catch (error) {
      console.error('Error clearing notifications:', error)
    }
  }

  return (
    <NotificationContext.Provider value={{ notifications, markAsRead, clearAll }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

