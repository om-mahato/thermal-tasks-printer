import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Thermal Task Manager</title>
        <meta
          name="description"
          content="Create, track, and print JIRA-style tickets"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
