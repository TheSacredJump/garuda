'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

const CustomSignUpPage = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    if (!isLoaded) {
      return;
    }

    try {
      const result = await signUp.create({
        emailAddress: data.email,
        password: data.password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard"); // Redirect to dashboard after successful sign-up
      } else {
        console.error("Sign-up failed", result);
      }
    } catch (err: any) {
      console.error("Error during sign-up:", err.errors[0].message);
    }
  };

  const handleGoogleSignUp = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
      });
    } catch (err) {
      console.error("Error during Google sign-up:", err);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 from-35% via-eagle via-55% to-gray-950 to-75% relative overflow-hidden">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-gray-950 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      
      <motion.div 
        className="z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">Join Garuda</CardTitle>
            <CardDescription className="text-neutral-300">
              Sign up for AI-powered disaster response and analysis.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-neutral-200">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    {...register("email", { required: "Email is required", pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Invalid email address"
                    }})}
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-neutral-400"
                  />
                  {errors.email && (
                    <Alert variant="destructive" className="bg-red-500/20 border-red-500/50">
                      <AlertDescription>{errors.email.message as string}</AlertDescription>
                    </Alert>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-neutral-200">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    {...register("password", { required: "Password is required", minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters"
                    }})}
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-neutral-400"
                  />
                  {errors.password && (
                    <Alert variant="destructive" className="bg-red-500/20 border-red-500/50">
                      <AlertDescription>{errors.password?.message as string}</AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
              <Button type="submit" className="w-full mt-6 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white">
                Sign Up
              </Button>
            </form>
            
            <Separator className="my-6 bg-gray-700" />
            
            <Button 
              onClick={handleGoogleSignUp} 
              className="w-full bg-white text-gray-900 hover:bg-gray-100"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_13183_10121)"><path d="M20.3081 10.2303C20.3081 9.55056 20.253 8.86711 20.1354 8.19836H10.7031V12.0492H16.1046C15.8804 13.2911 15.1602 14.3898 14.1057 15.0879V17.5866H17.3282C19.2205 15.8449 20.3081 13.2728 20.3081 10.2303Z" fill="#3F83F8"/><path d="M10.7019 20.0006C13.3989 20.0006 15.6734 19.1151 17.3306 17.5865L14.1081 15.0879C13.2115 15.6979 12.0541 16.0433 10.7056 16.0433C8.09669 16.0433 5.88468 14.2832 5.091 11.9169H1.76562V14.4927C3.46322 17.8695 6.92087 20.0006 10.7019 20.0006V20.0006Z" fill="#34A853"/><path d="M5.08857 11.9169C4.66969 10.6749 4.66969 9.33008 5.08857 8.08811V5.51233H1.76688C0.348541 8.33798 0.348541 11.667 1.76688 14.4927L5.08857 11.9169V11.9169Z" fill="#FBBC04"/><path d="M10.7019 3.95805C12.1276 3.936 13.5055 4.47247 14.538 5.45722L17.393 2.60218C15.5852 0.904587 13.1858 -0.0287217 10.7019 0.000673888C6.92087 0.000673888 3.46322 2.13185 1.76562 5.51234L5.08732 8.08813C5.87733 5.71811 8.09302 3.95805 10.7019 3.95805V3.95805Z" fill="#EA4335"/></g><defs><clipPath id="clip0_13183_10121"><rect width="20" height="20" fill="white" transform="translate(0.5)"/></clipPath></defs>
              </svg>
              Sign up with Google
            </Button>
          </CardContent>
          <CardFooter>
            <p className="text-neutral-400 text-sm text-center w-full">
              Already have an account?{' '}
              <a href="/sign-in" className="text-orange-400 hover:text-orange-300">
                Log in
              </a>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default CustomSignUpPage;