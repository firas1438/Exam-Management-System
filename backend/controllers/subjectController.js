const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// subject controller 

const getAllSubject = async (req, res) => {
      try {
          const subjects= await prisma.subject.findMany({
            select:{
                coefficient:true,
                name:true,
                subject_id:true,
                department_id:true,
                filiere_name:true,
            }
            });
            console.log(subjects);
            res.status(200).json(subjects);
        } catch (error) {
          res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des matiéres' });
        }
  }


module.exports = {
    getAllSubject,

}