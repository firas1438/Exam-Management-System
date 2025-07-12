const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllSessions = async () => {
  return prisma.session.findMany({});
};

const validateSessionCreation = async (sessionType, startDate) => {
  const year = new Date(startDate).getFullYear();
  
  const existingSession = await prisma.session.findFirst({
    where: {
      session_type:sessionType,
      date_debut: {
        gte: new Date(`${year}-01-01`),
        lte: new Date(`${year}-12-31`)
      }
    }
  });
  if (existingSession) {
    throw new Error(`Une session de type ${sessionType} existe déjà pour ${year}`);
  }

  const existingUnvalidated = await prisma.session.findFirst({
    where: { is_validated: false }
  });
  if (existingUnvalidated) {
    throw new Error('Une session non validée existe déjà');
  }
};

const createSession = async (sessionType, startDate, endDate) => {
  return prisma.session.create({
    data: { session_type: sessionType, date_debut: startDate, date_fin: endDate }
  });
};

const getCurrentSession = async () => {
  return prisma.session.findFirst({
    where: {
      is_validated:false
    },
    orderBy: {
      date_debut: 'desc'
    }
  });
}

const getSessionById = async (id) => {
  return prisma.session.findUnique({
    where: { session_id:id }
  });
}

const autoValidateSession = async () => {

  const today = new Date();
  const fourDaysLater = new Date();
  fourDaysLater.setDate(today.getDate() + 4);

  const todayStr = today.toISOString().split('T')[0];
  const fourDaysLaterStr = fourDaysLater.toISOString().split('T')[0];

  const alreadyRun = await prisma.schedulelog.findFirst({
    where: {
      action: 'SESSION_AUTO_VALIDATION',
      timestamp: {
        gte: new Date(todayStr) 
      }
    }
  });

  if (alreadyRun) return { message: "auto-validation est déja effectuée" };

  const sessionsToValidate = await prisma.session.findFirst({
    where: {
      is_validated: false,
      date_debut: {
        equals: new Date(fourDaysLaterStr) 
      }
    },
    select: {
      session_id: true,
      date_debut: true
    }
  });

  if (!sessionsToValidate) {
    return { validated: false, message: 'pas de session à valider' };
  }

  const validationResults= await prisma.$transaction(async (prisma) => {

    await prisma.session.update({
      where: { session_id: sessionsToValidate.session_id },
      data: { is_validated: true }
    });
    const user = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
      select: { user_id: true }
    });

    await prisma.schedulelog.create({
      data: {
        action: 'SESSION_AUTO_VALIDATION',
        description: `Auto-validé ${sessionsToValidate.length} sessions pour ${fourDaysLaterStr}`,
        performed_by: user.user_id,
        timestamp: new Date()
      }
    })
  })
  return { validated: true, sessionId: sessionsToValidate.session_id,message: 'session validée avec succès' };

}

module.exports = {
  getAllSessions,
  validateSessionCreation,
  createSession,
  getCurrentSession,
  getSessionById,
  autoValidateSession,
};