const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// validateDepartmentEntries controllers

const validateDepartmentEntries = async (req, res) => {
    const {userId } = req.body
  
    try {
      // Vérifier que l'utilisateur est Chef de Département
      const user = await prisma.user.findUnique({
        where: { user_id: userId },
      })
      if (user.role !== 'CHEF') {
        return res.status(403).json({ error: "Accès refusé." });
      }
      const depId = await prisma.department.findUnique({
        where :{
          head_id : userId
        },
        select:{
          department_id:true
        }
      })
      console.log(depId)
      // Valider toutes les données de ce département
       const validatedExams = await prisma.supervisorexam.updateMany({
        where: {
          AND: [
            {
              exam: {
                is: { // Utilisation de 'is' pour les relations
                  subject: {
                    is: {
                      department_id: depId.department_id
                    }
                  }
                }
              }
            },
            {
              validated_by_hod: false
            }
          ]
        },
        data: {
          validated_by_hod: true,
        },
      })
      console.log(validatedExams)
      res.status(200).json({ message: "Validation réussie."});
    } catch (error) {
      console.error("Erreur lors de la validation :", error);
      res.status(500).json({ error: "Erreurlors de la validation ." });
    }
  }

const validateGlobalPlanning = async (req, res) => {
  const { userId } = req.body;

  try {
    // Vérifier que l'utilisateur est Directeur des Études
    const user = await prisma.user.findUnique({
      where: { user_id: userId },
    });
    if (user.role !== 'DIRECTEUR') {
      return res.status(403).json({ error: "Accès refusé." });
    }

    // Valider tout le planning global
    await prisma.supervisorexam.updateMany({
      where: {
        validated_by_hod: true, // Assurer que le Chef de Département a validé
        validated_by_director: false, // Valider uniquement les non encore validés
      },
      data: {
        validated_by_director: true,
      },
    });

    res.status(200).json({ message: "Planning global validé." });
  } catch (error) {
    console.error("Erreur lors de la validation du planning :", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
}


module.exports = {
    validateDepartmentEntries,
    validateGlobalPlanning,
    
}