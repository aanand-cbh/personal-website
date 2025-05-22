import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | Kaivlya",
  description: "Privacy policy for kaivlya.com",
}

export default function PrivacyPage() {
  return (
    <div className="container max-w-4xl py-12">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

        <h2>1. Information We Collect</h2>
        <p>
          We collect information that you provide directly to us, including:
        </p>
        <ul>
          <li>Contact information (such as email address) when you choose to contact us</li>
          <li>Usage data and analytics through Vercel Analytics</li>
          <li>Performance metrics through Vercel Speed Insights</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>
          We use the information we collect to:
        </p>
        <ul>
          <li>Provide, maintain, and improve our website</li>
          <li>Respond to your comments and questions</li>
          <li>Monitor and analyze trends and usage</li>
          <li>Detect, prevent, and address technical issues</li>
        </ul>

        <h2>3. Analytics and Performance Monitoring</h2>
        <p>
          We use Vercel Analytics and Speed Insights to understand how our website is being used and to improve its 
          performance. These services may collect information such as:
        </p>
        <ul>
          <li>Pages visited</li>
          <li>Time spent on pages</li>
          <li>Device and browser information</li>
          <li>Performance metrics</li>
        </ul>

        <h2>4. Cookies and Similar Technologies</h2>
        <p>
          We use cookies and similar tracking technologies to track activity on our website. You can instruct your 
          browser to refuse all cookies or to indicate when a cookie is being sent.
        </p>

        <h2>5. Data Security</h2>
        <p>
          We take reasonable measures to help protect your personal information from loss, theft, misuse, unauthorized 
          access, disclosure, alteration, and destruction.
        </p>

        <h2>6. Third-Party Services</h2>
        <p>
          Our website may contain links to third-party websites and services. We are not responsible for the privacy 
          practices of these third parties. We encourage you to read their privacy policies.
        </p>

        <h2>7. Children's Privacy</h2>
        <p>
          Our website is not directed to children under 13. We do not knowingly collect personal information from 
          children under 13.
        </p>

        <h2>8. Changes to This Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
          Privacy Policy on this page and updating the "Last updated" date.
        </p>

        <h2>9. Your Rights</h2>
        <p>
          Depending on your location, you may have certain rights regarding your personal information, such as:
        </p>
        <ul>
          <li>The right to access your personal information</li>
          <li>The right to correct inaccurate information</li>
          <li>The right to request deletion of your information</li>
          <li>The right to object to processing of your information</li>
        </ul>
      </div>
    </div>
  )
} 