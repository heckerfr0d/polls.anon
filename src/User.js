import React, { useEffect, useState } from "react";
import { authFetch } from "./auth"

function User() {
    const [message, setMessage] = useState('')

    useEffect(() => {
        authFetch("/api/polls").then(response => {
            if (response.status === 401) {
                setMessage("Sorry you aren't authorized!")
                return null
            }
            return response.json()
        }).then(response => {
            if (response && response.message) {
                setMessage(response.message)
            }
        })
    }, [])
    return (
        <h2>Secret: {message}</h2>
    )
}

export default User;