const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

//hashage des mdp
const bcrypt = require('bcrypt');

//remplir salles
// async function main() {
//     console.log('Début du seeding...');
    
//     const bloc=["A","B","C"]
//     const etages=[2,3]
//     for(let i=0;i<etages.length;i++){
//         for(let j=0;j<bloc.length;j++){
//             for(let k=0;k<10;k++){
//                 const room_name= `${bloc[j]}${etages[i]}${k}`
//                 const options = [35, 30, 40];
//                 // Générer un index aléatoire
//                 const randomIndex = Math.floor(Math.random() * options.length);
//                 // Récupérer la valeur correspondante
//                 const randomValue = options[randomIndex];
//                 const capacity=randomValue
//                 const location=`bloc${bloc[j]} etage${etages[i]}`
//                 const is_available=true
//                 await prisma.room.create({
//                     data: {
//                         room_name: room_name,
//                         capacity: capacity,
//                         location: location,
//                         is_available:is_available,
//                     }
//                 });
//             }
                
//     }
// }


//   console.log('Seeding terminé avec succès !');
// }

//remplir departments
// async function main() {
//     console.log('Début du seeding...');
    
//     const departments=["Informatique","Technologie","Mathématiques"]
//     for(let i=0;i<departments.length;i++){
//         await prisma.department.create({
//             data: {
//                 name: departments[i],
//             }
//         });
//     }


//   console.log('Seeding terminé avec succès !');
// }

// remplir filiéres
// async function main() {
//   const filieres = [
//     {
//       filiere_name: 'CPI_1',
//       department_id: 1, // Assurez-vous que ce département existe dans la base de données
//     },
//     {
//       filiere_name: 'CPI_2',
//       department_id: 1, // Assurez-vous que ce département existe dans la base de données
//     },
//     {
//       filiere_name: 'ING_1_INFO',
//       department_id: 1, // Assurez-vous que ce département existe dans la base de données
//     },
//     {
//       filiere_name: 'ING_2_INFO',
//       department_id: 1, // Assurez-vous que ce département existe dans la base de données
//     },
//     {
//       filiere_name: 'L1_MATH',
//       department_id: 3, // Assurez-vous que ce département existe dans la base de données
//     },
//     {
//       filiere_name: 'L2_MATH',
//       department_id: 3, // Assurez-vous que ce département existe dans la base de données
//     },
//     {
//       filiere_name: 'L1_EEA',
//       department_id: 2, // Assurez-vous que ce département existe dans la base de données
//     },
//     {
//       filiere_name: 'L2_SE',
//       department_id: 2, // Assurez-vous que ce département existe dans la base de données
//     },
//     {
//       filiere_name: 'MP_1_GL',
//       department_id: 1, // Assurez-vous que ce département existe dans la base de données
//     },
//     {
//       filiere_name: 'ING_1_EL',
//       department_id: 2, // Assurez-vous que ce département existe dans la base de données
//     },
//   ];

//   // Boucle pour ajouter chaque filière
//   for (const filiereData of filieres) {
//     const filiere = await prisma.filiere.create({
//       data: {
//         filiere_name: filiereData.filiere_name,
//         department: {
//           connect: { department_id: filiereData.department_id },
//         },
//       },
//     });
//   }
//   console.log('Seeding terminé avec succès !');

// }

//remplir les chefs de deaptments
// async function main() {
//     console.log('Début du seeding...');
    
//     const chefs=[
//         { name: 'Hamel Lazher', email: 'lazhar.hamel@gmail.com', password: "hamellazher123456", role: 'CHEF', is_active: true },
//         { name: 'Eloued Mohamed', email: 'wadyel@yahoo.fr', password: "elouedmohamed123456", role: 'CHEF', is_active: true },
//         { name: 'El Ajmi Hammouda', email: 'ajmi.hammouda@fsm.rnu.tn', password: "elajmihammouda123456", role: 'CHEF', is_active: true },
//                 ]
//     for(let i=0;i<chefs.length;i++){
//         const hashedPassword = await bcrypt.hash(chefs[i].password, 10);
//         await prisma.user.create({
//             data: {
//                 name: chefs[i].name,
//                 email: chefs[i].email,
//                 password: hashedPassword,
//                 role: chefs[i].role,
//                 is_active: chefs[i].is_active,
//             }
//         });
//     }


//   console.log('Seeding terminé avec succès !');
// }

//remplir les matiéres
// async function main() {
//   console.log('Début du seeding...');
//   const subjects = [
//     { Epreuve: "Algèbre 3", CODE: 122,dep:3,filiere_name:"CPI_2" },
//     { Epreuve: "Analyse 1", CODE: 185,dep:3,filiere_name:"L1_INFO" },
//     { Epreuve: "Analyse 1", CODE: 240,dep:3,filiere_name:"L1_EEA"},
//     { Epreuve: "Analyse 1", CODE: 290,dep:3,filiere_name:"L1_TIC" },
//     { Epreuve: "Programmation Java", CODE: 209,dep:1,filiere_name:"L2_INFO" },
//     { Epreuve: "Algèbre 1", CODE: 145,dep:3,filiere_name:"L1_MATH" },
//     { Epreuve: "Algèbre", CODE: 160,dep:3,filiere_name:"L2_MATH"  },
//     { Epreuve: "Topologie des espaces métriques", CODE: 175,dep:3,filiere_name:"L3_MATH"  },
//     { Epreuve: "Algèbre 1", CODE: 100,dep:3,filiere_name:"CPI_1" },
//     { Epreuve: "Automatique", CODE: 260,dep:2,filiere_name:"L2_SE" },
//     { Epreuve: "Automatique", CODE: 310,dep:2,filiere_name:"L2_TIC" },
//     { Epreuve: "Automatique", CODE: 341,dep:2,filiere_name:"L2_MIM" },
//     { Epreuve: "Développement d'applications réparties", CODE: 231,dep:1,filiere_name:"L3_INFO"},
//     { Epreuve: "Traitement Numérique du Signal", CODE: 280,dep:2,filiere_name:"L3_SE" },
//     { Epreuve: "Traitement Numérique du Signal", CODE: 330,dep:2,filiere_name:"L3_TIC" },
//     { Epreuve: "Programmation déclarative", CODE: 428,dep:1,filiere_name:"MR1_GL" },
//     { Epreuve: "Approche à base de composants et concurrence", CODE: 449,dep:1,filiere_name:"MR2_GL" },
//     { Epreuve: "Élément de Mécanique Quantique pour l'Électronique", CODE: 581,dep:2,filiere_name:"MR1_EL" },
//     { Epreuve: "Systèmes répartis", CODE: 397,dep:1,filiere_name:"ING_2_INFO" },
//     { Epreuve: "Développement Mobile", CODE: 230,dep:1,filiere_name:"L3_INFO" },
//     { Epreuve: "Structures de Données Complexes et Algorithmique", CODE: 495,dep:1,filiere_name:"MP1_GL" },
//     { Epreuve: "Architecture de Logiciel et Méthodes Formelles", CODE: 516,dep:1,filiere_name: "MP2_GL"},
//     { Epreuve: "Composants Optoélectroniques", CODE: 603,dep:2,filiere_name: "MR2_EL"},
//     { Epreuve: "Mathématiques", CODE: 526 ,dep:3,filiere_name:"ING_1_EL"},
//     { Epreuve: "Physique des Composants 3", CODE: 549,dep:2,filiere_name:"ING_2_EL" },]
//   const coef=[  "ZERO_POINT_FIVE",
//     "ONE",
//     "ONE_POINT_FIVE",
//     "TWO"]
//   for (let i = 0; i < subjects.length; i++) {
//     const randomIndex = Math.floor(Math.random() * coef.length);
//     const randomValue = coef[randomIndex];
//     await prisma.subject.create({
//       data: {
//         subject_id: subjects[i].CODE,
//         name: subjects[i].Epreuve,
//         department: {
//           connect: { department_id: subjects[i].dep },
//         },
//         coefficient: randomValue,
//         filiere: {
//           connect: { filiere_name: subjects[i].filiere_name },
//         },
//       }
//     });
//   }


// console.log('Seeding terminé avec succès !');
// }

// ajouter des groupes pour les filires :
// async function main() {
//   // Récupérer toutes les filières existantes
//   const filieres = await prisma.filiere.findMany();

//   // Pour chaque filière, ajouter 2 groupes (G1 et G2)
//   for (const filiere of filieres) {
//     for (let i = 1; i <= 2; i++) {
//       const groupName = `G${i}`; // Nom du groupe (G1 ou G2)

//       // Ajouter le groupe dans la base de données
//       await prisma.group.create({
//         data: {
//           group_name: groupName,
//           filiere: {
//             connect: { filiere_name: filiere.filiere_name },
//           },
//         },
//       });

//     }
//   }
//   console.log("seed terminé avec succès !");
// }

// ajout des enseignants
// async function main() {
//   console.log('Début du seeding...');
//   const teachers = [
//     {name : "Imen BEN AHMED",email:"imenbenahmed@gmail.com",password:"imenbenahmed123456",role:"ENSEIGNANT",is_active:true},
//     {name : "Ayda BOUGHAMOURA",email:"aydaboughamoura@gmail.com",password:"aydaboughamoura123456",role:"ENSEIGNANT",is_active:true},
//     {name : "Sameh HBAIEB TURKI",email:"samehHbaieb@gmail.com",password:"samehhbaieb123456",role:"ENSEIGNANT",is_active:true},
//     {name : "Skander AZZAZ",email:"skanderazzez@gmail.com",password:"skanderazzez123456",role:"ENSEIGNANT",is_active:true},
//   ]
//   for (let i = 0; i < teachers.length; i++) {
//     const hashedPassword = await bcrypt.hash(teachers[i].password, 10);
//     await prisma.user.create({
//       data: {
//         name: teachers[i].name,
//         email: teachers[i].email,
//         password: hashedPassword,
//         role: teachers[i].role,
//         is_active: teachers[i].is_active,
//       }
//     });
//   }
// }

//ajouter les tuples dans la table Teacher_Subject
// async function main() {
//   console.log('Début du seeding...');
//   const subjectteacher = [
//     {  CODE: 209,TEACHER_ID:1 },
//     {  CODE: 122,TEACHER_ID:6 } ,
//     {  CODE: 526,TEACHER_ID:6 },
//     {  CODE: 185,TEACHER_ID:7},
//     {  CODE: 428,TEACHER_ID:5 },]
//   for (let i = 0; i < subjectteacher.length; i++) {
//     await prisma.teachersubject.create({
//       data: {
//         subject_id: subjectteacher[i].CODE,
//         teacher_id: subjectteacher[i].TEACHER_ID,
//       }
//     });
//   }

// console.log('Seeding terminé avec succès !');
// }


//ajouter examen
// async function main() {
//   console.log('Début du seeding...');

//   const subjects = [
//     { CODE: 122, DURATION: 'ONE_POINT_FIVE', EXAM_DATE: new Date(2024, 1, 9), ROOM_ID: 1, SUPERVISOR_ID: 1 },
//     { CODE: 122, DURATION: 'ONE_POINT_FIVE', EXAM_DATE: new Date(2024, 1, 9), ROOM_ID: 4, SUPERVISOR_ID: 3 },
//     { CODE: 185, DURATION: 'ONE_POINT_FIVE', EXAM_DATE: new Date(2024, 1, 9), ROOM_ID: 2, SUPERVISOR_ID: 1 },
//     { CODE: 240, DURATION: 'ONE_POINT_FIVE', EXAM_DATE: new Date(2024, 1, 10), ROOM_ID: 1, SUPERVISOR_ID: 2 },
//     { CODE: 290, DURATION: 'ONE_POINT_FIVE', EXAM_DATE: new Date(2024, 1, 10), ROOM_ID: 3, SUPERVISOR_ID: 2 },
//     { CODE: 209, DURATION: 'ONE_POINT_FIVE', EXAM_DATE: new Date(2024, 1, 11), ROOM_ID: 1, SUPERVISOR_ID: 1 },
//   ];

//   for (const subject of subjects) {
//     // Vérifier si un examen avec le même `subject_code` existe déjà
//     let is_duplicate = false;
//     const existingExam = await prisma.exam.findFirst({
//       where: {
//         subject_id: subject.CODE,
//       },
//     });

//     if (existingExam) {
//       // Si un examen existe, mettre à jour `id_duplicate` à true
//       await prisma.exam.update({
//         where: { exam_id: existingExam.exam_id },
//         data: { is_duplicate: true },
//       });
//       console.log(`Examen existant mis à jour avec id_duplicate = true.`);
//       is_duplicate = true;
//     }

//     // Créer un nouvel examen uniquement si ROOM_ID est différent
//     const exam = await prisma.exam.create({
//       data: {
//         subject_id: subject.CODE,
//         duration: subject.DURATION,
//         exam_date: subject.EXAM_DATE,
//         is_duplicate: is_duplicate,
//       },
//     });

//     console.log(`Nouvel examen créé :`, exam);

//     // Associer la salle et le surveillant à l'examen
//     await prisma.$transaction(async (tx) => {
//       await tx.examRoom.create({
//         data: {
//           exam_id: exam.exam_id,
//           room_id: subject.ROOM_ID,
//         },
//       });
//       await tx.supervisorExam.create({
//         data: {
//           supervisor_id: subject.SUPERVISOR_ID,
//           exam_id: exam.exam_id,
//           room_id: subject.ROOM_ID,
//         },
//       });
//     });
//     console.log('Transaction réussie.');
//   }

//   console.log('Seeding terminé avec succès !');
// }

// //exemple de recherche des examen 
//  async function main() {
//   const exams= await prisma.exam.findMany({
//     select:{
//       exam_date:true,
//       duration:true,
//       subject_id:{
//         select:{
//           name:true,
//           department_id:
//             {
//               select:{
//                 name:true,
//                 coefficient: true
//               }
//             }
//         }
//       }

//     }
//   });
//   console.log(exams);

// }

//Ajouter un admin
// async function main() {
//     console.log('Début du seeding...');
    
//         const admin ={
//           name : "admin",
//           email : "adminisimm@gmail.com",
//           password : "adminadmin",
//           role : "ADMIN",
//           is_active : true
//         }
//         const hashedPassword = await bcrypt.hash(admin.password, 10);
//         await prisma.user.create({
//             data: {
//                 name: admin.name,
//                 email: admin.email,
//                 password: hashedPassword,
//                 role: admin.role,
//                 is_active: admin.is_active,
//             }
//         });
    


//   console.log('Seeding terminé avec succès !');
// }

//ajouter directeur
// async function main() {
//   console.log('Début du seeding...');
  
//       const directeur ={
//         name : "directeur",
//         email : "directeurisimm@gmail.com",
//         password : "directeurdirecteur",
//         role : "DIRECTEUR",
//         is_active : true
//       }
//       const hashedPassword = await bcrypt.hash(directeur.password, 10);
//       await prisma.user.create({
//           data: {
//               name: directeur.name,
//               email: directeur.email,
//               password: hashedPassword,
//               role: directeur.role,
//               is_active: directeur.is_active,
//           }
//       });
  


// console.log('Seeding terminé avec succès !');
// }

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

  //npm run prisma:seed
