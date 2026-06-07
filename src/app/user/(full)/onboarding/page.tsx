import { OnboardingFlow } from "@/components/user/OnboardingFlow";

export default function OnboardingPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-surface px-margin-mobile">
      <OnboardingFlow />

      {/* Atmospheric decoration */}
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-40">
        <div className="absolute left-[-10%] top-[-10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-secondary/5 blur-[100px]" />
      </div>
    </div>
  );
}
