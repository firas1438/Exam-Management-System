const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const {itemPerPage}=require('../config/settings')
const {addLog} =require('../services/schedulelogService')
const {getSessionById}=require('../services/sessionService')
const {getExams,getExam}=require('../services/examServices')
// exams controllers

const getAllExams = async (req, res) => {
  const {page,session_id}=req.params
    try {
      const session=await getSessionById(parseInt(session_id))
      if (!session) {
        return res.status(404).json({ error: "Session introuvable" });
      }
      if(session.is_validated===true){
        return res.status(400).json({ error: "Vous devez créer une session" });
      }
      const exams= await getExams(page,parseInt(session_id))
          res.status(200).json(exams);
      } catch (error) {
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des examens' });
      }
}

const getExamsBySessionId=async (req, res) => {
  const {selectedSession}=req.params
    try {
      const session=await getSessionById(parseInt(selectedSession))
      if (!session) {
        return res.status(404).json({ error: "Session introuvable" });
      }
      const exams= await getExams(parseInt(selectedSession))
          if(exams){
            res.status(200).json(exams);
          }
          else{
            res.status(404).json({ error: "vous n'avez pas encore ajouter des examens pour cette session" });
          }
          
      } catch (error) {
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des examens' });
      }
}

const getExamById=async(req,res)=>{
  const {id}=req.params
  try {
    const exam= await getExam(parseInt(id))
    if (!exam) {
      return res.status(404).json({ error: "Examen introuvable" });
    }
      return res.status(200).json(exam);
  } catch (error) {
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération de cet examen' });
  }
}

const getExamsByRoomId = async (req, res) => {
  const { room_id, } = req.params;
  try{
    const exams = await prisma.examroom.findMany({
      where: {
        room_id: parseInt(room_id),
      },
      select:{
        start_time:true,
        end_time:true,
        exam_id:true,
        exam:{
          select:{
            exam_date:true,
            duration:true,
            subject:{
              select:{
                name:true,
                filiere_name:true,
              }
            }
          }
        }
      }
    });
    
    res.status(200).json(exams);
  } catch {
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des examens' });
  }
}

const getExamsBySupervisorId = async (req, res) => {
  const { supervisor_id } = req.params;
  try{
    const exams = await prisma.supervisorexam.findMany({
      where: {
        supervisor_id: parseInt(supervisor_id),
      },
      select:{
        exam_id:true,
        start_time:true,
        end_time:true,
        exam:{
          select:{
            exam_date:true,
            duration:true,
            subject:{
              select:{
                name:true,
                coefficient:true,
                filiere_name:true,
              }
            }
          }
        },
        room:{
          select:{
            room_name:true  
          }
        }
      }
    })
    console.log(exams)
    res.status(200).json(exams);
  } catch {
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des examens' });
  }
}

const getAllAssignedExams = async (req, res) => {
  try{
    const exams = await prisma.supervisorexam.findMany({
      select:{
        exam_id:true,
        start_time:true,
        end_time:true,
        exam:{
          select:{
            exam_date:true,
            duration:true,
            subject:{
              select:{
                name:true,
                coefficient:true,
                filiere_name:true,
              }
            }
          }
        },
        room:{
          select:{
            room_name:true  
          }
        }
      }
    })
    console.log(exams)
    res.status(200).json(exams);
  } catch {
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des examens' });
  } 
}

const getNotReservedExams = async (req, res) => {
    try {
        const exams= await prisma.exam.findMany({
            select:{
              exam_id:true,
              exam_date:true,
              duration:true,
              subject:{
                select:{
                    name:true,
                    coefficient:true,
                    filiere_name:true,
                }
              },
              examroom:true,
            },
          });
          const notReservedExams = exams.filter(exam => exam.examroom === null);
          res.status(200).json(notReservedExams);
      } catch (error) {
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des examens' });
      }
}

const getExamsByDeaprtment = async (req, res) => {
  const { user_id,page } = req.params;
  try{
    const result = await prisma.$transaction(async (prisma) => {
      const dep= await prisma.teacher.findUnique({
        where: {
            user_id: parseInt(user_id),
        },
        select: {
            department_id: true,
        },
        
    })
    const exams = await  prisma.supervisorexam.findMany({
      where: {
        exam: { 
          subject: {
            department_id: dep.department_id

          }
        },
      },
      select:{
        exam_id:true,
        start_time:true,
        end_time:true,
        validated_by_hod:true,
        teacher:{
          select:{
            user:{
              select:{
              name:true
              }
          }

          }
        },
        exam:{
          select:{
            exam_date:true,
            duration:true,
            subject:{
              select:{
                name:true,
                coefficient:true,
                filiere_name:true,
              }
            }
          }
        },
        room:{
          select:{
            room_name:true  
          }
        }
      },
      take:itemPerPage,
      skip:itemPerPage * (page-1)
    })
    console.log(dep,exams)
    res.status(200).json(exams);
  })
  }catch{
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des examens' });
  }
}

const getNotValidatedExamsByDeaprtment = async (req, res) => {
  const { user_id,page } = req.params;
  try{
    const result = await prisma.$transaction(async (prisma) => {
      const dep= await prisma.teacher.findUnique({
        where: {
            user_id: parseInt(user_id),
        },
        select: {
            department_id: true,
        },
    })
    const exams = await  prisma.supervisorexam.findMany({
      where: {
        exam: { 
          subject: {
            department_id: dep.department_id  
          }
        },
        validated_by_hod: false,
      },
      select:{
        exam_id:true,
        start_time:true,
        end_time:true,
        teacher:{
          select:{
            user:{
              select:{
              name:true
              }
          }

          }
        },
        exam:{
          select:{
            exam_date:true,
            duration:true,
            subject:{
              select:{
                name:true,
                coefficient:true,
                filiere_name:true,
              }
            }
          }
        },
        room:{
          select:{
            room_name:true  
          }
        }
      },
      take:itemPerPage,
      skip:itemPerPage * (page-1)
    })
    console.log(exams)
    res.status(200).json(exams);
  })
  }catch{
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des examens' });
  }
}

const getValidatedExamsByDeaprtment = async (req, res) => {
  const { user_id,page } = req.params;
  try{
    const result = await prisma.$transaction(async (prisma) => {
      const dep= await prisma.teacher.findUnique({
        where: {
            user_id: parseInt(user_id),
        },
        select: {
            department_id: true,
        },
    })
    console.log(dep)
    const exams = await  prisma.supervisorexam.findMany({
      where: {
        AND: [
          {
            exam: {
              subject: {
                department_id: dep.department_id
              }
            }
          },
          {
            validated_by_hod: true
          }
        ]
      },
      select:{
        exam_id:true,
        start_time:true,
        end_time:true,
        teacher:{
          select:{
            user:{
              select:{
              name:true
              }
          }

          }
        },
        exam:{
          select:{
            exam_date:true,
            duration:true,
            subject:{
              select:{
                name:true,
                coefficient:true,
                filiere_name:true,
              }
            }
          }
        },
        room:{
          select:{
            room_name:true  
          }
        }
      },
      take:itemPerPage,
      skip:itemPerPage * (page-1)
    })
    console.log(exams)
    res.status(200).json(exams);
  })
  }catch{
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des examens' });
  }
}

// const getNotValidatedExamsByDirector = async (req, res) => {
//   try{
//     const exams = await prisma.supervisorExam.findMany({
//       where: {
//         validated_by_director: false,
//       },
//       select:{
//         FkTeacher:{
//           select:{
//             FkUser:{
//               select:{
//               name:true
//               }
//           }

//           }
//         },
//         fKExam:{
//           select:{
//             FkSubject:{
//               select:{
//                 name:true
//               }
//             }
//           }
//         }
//       }
//     });
//     res.status(200).json(exams);
//   }catch{
//     res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des examens' });
//   }
// }

// const getValidatedExamsByDirector = async (req, res) => {
//   try{
//     const exams = await prisma.supervisorExam.findMany({
//       where: {
//         validated_by_director: true,
//       },
//     });
//     res.status(200).json(exams);
//   }catch{
//     res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des examens' });
//   }
// }

const getPlanningForDirector = async (req, res) => {
  const {page}=req.params
  try{
    const exams = await  prisma.supervisorexam.findMany({
      where: {
        validated_by_director:false
      },
      select:{
        exam_id:true,
        start_time:true,
        end_time:true,
        validated_by_hod:true,
        teacher:{
          select:{
            user:{
              select:{
              name:true
              }
          }

          }
        },
        exam:{
          select:{
            exam_date:true,
            duration:true,
            subject:{
              select:{
                name:true,
                coefficient:true,
                department_id:true,
                filiere_name:true,
              }
            }
          }
        },
        room:{
          select:{
            room_name:true  
          }
        }
      },
      take:itemPerPage,
      skip:itemPerPage * (page-1)
    })
    console.log(exams)
    res.status(200).json(exams);
  }catch{
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des examens' });
  }
}

const createExam = async (req, res) => {
  const { subject_id, exam_date, duration, email, session } = req.body;

  try {
      // Vérification de la session
      const getSession = await getSessionById(parseInt(session.session_id));
      if (!getSession) {
          return res.status(404).json({ error: "Session introuvable" });
      }
      if(getSession.is_validated === true){
          return res.status(400).json({ error: "Vous devez créer une session" });
      }

      // Vérification des dates
      const examDate = new Date(exam_date);
      const sessionStart = new Date(session.date_debut);
      const sessionEnd = new Date(session.date_fin);

      if (examDate < sessionStart || examDate > sessionEnd) {
          return res.status(400).json({
              error: `La date de l'examen doit être entre ${sessionStart.toISOString().split('T')[0]} et ${sessionEnd.toISOString().split('T')[0]}`
          });
      }

      // Vérification des doublons avant la transaction
      const duplicate = await prisma.exam.count({
          where: { subject_id: parseInt(subject_id),
            session_id:parseInt(session.session_id)
           }
      });

      const nbGroup = await prisma.group.count({
          where: {
              filiere: {
                  subjects: { some: { subject_id: parseInt(subject_id) } }
              }
          }
      });

      if(nbGroup === duplicate){
          return res.status(409).json({ error: "Vous avez déjà ajouté un examen pour ce sujet pour tous les groupes de ce filiére" });
      }

      const existingExams = await prisma.exam.findMany({
        where: {
            subject_id: parseInt(subject_id),
        },
        select: {
            exam_date: true,
            duration: true,
          }
      });
      if (existingExams.length > 0) {
        const firstExamDate = new Date(existingExams[0].exam_date).toISOString();
        const newExamDate = examDate.toISOString();
        let msg=""
        if (firstExamDate !== newExamDate) {
              msg= "La date doit correspondre aux examens existants pour ce sujet"
        }
        if(existingExams[0].duration !== duration) {
                msg= "La durée doit correspondre aux examens existants pour ce sujet"
        }
        if (msg !== "") {
            return res.status(400).json({ error: msg });
        }
      }

      // Transaction
      const exam = await prisma.$transaction(async (prisma) => {
          let is_duplicate = duplicate > 0;

          if (is_duplicate) {
              await prisma.exam.updateMany({
                  where: { subject_id: parseInt(subject_id) },
                  data: { is_duplicate: true }
              });
          }

          return prisma.exam.create({
              data: {
                  exam_date: new Date(exam_date).toISOString(),
                  is_duplicate,
                  duration,
                  subject: { connect: { subject_id: parseInt(subject_id) } },
                  session: { connect: { session_id: parseInt(session.session_id) } }
              },
              select: { // Spécifiez explicitement les champs à retourner
                  exam_id: true,
                  exam_date: true,
                  duration: true,
                  subject_id: true,
                  session_id: true
              }
          });
      });

      // Log
      const user_id = await prisma.user.findFirst({
          where: { email: email },
          select: { user_id: true }
      });

      const subjectInfo = await prisma.subject.findUnique({
          where: { subject_id: parseInt(subject_id) },
          select: { name: true, filiere_name: true }
      });

      await addLog({
          action: "Ajout",
          description: `un examen pour le sujet ${subjectInfo.name} de la filiere ${subjectInfo.filiere_name} a été créé`,
          performed_by: user_id.user_id
      });

      return res.status(201).json(exam);
  } catch (error) {
      console.error('Error creating exam:', error);
      return res.status(500).json({ error: 'Une erreur est survenue lors de la création de l\'examen' });
  }
};

const updateExam = async (req, res) => {
    const { exam_id } = req.params;
    const { exam_date, session,subject_id } = req.body;
    try{
      const getSession = await getSessionById(parseInt(session.session_id));
      if (!getSession) {
        return res.status(404).json({ error: "Session introuvable" });
      }
      if(getSession.is_validated===true){
        return res.status(400).json({ error: "La session est déjà validée" });
      }
      
      const currentReservation  = await prisma.examroom.findFirst({
        where: {
          exam_id: parseInt(exam_id),
          exam:{
            session_id:parseInt(getSession.session_id)
          }
        },
        select:{
          start_time:true,
          end_time:true,
          room_id:true
        }
      })
      let newStartTime
      let newEndTime
      if(currentReservation?.room_id){
        const newExamDate = new Date(exam_date)
        const newExamDay = newExamDate.toISOString().split('T')[0]
        console.log(newExamDay)
        newStartTime = new Date(`${newExamDay}T${currentReservation.start_time.toISOString().split('T')[1]}`);
        newEndTime = new Date(`${newExamDay}T${currentReservation.end_time.toISOString().split('T')[1]}`);
        
        const conflict = await prisma.examroom.findFirst({
          where:{
            AND: [
              {room_id:currentReservation.room_id},
              { NOT: { exam_id: parseInt(exam_id) }},
              {
                OR: [
                    // Cas 1: Nouvel examen commence pendant un examen existant
                    {
                        start_time: { lt: newEndTime  },
                        end_time: { gt: newStartTime }
                    },
                    // Cas 2: Nouvel examen contient complètement un examen existant
                    {
                        start_time: { gte: newStartTime },
                        end_time: { lte: newEndTime }
                    }
                ]
            }
            ],
          },
          select:{
            room:{
              select:{
                room_name:true
              }
            }
          }
        })
        console.log(conflict)
        if(conflict){
          return res.status(409).json({
            error: "La salle "+conflict.room.room_name+ " affectée à cet examen est déjà réservée pour la nouvelle date.",
          });
        }
      }
      const updatedExam = await prisma.exam.update({
        where: {
          exam_id: parseInt(exam_id),
        },
        data: {
          exam_date:new Date(exam_date).toISOString(),
        },
        select:{
          subject:{
            select:{
              name:true,
              filiere_name:true,
            }
          },
          exam_id:true,
          exam_date:true,
        }
      });
      if(newStartTime && newEndTime){
      const updateExamRoom =await prisma.examroom.updateMany({
        where :{
          exam_id: parseInt(exam_id),
        },
        data:{
          start_time :newStartTime,
          end_time :newEndTime
        }
      })
      }
      if(updatedExam){
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
          description:`un examen pour le sujet ${updatedExam.subject.name} de la filiere ${updatedExam.subject.filiere_name} a été modifié`,
          performed_by:user_id.user_id
        }
        await addLog(log);
      }
      console.log(updatedExam)
    res.status(201).json(updatedExam);
    }catch(err){
        console.log(err)
        res.status(500).json({ error: 'Une erreur est survenue lors de la modification de l\'examen' });
    }

}

const deleteExam = async (req, res) => {
    const { exam_id } = req.params;
    try{
      const result = await prisma.$transaction(async (prisma) => {
          // Suppression des entrées dans SupervisorExam (si applicable)
          await prisma.supervisorexam.deleteMany({
            where: { exam_id: parseInt(exam_id) }
          });

          // Suppression de l'entrée dans ExamRoom
          await prisma.examroom.deleteMany({
            where: { exam_id: parseInt(exam_id) }
          });

          // Suppression de l'examen
          const deletedExam=await prisma.exam.delete({
            where: { exam_id: parseInt(exam_id) },
            select:{
              subject:{
                select:{
                  name: true,
                  filiere_name: true
                }
              }
            }
          });
          return deletedExam;
      });
      if(result){
        const user_id=await prisma.user.findFirst({
          where:{
            role:"ADMIN"
          },
          select:{
            user_id:true
          }
        })
        const log={
          action:"Suppression",
          description:`un examen pour le sujet ${result.subject.name} de la filiere ${result.subject.filiere_name} a été supprimé`,
          performed_by:user_id.user_id
        }
        await addLog(log);
      }
      res.status(201).json({message:"exam deleted"});  // Retourner l'examen créé
    }catch(err){
      console.log(err)
      res.status(500).json({ error: 'Une erreur est survenue lors de la suppression de l\'examen' });
    }
}

module.exports = {
    getAllExams,
    getExamById,
    getExamsByRoomId,
    getExamsBySupervisorId,
    getExamsBySessionId,
    createExam,
    updateExam,
    deleteExam,
    getNotReservedExams,
    getExamsByDeaprtment,
    getNotValidatedExamsByDeaprtment,
    getValidatedExamsByDeaprtment,
    getAllAssignedExams,
    // getNotValidatedExamsByDirector,
    // getValidatedExamsByDirector,
    getPlanningForDirector
}





// async function main() {
//   // ... you will write your Prisma Client queries here
  


//   //create data in the database
//     await prisma.room.create({
//         data: {
//         room_name: 'B12',
//         capacity: 25,
//         location: 'block B 1er etage',
//         is_available: false,
//         }
//     })

//   //fetch data from the database
//   const allRooms = await prisma.room.findMany()
//   console.log(allRooms)
// }

// main()
//   .then(async () => {
//     await prisma.$disconnect()
//   })
//   .catch(async (e) => {
//     console.error(e)
//     await prisma.$disconnect()
//     process.exit(1)
//   })