import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


export default function SignupForm() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="flex flex-1 flex-col justify-center px-4 py-10 lg:px-6">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <h3 className="mt-2 text-center text-lg font-bold text-foreground dark:text-foreground">
                        Create New Account
                    </h3>
                </div>

                <Card className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
                    <CardContent>
                        <form action="#" method="post" className="space-y-4">
                            <div>
                                <Label
                                    htmlFor="fullname"
                                    className="text-sm font-medium text-foreground dark:text-foreground"
                                >
                                    Name
                                </Label>
                                <Input
                                    type="text"
                                    id="fullname"
                                    name="fullname"
                                    autoComplete="fullname"
                                    placeholder="Full Names"
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <Label
                                    htmlFor="email"
                                    className="text-sm font-medium text-foreground dark:text-foreground"
                                >
                                    Email
                                </Label>
                                <Input
                                    type="text"
                                    id="phone"
                                    name="phone"
                                    autoComplete="phone"
                                    placeholder="0712345678"
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <Label
                                    htmlFor="password"
                                    className="text-sm font-medium text-foreground dark:text-foreground"
                                >
                                    Password
                                </Label>
                                <Input
                                    type="password"
                                    id="password"
                                    name="password"
                                    autoComplete="password"
                                    placeholder="Password"
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <Label
                                    htmlFor="confirm-password"
                                    className="text-sm font-medium text-foreground dark:text-foreground"
                                >
                                    Confirm password
                                </Label>
                                <Input
                                    type="password"
                                    id="confirm-password"
                                    name="confirm-password"
                                    autoComplete="confirm-password"
                                    placeholder="Password"
                                    className="mt-2"
                                />
                            </div>


                            <Button type="submit" className="mt-4 w-full py-2 font-medium">
                                Create account
                            </Button>

                            <p className="text-center text-xs text-muted-foreground dark:text-muted-foreground">
                                By signing in, you agree to our{" "}
                                <a
                                    href="#"
                                    className="capitalize text-primary hover:text-primary/90 dark:text-primary hover:dark:text-primary/90"
                                >
                                    Terms of use
                                </a>{" "}
                                and{" "}
                                <a
                                    href="#"
                                    className="capitalize text-primary hover:text-primary/90 dark:text-primary hover:dark:text-primary/90"
                                >
                                    Privacy policy
                                </a>
                            </p>
                        </form>
                    </CardContent>
                </Card>

                <p className="mt-6 text-center text-sm text-muted-foreground dark:text-muted-foreground">
                    Already have an account?{" "}
                    <a
                        href="#"
                        className="font-medium text-primary hover:text-primary/90 dark:text-primary hover:dark:text-primary/90"
                    >
                        Sign in
                    </a>
                </p>
            </div>
        </div>
    );
}