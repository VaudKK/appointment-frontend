import {redirect} from "next/navigation";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";

export default async function AdminHomePage(){
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if(!session) {
        redirect("/admin/me/signin")
    }

    redirect("/admin/dashboard/bookings")
}
