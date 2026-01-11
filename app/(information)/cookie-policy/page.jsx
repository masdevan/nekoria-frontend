import { Navbar } from "@/components/navbar"

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mt-16 px-4 py-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Cookie Policy</h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-4">What Are Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              Cookies are small text files that are stored on your device when you visit our website. They help us
              provide you with a better experience by remembering your preferences and understanding how you use our
              service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Types of Cookies We Use</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Essential Cookies</h3>
                <p className="text-muted-foreground leading-relaxed">
                  These cookies are necessary for the website to function properly. They enable basic functions like
                  page navigation and access to secure areas of the website.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Analytics Cookies</h3>
                <p className="text-muted-foreground leading-relaxed">
                  These cookies help us understand how visitors interact with our website by collecting and reporting
                  information anonymously.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Preference Cookies</h3>
                <p className="text-muted-foreground leading-relaxed">
                  These cookies remember your preferences and settings to provide you with a more personalized
                  experience.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Managing Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              You can control and manage cookies in various ways. Most browsers allow you to refuse cookies or delete
              cookies. However, if you do this, some features of our website may not function properly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Updates to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new
              policy on this page.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
