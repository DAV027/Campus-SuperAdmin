package com.example.service;

import com.example.model.Notification;
import com.example.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {
    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public List<Notification> getAllNotifications() {
        return notificationRepository.findAllByOrderByTimestampDesc();
    }

    public Notification createNotification(Notification notification) {
        notification.setTimestamp(java.time.LocalDateTime.now());
        notification.setRead(false);
        Notification saved = notificationRepository.save(notification);
        System.out.println("Notification saved: " + saved.getId() + " - " + saved.getMessage());
        return saved;
    }

    public Notification markAsRead(Long id) {
        Notification n = notificationRepository.findById(id).orElseThrow();
        n.setRead(true);
        return notificationRepository.save(n);
    }

    public void markAllAsRead() {
        notificationRepository.findAll().forEach(n -> {
            if (!n.isRead()) {
                n.setRead(true);
                notificationRepository.save(n);
            }
        });
    }
}
