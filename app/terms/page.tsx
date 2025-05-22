import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | Kaivlya",
  description: "Terms and conditions for using kaivlya.com",
}

export default function TermsPage() {
  return (
    <div className="container max-w-4xl py-12">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using kaivlya.com, you accept and agree to be bound by the terms and provision of this agreement.
        </p>

        <h2>2. Use License</h2>
        <p>
          Permission is granted to temporarily access the materials (information or software) on kaivlya.com for personal, 
          non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this 
          license you may not:
        </p>
        <ul>
          <li>Modify or copy the materials</li>
          <li>Use the materials for any commercial purpose</li>
          <li>Attempt to decompile or reverse engineer any software contained on kaivlya.com</li>
          <li>Remove any copyright or other proprietary notations from the materials</li>
          <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
        </ul>

        <h2>3. External Resources</h2>
        <p>
          The resources and links provided on this website are for informational and educational purposes only. 
          We do not claim ownership of any external content linked herein. Users are responsible for:
        </p>
        <ul>
          <li>Verifying the legality of their use of these resources</li>
          <li>Complying with all applicable laws and regulations</li>
          <li>Respecting intellectual property rights</li>
          <li>Using the resources in accordance with their respective terms of service</li>
        </ul>

        <h2>4. Disclaimer</h2>
        <p>
          The materials on kaivlya.com are provided on an 'as is' basis. We make no warranties, expressed or implied, 
          and hereby disclaim and negate all other warranties including, without limitation, implied warranties or 
          conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual 
          property or other violation of rights.
        </p>

        <h2>5. Limitations</h2>
        <p>
          In no event shall kaivlya.com or its suppliers be liable for any damages (including, without limitation, 
          damages for loss of data or profit, or due to business interruption) arising out of the use or inability 
          to use the materials on kaivlya.com.
        </p>

        <h2>6. Revisions and Errata</h2>
        <p>
          The materials appearing on kaivlya.com could include technical, typographical, or photographic errors. 
          We do not warrant that any of the materials on its website are accurate, complete, or current. We may 
          make changes to the materials contained on its website at any time without notice.
        </p>

        <h2>7. Links</h2>
        <p>
          We have not reviewed all of the sites linked to its website and are not responsible for the contents 
          of any such linked site. The inclusion of any link does not imply endorsement by kaivlya.com of the site. 
          Use of any such linked website is at the user's own risk.
        </p>

        <h2>8. Modifications</h2>
        <p>
          We may revise these terms of service for its website at any time without notice. By using this website, 
          you are agreeing to be bound by the then current version of these terms of service.
        </p>

        <h2>9. Governing Law</h2>
        <p>
          These terms and conditions are governed by and construed in accordance with the laws and you irrevocably 
          submit to the exclusive jurisdiction of the courts in that location.
        </p>

        <h2>10. Contact Information</h2>
        <p>
          If you have any questions about these Terms of Service, please contact us at{' '}
          <a href="mailto:contact@kaivlya.com" className="text-primary hover:underline">
            contact@kaivlya.com
          </a>
        </p>
      </div>
    </div>
  )
} 