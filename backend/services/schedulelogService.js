const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const addLog =async(log) => {
    try {
        const newLog = await prisma.schedulelog.create({
            data: {
                action: log.action,
                timestamp:new Date().toISOString(),
                description: log.description,
                user:{ 
                    connect:{
                        user_id: log.performed_by
                    }
                },

                
            }
        })
        return newLog
    }
    catch (error) {

        console.error("Error adding log:", error)
        throw new Error("Could not add log")
    }
}

module.exports = {
    addLog
}