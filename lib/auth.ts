import { APIError, betterAuth } from "better-auth";
import {mongodbAdapter} from "better-auth/adapters/mongodb";
import db from "@/lib/mongodb";
import {jwt} from "better-auth/plugins";
import {sendEmail} from "@/lib/api/mail";

export const auth = betterAuth({
    database: mongodbAdapter(db),
    databaseHooks: {
        user:{
            create: {
                before: async (user) => {
                    const existing = await db.collection("user").findOne({
                        organizationSlug: user.organizationSlug
                    });

                    if(existing){
                        throw new APIError("BAD_REQUEST",{
                            message: "Store name already taken"
                        })
                    }

                    return {data: user}
                }
            }
        }
    },
    emailVerification: {
        sendOnSignUp: true,
        sendVerificationEmail: async ({user,url}) => {
            const request = {
                to: user.email,
                templateName: "verify_email.tmpl",
                data: {
                    "VerifyLink": url
                }
            }
            await sendEmail(request)
        }
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        requireEmailVerification: true,
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
    plugins: [jwt()],
    advanced:{
        cookiePrefix: "kwa-wakati"
    },
    user:{
        additionalFields: {
            organizationId: {
                type: "string",
                required: true,
                input: true,
            },
            organizationSlug: {
                type: "string",
                required: true,
                input: true,
                unique: true,
            },
        },
    }
});
