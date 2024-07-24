import { Layout } from '@/components/layout';
import googleLogo from '@/assets/google-logo.svg';

export const Login = () => {
  return (
    <Layout className="flex items-center justify-center">
      <div className="flex max-w-sm flex-col items-center gap-4 rounded-3xl border border-neutral-200 border-opacity-40 bg-neutral-50 p-8 text-center">
        {/* <li>login with google or email otp</li> */}

        <p className="max-w-[70%] text-center text-neutral-700">Start using 💌 Innkeeper to for shadow work journaling</p>

        <a
          target="_blank"
          href="/auth/google/callback"
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-1.5 text-center text-sm font-normal text-neutral-800"
        >
          <img src={googleLogo} alt="" className="max-w-4" />
          <span>Continue with Google</span>
        </a>

        <p>OR</p>

        <div className="flex w-full flex-col gap-2">
          <input
            type="email"
            className="h-8 rounded-lg border border-neutral-500 border-opacity-40 bg-neutral-100 bg-transparent px-2 py-1 text-xs placeholder:text-neutral-500"
            placeholder="Enter email"
          />
          <button className="hover-bg-orange-600 w-full rounded-lg bg-[#FF4800] bg-gradient-to-r from-[#FF5C0A] to-[#F54100] py-1 text-sm font-medium text-neutral-50 duration-200">
            Send OTP
          </button>
        </div>

        <span className="max-w-[90%] text-xs text-neutral-600">
          By continuing, you agree to Olopo Studio's{' '}
          <a href="#" className="underline">
            Terms of Service
          </a>{' '}
          and acknowledge their{' '}
          <a href="#" className="underline">
            Privacy Policy
          </a>
        </span>
      </div>
    </Layout>
  );
};

const EnterEmail = () => {
  return (
    <div className="flex w-full flex-col gap-2">
      <input
        type="email"
        className="h-8 rounded-lg border border-neutral-500 border-opacity-40 bg-neutral-100 bg-transparent px-2 py-1 text-xs placeholder:text-neutral-500"
        placeholder="Enter email"
      />
      <button className="w-full rounded-lg border border-orange-500 bg-orange-500 py-1 text-sm font-medium text-neutral-50">
        Send OTP
      </button>
    </div>
  );
};

const EnterVerificationCode = () => {
  return (
    <div>
      <p>Enter the code generated from the link sent to [user]@[email].com</p>

      <div className="flex w-full flex-col gap-2">
        <input type="email" className="rounded-lg border py-1" placeholder="Enter OTP" />
        <button className="w-full rounded-lg bg-stone-950 py-1 text-stone-50">Verify OTP</button>
      </div>

      <div>Not seeing the email in your inbox? [Try sending again.]</div>
    </div>
  );
};
