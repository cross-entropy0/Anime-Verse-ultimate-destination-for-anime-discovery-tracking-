const Privacy = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-bold text-white mb-4">
          Privacy <span className="text-gradient">Policy</span>
        </h1>
        <p className="text-gray-400 mb-8">Last updated: November 26, 2025</p>

        <div className="bg-dark-200 rounded-lg p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
            <div className="text-gray-300 space-y-3">
              <p>
                When you use AnimeVerse, we collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Account information (username, email address, password)</li>
                <li>Profile information (avatar, preferences)</li>
                <li>Watchlist and rating data</li>
                <li>Reviews and comments you post</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
            <div className="text-gray-300 space-y-3">
              <p>We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Personalize your experience and provide recommendations</li>
                <li>Send you technical notices and support messages</li>
                <li>Monitor and analyze trends and usage</li>
                <li>Protect against fraudulent or illegal activity</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Data Sharing and Disclosure</h2>
            <div className="text-gray-300 space-y-3">
              <p>
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>With your consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and prevent fraud</li>
                <li>In connection with a business transfer or acquisition</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Data Security</h2>
            <div className="text-gray-300 space-y-3">
              <p>
                We implement appropriate security measures to protect your personal information. Your password is encrypted, and we use secure protocols for data transmission. However, no method of transmission over the internet is 100% secure.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Cookies and Tracking</h2>
            <div className="text-gray-300 space-y-3">
              <p>
                We use cookies and similar tracking technologies to enhance your experience, analyze usage patterns, and remember your preferences. You can control cookies through your browser settings.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Third-Party Services</h2>
            <div className="text-gray-300 space-y-3">
              <p>
                AnimeVerse uses data from MyAnimeList via the Jikan API. Please refer to MyAnimeList's privacy policy for information about how they handle data.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Your Rights</h2>
            <div className="text-gray-300 space-y-3">
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access and update your personal information</li>
                <li>Delete your account and associated data</li>
                <li>Opt-out of marketing communications</li>
                <li>Request a copy of your data</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Children's Privacy</h2>
            <div className="text-gray-300 space-y-3">
              <p>
                AnimeVerse is not intended for users under 13 years of age. We do not knowingly collect personal information from children under 13.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Changes to This Policy</h2>
            <div className="text-gray-300 space-y-3">
              <p>
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Contact Us</h2>
            <div className="text-gray-300 space-y-3">
              <p>
                If you have any questions about this Privacy Policy, please contact us at:{' '}
                <a href="mailto:privacy@animeverse.com" className="text-primary hover:text-secondary">
                  privacy@animeverse.com
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
