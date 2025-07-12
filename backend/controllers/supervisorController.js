const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const {itemPerPage}=require('../config/settings')

// supervisors controllers
const getSupervisors = async (req, res) => {
  const {page}=req.params  
  try {
        const supervisors = await prisma.teacher.findMany({
          select:{
            teacher_id:true,
            department_id:true,
            title:true,
            user:{
              select:{
                name:true,
                email:true,
              }
            }

          },
          take:itemPerPage,
          skip:itemPerPage * (page-1)
    })
    if (!supervisors) {
        return res.status(404).json({ error: 'Aucun surveillant trouvé.' });
    }
        res.status(200).json(supervisors)
    } catch (error) {
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des surveillants' });
    }
}

const generateAssignments = async (examId) => {
    try {
      // Récupérer les informations sur l'examen
      const exam = await prisma.exam.findUnique({
        where: { exam_id: parseInt(examId) },
        select:{
            subject:{
                select:{
                    subject_id : true,
                    teachersubject:{
                        select:{
                            teacher_id:true,
                        }
                    }
                }
            },
            examroom:{
                select:{
                    room_id:true,
                    start_time:true,
                    end_time:true,
                }
            }
        }
      });
  
      if (!exam) {
        throw new Error("Examen non trouvé.");
      }
      const examStartTime = new Date(exam.examroom.start_time); 
      const examEndTime = new Date(exam.examroom.end_time);

    // Récupérer tous les enseignants sauf ceux qui enseignent la matière de l'examen
    const excludedTeacherIds = exam.subject.teachersubject.map((teacher) => teacher.teacher_id);
    
    const eligibleTeachers = await prisma.teacher.findMany({
      where: {
        teacher_id: { notIn: excludedTeacherIds }, // Exclure les enseignants associés à la matière
        supervisorexam :{
            none :{
                    AND: [
                      { start_time: { lte: examEndTime } },
                      { end_time: { gte: examStartTime } },
                    ],
                  }
        }
      },
    });
    console.log(eligibleTeachers)
  
      if (eligibleTeachers.length === 0) {
        throw new Error("Aucun enseignant éligible pour surveiller cet examen.");
      }
  
      // Sélectionner aléatoirement un enseignant éligible
      const randomTeacher = eligibleTeachers[Math.floor(Math.random() * eligibleTeachers.length)];
  
      // Créer l'affectation
      const assignment = await prisma.supervisorexam.create({
        data: {
          exam_id: examId,
          supervisor_id: randomTeacher.teacher_id,
          room_id:exam.examroom.room_id,
          start_time: examStartTime,
          end_time: examEndTime,
        },
      });
      console.log(assignment)
      return assignment;
    } catch (err) {
      console.error(err);
      throw new Error("Erreur lors de la génération des affectations.");
    }
  };

const findExamProperties= async(req,res)=>{

    try{
      const result = await prisma.$transaction(async (prisma) => {
          const reservedExam = await prisma.supervisorexam.findMany({
            select:{
                exam_id:true
            }
          })
          let examIds= reservedExam.map((exam)=>exam.exam_id)
          console.log(examIds)
          const notReservedExam = await prisma.examroom.findMany({
            where:{
                exam_id:{notIn:examIds}
            },
            select:{
                exam_id:true
            }
          })
          examIds= notReservedExam.map((exam)=>exam.exam_id)
          console.log(examIds)
          for(const exam_id of examIds){
             await generateAssignments(exam_id)
          }
      })
        res.status(201).json("Réservation des examens terminée");
    }catch(err){
        console.log(err)
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des examens' });
    }
}

const updateAssignment = async(req,res)=>{
  const { exam_id, new_teacher_id } = req.body;
  console.log(exam_id,new_teacher_id)
  try {
    // Vérifier le nouvel enseignant est n'est pas l'enseignant de la matière
    const assignment = await prisma.supervisorexam.findFirst({
      where:{
        exam_id:parseInt(exam_id)
      },
      select:{
        monitor_id:true,
        exam:{
          select:{
            subject:{
              select:{
                teachersubject:{
                  select:{
                    teacher_id:true
                  }
                }
              }
          }
        }
      }
    }
  })
    console.log(assignment)
    if (assignment.exam.subject.teachersubject.some((teacher) => teacher.teacher_id === parseInt(new_teacher_id))) {
      return res.status(400).json({ error: "Cet enseignant ne peut pas surveiller sa propre matière." });
    }

    // Mettre à jour l'affectation
    const updatedAssignment = await prisma.supervisorexam.update({
      where: {
          monitor_id: assignment.monitor_id,
          exam_id: parseInt(exam_id),
      },
      data: {
        supervisor_id: parseInt(new_teacher_id)
      },
    });
    if(!updatedAssignment){
      return res.status(404).json("Erreur est survenu lors de l'affectation.");
    }
      res.status(200).json("Affectation mise à jour avec succès.");

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la mise à jour de l'affectation." });
  }
}

const getCountsSummaryAdmin = async(req,res)=>{
  const {email} = req.body
  try{
    const summary = await prisma.$transaction(async (prisma) => {
      const totalExams = await prisma.exam.count();
      const logs = await prisma.schedulelog.findMany({
        where: {
          user: {
            email: email,
          },
        },
        take: 5,
        orderBy: { timestamp: 'desc' },
      })
      const totalSupervisors = await prisma.teacher.count();
      const totalStudent = await prisma.student.count();
      const totalSubjects = await prisma.subject.count();
      const availableRooms=await prisma.room.count({
       where :{
          is_available: true
        }
      });
      const notAvailableRooms=await prisma.room.count({
        where :{
           is_available: false
         }
       }
       );
      let examByDep= await prisma.$queryRaw`
      SELECT 
        d.department_id, 
        d.name AS department_name, 
        IFNULL(COUNT(DISTINCT e.exam_id), 0) AS exam_count
      FROM \`Department\` d
      LEFT JOIN \`Subject\` s ON d.department_id = s.department_id
      LEFT JOIN \`Exam\` e ON s.subject_id = e.subject_id
      LEFT JOIN \`SupervisorExam\` se ON e.exam_id = se.exam_id AND se.validated_by_hod = false
      GROUP BY d.department_id, d.name
      ORDER BY d.department_id;
    `;
      examByDep=examByDep.map(row => ({
        ...row,
        exam_count: Number(row.exam_count), // Convertir BigInt en Number
      }));
      console.log(examByDep)
      return {
        logs,
        totalExams,
        totalSupervisors,
        totalStudent,
        totalSubjects,
        examByDep,
        availableRooms,
        notAvailableRooms,
      };
    });
    res.status(200).json(summary);
  }catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la récupération des affectations." });
  }
}

const getCountsSummaryDirector = async(req,res)=>{
  try{
    const summary = await prisma.$transaction(async (prisma) => {
      const totalExams = await prisma.supervisorexam.count();
      const totalSupervisors = await prisma.teacher.count();
      const totalDepartment = await prisma.department.count();
      const directorName=await prisma.user.findMany({
        where:{
          role:"DIRECTEUR"
        },
        select:{
          name:true
        }
      })
      const totalStudent = await prisma.student.count();
      let examByDep= await prisma.$queryRaw`
      SELECT 
        d.department_id, 
        d.name AS department_name, 
        COALESCE(COUNT(se.exam_id), 0) AS not_validated_count
      FROM Department d
      LEFT JOIN Subject s ON d.department_id = s.department_id
      LEFT JOIN Exam e ON s.subject_id = e.subject_id
      LEFT JOIN SupervisorExam se ON e.exam_id = se.exam_id AND (se.validated_by_hod = false OR se.exam_id IS NULL) 
      GROUP BY d.department_id, d.name
      ORDER BY d.department_id;
    `;
      examByDep=examByDep.map(row => ({
        ...row,
        not_validated_count: Number(row.not_validated_count), // Convertir BigInt en Number
      }));
      console.log(examByDep)
      return {
        totalExams,
        totalSupervisors,
        totalStudent,
        directorName,
        totalDepartment,
        examByDep
      };
    });
    res.status(200).json(summary);
  }catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la récupération des affectations." });
  }
}

const getCountsSummaryHead = async(req,res)=>{
  const {user_id} = req.params
  try{
    const summary = await prisma.$transaction(async (prisma) => {
      const HeadName=await prisma.teacher.findUnique({
        where:{
          user_id: parseInt(user_id)
        },
        select:{
          department_id:true,
          user:{select:{name:true}}

        }
      })
      const dep= await prisma.department.findUnique({
        where: {
          department_id: HeadName.department_id,
      },
      select: {
          name:true
      },
      })
      const notValidatedExams = await prisma.supervisorexam.count({
        where :{
          exam:{
            subject:{
              department_id :HeadName.department_id
            }
          },
          validated_by_hod:false
        }
      });
      const validatedExams = await prisma.supervisorexam.count({
        where :{
          exam:{
            subject:{
              department_id :HeadName.department_id
            }
          },
          validated_by_hod:true
        }
      });
      const totalSupervisors = await prisma.teacher.count({
        where:{
          department_id:HeadName.department_id
        }
      });

      const totalStudent = await prisma.student.count({
        where :{
          department_id :HeadName.department_id
        }
      });
      console.log(validatedExams,
        notValidatedExams,
        totalSupervisors,
        totalStudent,
        HeadName,
        dep)
      return {
        validatedExams,
        notValidatedExams,
        totalSupervisors,
        totalStudent,
        HeadName,
        dep,
      };
    });
    res.status(200).json(summary);
  }catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la récupération des affectations." });
  }
}

module.exports = {
    findExamProperties,
    updateAssignment,
    getSupervisors,
    getCountsSummaryAdmin,
    getCountsSummaryDirector,
    getCountsSummaryHead
}