"use client"

import {useEffect, useState} from "react";
import api from "@/lib/api";


export default function Test(){

const [message,setMessage]=useState("");


useEffect(()=>{

api.get("/")
.then(res=>{
setMessage(res.data.message)
})

},[])


return (

<div>

<h1>{message}</h1>

</div>

)

}