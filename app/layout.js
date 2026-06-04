import "./globals.css";

export const metadata = {
  title: "AI 와인 운영 및 콜키지 추천 플랫폼",
  description: "Supabase Auth 기반 와인 운영 MVP",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full bg-[#f6f2ec] text-[#3f352f]">{children}</body>
    </html>
  );
}
