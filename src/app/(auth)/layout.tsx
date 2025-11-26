export const metadata = {
  title: "Login - Pod Management",
  description: "Login to Pod Management",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-muted/40">
      {children}
    </div>
  );
}
