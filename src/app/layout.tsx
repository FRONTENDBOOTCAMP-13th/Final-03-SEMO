import Link from "next/link";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <ul>
          <li>
            <Link href="/login">login</Link>
          </li>
          <li>
            <Link href="/onBoarding">onBoarding</Link>
          </li>
          <li>
            <Link href="/signup">signup</Link>
          </li>
          <li>
            <Link href="/school/buyMarket">buyMarket</Link>
          </li>
          <li>
            <Link href="/school/buyMarket/new">buyMarket/new</Link>
          </li>
          <li>
            <Link href="/school/buyMarket/postId">buyMarket/postId</Link>
          </li>
          <li>
            <Link href="/school/chat">chat</Link>
          </li>
          <li>
            <Link href="/school/chat/chatId">chatId</Link>
          </li>
          <li>
            <Link href="/school/sellMarket">sellMarket</Link>
          </li>
          <li>
            <Link href="/school/sellMarket/new">sellMarket/new</Link>
          </li>
          <li>
            <Link href="/school/sellMarket/postId">sellMarket/postId</Link>
          </li>
          <li>
            <Link href="/school/myPage">myPage</Link>
          </li>
        </ul>
        {children}
      </body>
    </html>
  );
}
