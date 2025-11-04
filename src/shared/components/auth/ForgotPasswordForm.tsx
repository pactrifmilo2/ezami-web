// This directive is REQUIRED for components that use React Hooks like useState and event handlers like onSubmit.
'use client';

// Import React's built-in hook for managing component state.
import { useState } from 'react';

// Import your custom hook for handling translations.
import { useTranslation } from 'src/shared/hooks/useTranslation';

/**
 * A client component form for handling the "forgot password" flow.
 * It collects the user's email and submits it to an API endpoint.
 */
export function ForgotPasswordForm() {
  // Get the translation function 't' from your hook.
  const { t } = useTranslation();

  // --- State Management ---

  // State to store the value of the email input field.
  const [email, setEmail] = useState('');

  // State to toggle the UI to a "success" message after submission.
  const [isSubmitted, setIsSubmitted] = useState(false);

  // State to hold any error messages from the server (e.g., "User not found").
  const [error, setError] = useState<string | null>(null);

  // NEW: State to manage the loading status while the form is submitting.
  // This is a best practice to provide user feedback and prevent double-clicks.
  const [isLoading, setIsLoading] = useState(false);

  // --- Form Submission Handler ---

  /**
   * Handles the form's submit event.
   * This function is async because it performs a network request (fetch).
   */
  const handleSubmit = async (e: React.FormEvent) => {
    // Prevent the default browser action of a full-page reload.
    e.preventDefault();

    // Clear any previous errors when the user tries again.
    setError(null);

    // Set loading to true to disable the button and show a spinner (optional).
    setIsLoading(true);

    try {
      // --- API Call ---
      // Send the user's email to your backend API route.
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      // Handle a failed request from the server.
      if (!response.ok) {
        // Try to parse the error message from the server's response.
        const errorData = await response.json();
        // Set the error state to display the message to the user.
        setError(errorData.message || t('auth.errorDefault'));
      } else {
        // Handle a successful request.
        // Set isSubmitted to true to show the "Check your email" message.
        setIsSubmitted(true);
      }
    } catch (networkError) {
      // Catch any network errors (e.g., user is offline).
      setError(t('auth.errorNetwork'));
      console.error('Network error:', networkError);
    } finally {
      // This block runs whether the request succeeded or failed.
      // Set loading back to false to re-enable the button.
      setIsLoading(false);
    }
  };

  // --- Render Logic ---

  // If the form was submitted successfully, show a confirmation message.
  if (isSubmitted) {
    return (
      <div className='rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800'>
        <h2 className='text-center text-xl font-semibold text-gray-900 dark:text-white'>{t('auth.checkYourEmail')}</h2>
        <p className='mt-4 text-center text-sm text-gray-600 dark:text-gray-300'>{t('auth.resetLinkSent')}</p>
      </div>
    );
  }

  // Otherwise, show the password reset form.
  return (
    <div className='w-full rounded-lg border bg-white p-6 shadow-sm md:p-8 dark:border-gray-700 dark:bg-gray-800'>
      {/* Page Title: Good for accessibility and clarity. */}
      <h1 className='pb-4 text-center text-2xl font-bold text-gray-900 dark:text-white'>
        {t('auth.forgotPasswordTitle')}
      </h1>

      {/* Helper Text: Clearly explains what the user should do. */}
      <p className='mb-6 text-center text-sm text-gray-600 dark:text-gray-300'>{t('auth.forgotPasswordSubtext')}</p>

      {/* We pass our handleSubmit function to the form's onSubmit event.
        `noValidate` disables browser-native HTML5 validation popups, 
        allowing our custom error handling to take charge.
      */}
      <form className='space-y-6' onSubmit={handleSubmit} noValidate>
        {/* Error Display: This block only renders if the 'error' state is not null. */}
        {error && (
          <div className='rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700' role='alert'>
            {error}
          </div>
        )}

        <div>
          {/* Using `htmlFor` on the label and a matching `id` on the input
            is crucial for accessibility. It links them, so clicking the
            label focuses the input.
          */}
          <label htmlFor='email' className='block text-sm font-medium'>
            {t('auth.email')}
          </label>
          <input
            id='email'
            type='email'
            value={email} // Control the input value with React state.
            onChange={(e) => setEmail(e.target.value)} // Update state on every keystroke.
            className='border-input bg-background mt-1 w-full rounded-md border px-3 py-2 dark:border-gray-600 dark:bg-gray-700'
            required // Still useful for mobile keyboards (shows '@') and accessibility.
            aria-invalid={error ? 'true' : 'false'} // Accessibility hint
            aria-describedby={error ? 'error-message' : undefined} // Link to error
          />
        </div>
        <div>
          <button
            type='submit'
            className='bg-primary text-primary-foreground w-full rounded-md px-4 py-2 disabled:opacity-50'
            disabled={isLoading} // Disable the button while loading.
          >
            {/* Show a different text while loading for better UX */}
            {isLoading ? t('auth.sending') : t('auth.sendResetLink')}
          </button>
        </div>
      </form>
    </div>
  );
}
