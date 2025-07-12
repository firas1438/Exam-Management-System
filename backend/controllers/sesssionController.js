const {
    getAllSessions,
    validateSessionCreation,
    createSession,
    getCurrentSession,
  } = require('../services/sessionService');

const getSessions = async (req, res) => {
    try{
        const sessions = await getAllSessions();
        res.status(200).json(sessions);
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'erreur lors de la récupération des sessions' });
    }
}

const addSession = async (req, res) => {
    try {
        const { sessionType, startDate, endDate } = req.body;
        
        if (!sessionType || !startDate || !endDate) {
            return res.status(400).json({ error: 'Veuillez fournir tous les champs requis' });
        }
        const dateDebut = new Date(startDate).toISOString();
        const dateFin = new Date(endDate).toISOString();
        await validateSessionCreation(sessionType, dateDebut);

        const newSession = await createSession(sessionType, dateDebut, dateFin);
        res.status(201).json(newSession);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'erreur lors de la création de la session:', err });
    }
}

const getLastSession = async (req, res) => {
    try {
        const currentSession = await getCurrentSession();
        res.status(200).json(currentSession);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'erreur lors de la récupération de la session actuelle' });
    }
}


module.exports = {
    getSessions,
    addSession,
    getLastSession
}