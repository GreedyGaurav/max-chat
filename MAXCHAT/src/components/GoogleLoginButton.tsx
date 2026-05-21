"use client";

import { GoogleLogin } from "@react-oauth/google";

export default function GoogleLoginButton({
  onSuccess,
}: {
  onSuccess: (token: string) => void;
}) {
  return (
    <div className="w-full">
      <GoogleLogin
        onSuccess={(res) => {
          if (res.credential) {
            onSuccess(res.credential);
          }
        }}
        onError={() => {
          alert("Google login failed");
        }}
        useOneTap={false}
        theme="outline"
        size="large"
        text="continue_with"
        shape="rectangular"
        width="100%"
      />
    </div>
  );
}
