const verifyRole = (allowedRole)=>{
    return (req,res,next)=>{
        if(!req?.role){
            console.log("mochkol lena !")
            return res.status(401).json({message: "aaaa 7ama rak Unauthorized"})
        }
        const result = allowedRole.includes(req.role)
        if(!result){
            return res.status(401).json({message: "Unauthorized Not Allowed !"})
        }
        next()
    }
}

module.exports = verifyRole