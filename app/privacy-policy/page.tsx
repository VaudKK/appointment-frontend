export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: March 11, 2026
        </p>

        <section className="mt-6 rounded-lg border border-border bg-card p-6 text-sm leading-relaxed">
          <p className="mt-4">
            <strong className="block">1. Information We Collect</strong>
            We may collect the following information: personal information (name, email address, phone number, account login details), booking information (services booked, appointment times, store interactions), and technical data (IP address, device information, browser type, usage analytics).
          </p>

          <p className="mt-4">
            <strong className="block">2. How We Use Information</strong>
            We use collected data to operate and maintain the Platform, process bookings, manage user accounts, improve platform features, provide customer support, and prevent fraud and abuse.
          </p>

          <p className="mt-4">
            <strong className="block">3. Sharing of Information</strong>
            We may share information with Store Owners when customers make bookings, and with third-party providers such as payment processors, hosting providers, analytics services, and communication tools. These providers may only use the information to support the Platform.
          </p>

          <p className="mt-4">
            <strong className="block">4. Data Security</strong>
            We implement reasonable security measures to protect your information. However, no online system can guarantee absolute security.
          </p>

          <p className="mt-4">
            <strong className="block">5. Data Retention</strong>
            We retain personal data only as long as necessary to operate the Platform, comply with legal obligations, and resolve disputes.
          </p>

          <p className="mt-4">
            <strong className="block">6. Your Rights</strong>
            Depending on your jurisdiction, you may have the right to access your personal data, request correction, request deletion, and withdraw consent.
          </p>

          <p className="mt-4">
            <strong className="block">7. Cookies</strong>
            The Platform may use cookies to improve user experience, remember login sessions, and analyze website traffic. Users may control cookies through browser settings.
          </p>

          <p className="mt-4">
            <strong className="block">8. Children's Privacy</strong>
            The Platform is not intended for individuals under 18 years old. We do not knowingly collect personal data from children.
          </p>

          <p className="mt-4">
            <strong className="block">9. Changes to Privacy Policy</strong>
            We may update this policy periodically. Users will be notified of major changes through the Platform.
          </p>
        </section>
      </div>
    </main>
  )
}
