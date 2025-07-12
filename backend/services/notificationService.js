const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function sendNotification(msg, user_id,type) {
    try {
        const notification = await prisma.notification.create({
            data: {
                message: msg,
                user_id: user_id,
                notification_type: type,
                notification_status: "ENVOYEE"
            },
        })
        return notification
    } catch (error) {
        console.error('Error sending notification:', error)
        throw error
    }
}

async function getUnreadNotifications(user_id) {
    try {
        const notifications = await prisma.notification.findMany({
            where: {
                user_id: user_id,
                NOT: {
                    notification_status: "ARCHIVEE"
                  }
            },
            orderBy: {
                created_at: 'desc',
            },
        })
        return notifications
    } catch (error) {
        console.error('Erreur lors de la récupération des notifications non lues:', error)
        throw error
    }
}

async function markAsReadNotification(notification_id, user_id) {
    try {
        const notification = await prisma.notification.update({
            where: {
                notification_id: notification_id,
                user_id: user_id,
            },
            data: {
                notification_status: "LUE",
            },
        })
        return notification
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la notification:', error)
        throw error
    }
}

async function markAllAsReadNotification(user_id) {
    try {
        const notifications = await prisma.notification.updateMany({
            where: {
                user_id: user_id,
                notification_status: "ENVOYEE",
            },
            data: {
                notification_status: "LUE",
            },
        })
        return notifications
    } catch (error) {
        console.error('Erreur lors de la mise à jour de toutes les notifications:', error)
        throw error
    }
}

async function deleteAllNotifications(user_id) {
    try {
        const notifications = await prisma.notification.deleteMany({
            where: {
                user_id: user_id,
            },
        })
        return notifications
    } catch (error) {
        console.error('Erreur lors de la suppression de toutes les notifications:', error)
        throw error
    }
}

module.exports = {
    sendNotification,
    getUnreadNotifications,
    markAsReadNotification,
    markAllAsReadNotification,
    deleteAllNotifications,
}