const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { sendNotification,getUnreadNotifications,markAsReadNotification,markAllAsReadNotification,deleteAllNotifications } = require('../services/notificationService')

const sendNotif=async(req,res)=>{
    const {msg,recipient,type} = req.body
    try {
        const users = await prisma.user.findMany({
            where: {
                role: recipient,
            },
            select: {
                user_id: true,
            },
        })
        if (users.length >0 ) {
            for (const user of users) {
                const notification = await sendNotification(msg, user.user_id,type)
                console.log('Notification sent:', notification)
            }
            res.status(200).json({ message: 'Notifications sent successfully' })
        }

    } catch (error) {
        console.error('Error sending notification:', error)
        res.status(500).json({ error: `Erreur lors de l'envoi de la notification` })
    }
}


// ** revevoir des notifications non lues(id_utilisateur)
const getUnreadNotif = async (req, res) => {
    const { email } = req.params
    try {
        const user = await prisma.user.findFirst({
            where: {
                email: email,
            },
            select: {
                user_id: true,
            },
        })
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' })
        }
        const user_id = user.user_id
        const notifications = await getUnreadNotifications(user_id)
        res.status(200).json(notifications)
    } catch (error) {
        console.error('Erreur lors de la récupération des notifications non lues:', error)
        res.status(500).json({ error: 'Erreur lors de la récupération des notifications non lues' })
    }

}

// ** marquer une notification comme lue(id_notification+id_utilisateur)
const markAsReadNotif = async (req, res) => {
    const { email,notification_id } = req.body;
    try {
        const user = await prisma.user.findFirst({
            where: {
                email: email,
            },
            select: {
                user_id: true,
            },
        })
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé !' })
        }
        const user_id = user.user_id;
        await markAsReadNotification(notification_id, user_id);
        res.status(200).json({ message: 'Notification markée comme lue' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la notification:', error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour de la notification' });
    }
}

// ** marquer des notifications comme lues(id_utilisateur+id_notification)
const markAllAsReadNotif = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await prisma.user.findFirst({
            where: {
                email: email,
            },
            select: {
                user_id: true,
            },
        })
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé !' })
        }
        const user_id = user.user_id;
        await markAllAsReadNotification(user_id);
        res.status(200).json({ message: 'Notifications markées comme lues'});
    } catch (error) {
        console.error('Erreur lors de la mise à jour des notifications:', error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour des notifications' });
    }
}

// ** supprimer toutes les notifications(id_utilisateur)
const deleteAllNotif = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await prisma.user.findFirst({
            where: {
                email: email,
            },
            select: {
                user_id: true,
            },
        })
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé !' })
        }
        const user_id = user.user_id;
        await deleteAllNotifications(user_id);
        res.status(200).json({ message: 'Notifications supprimées avec succès'});
    } catch (error) {
        console.error('Erreur lors de la suppression des notifications:', error);
        res.status(500).json({ error: 'Erreur lors de la suppression des notifications' });
    }
}

module.exports = {
    sendNotif,
    getUnreadNotif,
    markAsReadNotif,
    markAllAsReadNotif,
    deleteAllNotif,
}