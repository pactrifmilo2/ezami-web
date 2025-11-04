import { ForgotPasswordForm } from 'src/shared/components/auth/ForgotPasswordForm';
import { Metadata } from 'next';

// --- SEO Best Practice ---
// Export a 'metadata' object from the PAGE file.
// This is a Server-Side feature, so Google gets it instantly.
export const metadata: Metadata = {
  // The <title> tag for the browser tab and search results.
  title: 'Forgot Your Password | Ezami Web',

  // A description for search engine results.
  description: 'Reset your Ezami Web account password. Enter your email to receive a reset link.',

  // --- CRITICAL SEO for Auth Pages ---
  // We tell search engines NOT to index this page (noindex)
  // and not to follow links from it (nofollow).
  // You don't want your login/register pages appearing in search results.
  robots: {
    index: false,
    follow: false,
  },
};
// --- End SEO ---

// This is the page component. It's a Server Component by default.
export default function ForgotPasswordPage() {
  // It renders your interactive Client Component inside it.
  // This is the best-practice "Server-First" model.
  return <ForgotPasswordForm />;
}
