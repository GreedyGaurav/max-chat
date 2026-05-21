"use client";

import { GoogleLogin } from "@react-oauth/google";

type Props = {
  onSuccess: (token: string) => void;
  onError?: () => void;
};

export default function GoogleLoginButton({ onSuccess, onError }: Props) {
  return (
    <div className="w-full">
      <GoogleLogin
        onSuccess={(res) => {
          if (res.credential) onSuccess(res.credential);
        }}
        onError={onError}
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
