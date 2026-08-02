"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";


export default function TestPage(){

    const [message, setMessage] = useState("");

    useEffect(() => {

        api.get("/")
        .then((response)=>{
            setMessage(response.data.message);
        })
        .catch(()=>{
            setMessage("Backend connection failed");
        });

    },[]);


    return (
        <main>
            <h1>
                {message}
            </h1>
        </main>
    );
}