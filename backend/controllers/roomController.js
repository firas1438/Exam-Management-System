const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const {itemPerPage}=require('../config/settings')
const {addLog} =require('../services/schedulelogService')

// rooms controllers

const getAllRooms = async (req, res) => {
  const {page}=req.params
    try{
        const rooms = await prisma.room.findMany(
            {
                select:{
                    room_id:true,
                    room_name:true,
                    location:true,
                    capacity:true,
                    is_available:true,
                },
            take:itemPerPage,
            skip:itemPerPage * (page-1)
            },
        );
        res.status(200).json(rooms);
    }catch(err){
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des salles' });
    }
}

const reserveExamSlot = async (req, res) => {
    const { exam_id, room_id, start_time, end_time } = req.body
    try {
      const examDate= await prisma.exam.findUnique({
        where:{
            exam_id:parseInt(exam_id),
        },
        select:{
            exam_date:true,
            subject:{
                select:{
                    subject_id:true,
                    name:true,
                    filiere_name:true
                }
            },
        }
      })
      let date=new Date(examDate.exam_date).toISOString().slice(0,11);
      console.log(date)
        // Convertir les heures reçues en format complet DateTime avec une date arbitraire
      const startDateTime = new Date(date+start_time+':00');
      const endDateTime = new Date(date+end_time+':00');
      startDateTime.setMinutes(startDateTime.getMinutes() - startDateTime.getTimezoneOffset());
      endDateTime.setMinutes(endDateTime.getMinutes() - endDateTime.getTimezoneOffset());
      console.log(startDateTime,endDateTime)
      //vérifier que l'examen n'est pas déjà réservé
      const isReserved = await prisma.examroom.findFirst({
        where:{
            exam_id:parseInt(exam_id),
        }
      })

      if(isReserved){
        return res.status(409).json({
          error: "Cet examen est déjà réservé !",});
      }

      // vérifier que tous le examens de la méme filiére sont en méme temps 
      const existingExams = await prisma.examroom.findMany({
        where: {
          exam: {
            subject: {
              filiere_name: examDate.subject.filiere_name,
              subject_id: examDate.subject.subject_id,
            },
          },

        },
        select: {
          end_time: true,
          start_time: true,
          }
      });
      if (existingExams.length > 0) {
        const firstStartTime = new Date(existingExams[0].start_time);
        const firstEndTime = new Date(existingExams[0].end_time);
        const sameStartTime = firstStartTime.getTime() === startDateTime.getTime();
        const sameEndTime = firstEndTime.getTime() === endDateTime.getTime();
        if (!sameStartTime || !sameEndTime) {
          return res.status(409).json({
            error: "Tous les examens d'une matière doivent etre réservés au même moment.",
          });
        }
      }
      // Vérifier les conflits dans la salle donnée
      const conflicts = await prisma.examroom.findFirst({
        where: {
          room_id: parseInt(room_id),
            AND: [
                { start_time: { lte: endDateTime } },
                { end_time: { gte: startDateTime } },
                 ],
        },
      });
  
      if (conflicts) {
        return res.status(409).json({
          error: "Ce créneau horaire est déjà réservé dans cette salle.",
        });
      }
      const user_id=await prisma.user.findFirst({
        where:{
          role:"ADMIN"
        },
        select:{
          user_id:true
        }
      })
      const log={
        action:"Modification",
        description:`l'examen pour le sujet ${examDate.subject.name} de la filiere ${examDate.subject.filiere_name} a été resérvé`,
        performed_by:user_id.user_id
      }
      await addLog(log);
      // Réserver le créneau
       await prisma.examroom.create({
        data: {
          exam_id: parseInt(exam_id),
          room_id: parseInt(room_id),
          start_time: startDateTime, 
          end_time: endDateTime,
        },
      });
       
    return res.status(201).json({ message: "Créneau réservé avec succès" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Une erreur est survenue lors de la réservation." });
    }
  };
  
const updateExamRoom = async (req, res) => {
  const {exam_id,room_id}=req.params;
  const { new_room_id } = req.body;
  try{
    const currentExam = await prisma.examroom.findUnique({
      where: {
        exam_id_room_id: {
          room_id: parseInt(room_id),
          exam_id: parseInt(exam_id),
        },
      },
    });
    if (!currentExam) {
      return res.status(404).json({ error: "Affectation introuvable." });
    }
    
    const { start_time, end_time } = currentExam
    const conflictingAssignments = await prisma.examroom.findFirst({
      where: {
        room_id: parseInt(new_room_id),
        AND: [
          {
            start_time: {
              lte: end_time, // Commence avant la fin de l'examen
            },
          },
          {
            end_time: {
              gte: start_time, // Termine après le début de l'examen
            },
          },
        ],
      },
    });

    if (conflictingAssignments) {
      return res.status(400).json({
        error: "La nouvelle salle est déjà réservée pour cet horaire.",
        conflictingAssignments,
      });
    }

    const updateExamRoom = await prisma.examroom.update({
      where: {
        exam_id_room_id: {
          room_id: parseInt(room_id),
          exam_id: parseInt(exam_id),
        },
      },
      data: {
        room_id: parseInt(new_room_id),
      },
    });

    return res.status(200).json({message: "Salle mise à jour avec succès.", updateExamRoom,});

  }catch(err){
    res.status(500).json({ error: "Une erreur est survenue lors de la mise à jour.",err });
  }
}

module.exports = {
    getAllRooms,
    reserveExamSlot,
    updateExamRoom,
}