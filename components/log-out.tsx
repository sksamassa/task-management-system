"use client"

import { logoutUser } from "@/actions"
import { Button } from "./ui/button"

export default function Logout() {
    return <Button onClick={ async () => logoutUser()}>
        Log Out
    </Button>
}