import React from 'react';
import { MailCheck } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const VerificationRequired = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-200 to-indigo-300 pt-16 px-4">
      <Card className="max-w-md mx-auto bg-white/90 backdrop-blur shadow-xl">
        <CardHeader className="flex flex-col items-center space-y-2 pb-2">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
            <MailCheck className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Email Verification Required
          </h2>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            Please verify your email address to access this content.
          </p>
          <p className="text-gray-600">
            Check your inbox for the verification link we sent you.
          </p>
          <p className="text-sm text-gray-500 italic">
            If you haven't received the email, please check your spam folder.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerificationRequired;