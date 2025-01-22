Password-based Auth
Allow users to sign in with a password connected to their email or phone number.

Users often expect to sign in to your site with a password. Supabase Auth helps you implement password-based auth safely, using secure configuration options and best practices for storing and verifying passwords.

Users can associate a password with their identity using their email address or a phone number.

With email#

Enabling email and password-based authentication#

Email authentication is enabled by default.

You can configure whether users need to verify their email to sign in. On hosted Supabase projects, this is true by default. On self-hosted projects or in local development, this is false by default.

Change this setting on the Auth Providers page for hosted projects, or in the configuration file for self-hosted projects.

Signing up with an email and password#

There are two possible flows for email signup: implicit flow and PKCE flow. If you're using SSR, you're using the PKCE flow. If you're using client-only code, the default flow depends upon the client library. The implicit flow is the default in JavaScript and Dart, and the PKCE flow is the default in Swift.

The instructions in this section assume that email confirmations are enabled.


Implicit flow

PKCE flow
The implicit flow only works for client-only apps. Your site directly receives the access token after the user confirms their email.


JavaScript

Dart

Swift

Kotlin

Python
To sign up the user, call signUp() with their email address and password.

You can optionally specify a URL to redirect to after the user clicks the confirmation link. This URL must be configured as a Redirect URL, which you can do in the dashboard for hosted projects, or in the configuration file for self-hosted projects.

If you don't specify a redirect URL, the user is automatically redirected to your site URL. This defaults to localhost:3000, but you can also configure this.

async function signUpNewUser() {
  const { data, error } = await supabase.auth.signUp({
    email: 'valid.email@supabase.io',
    password: 'example-password',
    options: {
      emailRedirectTo: 'https://example.com/welcome',
    },
  })
}

Signing in with an email and password#


JavaScript

Dart

Swift

Kotlin

Python
When your user signs in, call signInWithPassword() with their email address and password:

async function signInWithEmail() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'valid.email@supabase.io',
    password: 'example-password',
  })
}

Resetting a password#


Implicit flow

PKCE flow
Step 1: Create a reset password page#

Create a reset password page. This page should be publicly accessible.

Collect the user's email address and request a password reset email. Specify the redirect URL, which should point to the URL of a change password page. This URL needs to be configured in your redirect URLs.


JavaScript

Swift

Kotlin

Python
await supabase.auth.resetPasswordForEmail('valid.email@supabase.io', {
  redirectTo: 'http://example.com/account/update-password',
})

Step 2: Create a change password page#

Create a change password page at the URL you specified in the previous step. This page should be accessible only to authenticated users.

Collect the user's new password and call updateUser to update their password.


JavaScript

Swift

Kotlin

Python
await supabase.auth.updateUser({ password: new_password })

Email sending#

The signup confirmation and password reset flows require an SMTP server to send emails.

The Supabase platform comes with a default email-sending service for you to try out. The service has a rate limit of 2 emails per hour, and availability is on a best-effort basis. For production use, you should consider configuring a custom SMTP server.

Consider configuring a custom SMTP server for production.
See the Custom SMTP guide for instructions.

Local development with Inbucket#

You can test email flows on your local machine. The Supabase CLI automatically captures emails sent locally by using Inbucket.

In your terminal, run supabase status to get the Inbucket URL. Go to this URL in your browser, and follow the instructions to find your emails.