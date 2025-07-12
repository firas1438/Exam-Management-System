const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const {itemPerPage}=require('../config/settings');
const { getAllRooms, getBookingsByRoomId } = require('./roomService');

const getExams=async(session_id)=>{
    return  prisma.exam.findMany({
                where:{
                  session_id:session_id
                },
                select:{
                  exam_id:true,
                  exam_date:true,
                  duration:true,
                  subject:{
                    select:{
                        subject_id:true,
                        name:true,
                        coefficient:true,
                        filiere_name:true,
                        department:{
                            select:{
                                name:true,
                            }
                        }
    
                    }
                  },
                  examroom:{
                    select:{
                        start_time:true,
                        end_time:true,
                        room:{
                            select:{
                                room_name:true,
                            }
                        }
                    }
                  },
                  supervisorexam:{
                      select:{
                        teacher:{
                          select:{
                            user:{
                              select:{
                                name:true
                              }
                            }
                          }
                        }
                      }
                  }
            
                },
              });
}

const getExam=async(id)=>{
    return prisma.exam.findUnique({
        where:{
          exam_id:id,
        },
        select:{
          exam_id:true,
          exam_date:true,
          duration:true,
          subject:{
            select:{
                name:true,
                coefficient:true,
                department_id:true,
                filiere_name:true,
            }
          },
          examroom:{
            select:{
                start_time:true,
                end_time:true,
                room:{
                    select:{
                        room_name:true,
                    }
                }
            }
          },
    
        },
      });
}

const getUnscheduledExams=async()=>{
  return prisma.exam.findMany({
    where: {
      examroom: null,
    },
  });
}

const autoRescheduleExams =async()=>{
  try{
    const unscheduledExams = await getUnscheduledExams()

    if (unscheduledExams.length === 0) {
      console.log('Aucun examen à planifier');
      return { scheduled: 0 };
    }
  
    const allRooms=await getAllRooms()
    const schedulingResults = []
    const MINIMUM_GAP = 30 * 60 * 1000
  
    for (const exam of unscheduledExams){
      const examDuration= (exam.duration==="ONE"? 1 :exam.duration==="ONE_POINT_FIVE"? 1.5 :exam.duration==="TWO"? 2 : 3)*60*60*1000
      const totalNeeded = examDuration + MINIMUM_GAP
      let isBooked=false
      for (const room of allRooms) {
        const existingBookings = await getBookingsByRoomId(room.room_id)

        let lastEnd = new Date(exam.exam_date);
        lastEnd.setHours(8, 0, 0, 0)
        // lastEnd.setMinutes(30,0,0)
        

        if (existingBookings.length > 0) {
          const firstBooking = existingBookings[0];
          const availableBeforeFirst =new Date(firstBooking.start_time) - lastEnd;
          
          if (availableBeforeFirst >= totalNeeded) {
            // Créneau valide trouvé avant le premier examen
            const endTime = new Date(lastEnd.getTime() + examDuration);
            const result =await createBooking(exam, room, lastEnd, endTime);
            if (result) {
              console.log(`Exam ${exam.exam_id} est réservée avec succées ${room.room_id}`);
              isBooked=true
              break;
            }
          }
          else{
            for (let i = 0; !isBooked && i < existingBookings.length - 1; i++) {  
              const current = existingBookings[i];
              const next = existingBookings[i + 1];
              
              const availableSlot = {
                start: new Date(current.end_time.getTime() + MINIMUM_GAP),
                end: new Date(next.start_time.getTime() - MINIMUM_GAP)
              };
      
              const slotDuration = availableSlot.end - availableSlot.start;
              
              if (slotDuration >= examDuration) {
                const endTime = new Date(availableSlot.start.getTime() + examDuration);
                await createBooking(exam, room, availableSlot.start, endTime);
                if (result) {
                  console.log(`Exam ${exam.exam_id} est réservée avec succées ${room.room_id}`);
                  isBooked=true
                  break;
                }
              }
            }
          }

        }


      }
    }
  }catch(err){
    console.log(err)
  }

}

module.exports={
    getExams,
    getExam,
    getUnscheduledExams,
    autoRescheduleExams,
}