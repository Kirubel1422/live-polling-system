import { RegisterForm } from "@/components/register";

export default function Register() {
  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{ backgroundColor: "oklch(0.98 0.008 214)" }}>
      <div className="absolute -top-20 -left-16 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "oklch(0.71 0.09 158 / 0.18)", filter: "blur(60px)" }} />
      <div className="absolute -bottom-16 -right-10 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: "oklch(0.62 0.1 214 / 0.15)", filter: "blur(60px)" }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, oklch(0.62 0.1 214 / 0.15) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      <div className="relative z-10 w-full flex justify-center">
        <RegisterForm />
      </div>
    </div>
  );
}