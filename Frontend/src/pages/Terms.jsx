const Terms = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-bold text-white mb-4">
          Terms of <span className="text-gradient">Service</span>
        </h1>
        <p className="text-gray-400 mb-8">Last updated: November 26, 2025</p>

        <div className="bg-dark-200 rounded-lg p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <div className="text-gray-300 space-y-3">
              <p>
                By accessing and using AnimeVerse, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our service.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Use License</h2>
            <div className="text-gray-300 space-y-3">
              <p>
                Permission is granted to temporarily access AnimeVerse for personal, non-commercial use. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose</li>
                <li>Attempt to reverse engineer any software</li>
                <li>Remove any copyright or proprietary notations</li>
                <li>Transfer the materials to another person</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. User Accounts</h2>
            <div className="text-gray-300 space-y-3">
              <p>When you create an account with us, you must provide accurate and complete information. You are responsible for:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Maintaining the security of your account and password</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. User Content</h2>
            <div className="text-gray-300 space-y-3">
              <p>
                By posting content on AnimeVerse (reviews, comments, ratings), you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and display that content. You represent that:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You own or have the right to use the content you post</li>
                <li>Your content does not violate any third-party rights</li>
                <li>Your content does not contain harmful or illegal material</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Prohibited Activities</h2>
            <div className="text-gray-300 space-y-3">
              <p>You agree not to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Use the service for any unlawful purpose</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Post spam or unsolicited advertisements</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Use automated systems to access the service</li>
                <li>Impersonate any person or entity</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Intellectual Property</h2>
            <div className="text-gray-300 space-y-3">
              <p>
                The service and its original content (excluding user-generated content) are and will remain the exclusive property of AnimeVerse. Anime data is provided by MyAnimeList via the Jikan API and remains their property.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Termination</h2>
            <div className="text-gray-300 space-y-3">
              <p>
                We may terminate or suspend your account immediately, without prior notice, for any reason, including breach of these Terms. Upon termination, your right to use the service will immediately cease.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Disclaimer</h2>
            <div className="text-gray-300 space-y-3">
              <p>
                The service is provided on an "AS IS" and "AS AVAILABLE" basis. AnimeVerse makes no warranties, expressed or implied, regarding the service, including but not limited to accuracy, reliability, or availability.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Limitation of Liability</h2>
            <div className="text-gray-300 space-y-3">
              <p>
                In no event shall AnimeVerse be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the service.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Changes to Terms</h2>
            <div className="text-gray-300 space-y-3">
              <p>
                We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the new Terms of Service on this page.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">11. Governing Law</h2>
            <div className="text-gray-300 space-y-3">
              <p>
                These Terms shall be governed and construed in accordance with applicable laws, without regard to its conflict of law provisions.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">12. Contact Information</h2>
            <div className="text-gray-300 space-y-3">
              <p>
                If you have any questions about these Terms, please contact us at:{' '}
                <a href="mailto:legal@animeverse.com" className="text-primary hover:text-secondary">
                  legal@animeverse.com
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
