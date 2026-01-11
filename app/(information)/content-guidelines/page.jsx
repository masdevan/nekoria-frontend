import { Navbar } from "@/components/navbar"

export default function ContentGuidelinesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mt-16 px-4 py-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Content Guidelines</h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-4">Content Standards</h2>
            <p className="text-muted-foreground leading-relaxed">
              Nekoria is committed to providing high-quality, family-friendly content. All content on our platform is
              carefully curated and reviewed to ensure it meets our community standards and provides an enjoyable
              viewing experience for all users.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Age Ratings</h2>
            <p className="text-muted-foreground leading-relaxed">
              We provide clear age ratings for all content to help users make informed decisions about what they watch.
              Content is categorized as All Ages, Teen, or Mature based on themes, language, and content matter.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Prohibited Content</h2>
            <div className="space-y-2">
              <p className="text-muted-foreground leading-relaxed">We do not allow content that contains:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Excessive violence or graphic content</li>
                <li>Hate speech or discriminatory content</li>
                <li>Content that promotes illegal activities</li>
                <li>Spam or misleading information</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">User-Generated Content</h2>
            <p className="text-muted-foreground leading-relaxed">
              Users may contribute reviews, comments, and ratings. All user-generated content must comply with our
              community guidelines and will be moderated to ensure a positive environment for all users.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Reporting Content</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you encounter content that violates our guidelines, please report it to us at content@nekoria.com. We
              review all reports and take appropriate action when necessary.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
