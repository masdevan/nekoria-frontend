import { Navbar } from "@/components/navbar"

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mt-16 px-4 py-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-4">Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using Nekoria streaming service, you accept and agree to be bound by the terms and
              provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Service Description</h2>
            <p className="text-muted-foreground leading-relaxed">
              Nekoria provides a streaming platform that allows users to watch anime and other video content. The
              service is provided "as is" and we reserve the right to modify, suspend, or discontinue the service at any
              time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">User Responsibilities</h2>
            <p className="text-muted-foreground leading-relaxed">
              Users are responsible for maintaining the confidentiality of their account information and for all
              activities that occur under their account. You agree not to use the service for any unlawful purpose or in
              any way that could damage the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              All content available on Nekoria, including but not limited to text, graphics, logos, images, and
              software, is the property of Nekoria or its content suppliers and is protected by copyright and other
              intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              Nekoria shall not be liable for any indirect, incidental, special, consequential, or punitive damages
              resulting from your use of the service.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
