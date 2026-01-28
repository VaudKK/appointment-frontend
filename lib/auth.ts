import { betterAuth } from "better-auth";
import {mongodbAdapter} from "better-auth/adapters/mongodb";
import db from "@/lib/mongodb";
import {jwt} from "better-auth/plugins";
import {sendEmail} from "@/lib/api/mail";

export const auth = betterAuth({
    database: mongodbAdapter(db),
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        sendResetPassword: async ({user,url}) => {
           const request = {
                to: user.email,
                templateName: "user_reset_link.tmpl",
                data: {
                    "ResetLink": url
                }
            }
            await sendEmail(request)
        }
    },
    plugins: [jwt()]
});