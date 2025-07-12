const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const getAllRooms =async()=>{
    return prisma.room.findMany()
}

const getBookingsByRoomId=async(room_id)=>{
    return prisma.examroom.findMany({
        where: { room_id: room_id },
        orderBy: { start_time: 'asc' }
      });
}

module.exports={
    getAllRooms,
    getBookingsByRoomId,
}