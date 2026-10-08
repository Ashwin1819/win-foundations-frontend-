import Link from 'next/link';

export default function CTAStrip() {
  return (
    <section className="bg-[linear-gradient(to_bottom,#ffffff_0%,#2563eb_12%,#1e40af_100%)] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Make an Impact?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join us in our mission to create positive change. Whether you donate, volunteer, or simply spread the word, every contribution matters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/donate"
              className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-green-600 hover:text-white active:bg-green-600 active:text-white hover:-translate-y-0.5 shadow-md hover:shadow-lg transition-all duration-150 inline-block"
            >
              Donate Now
            </Link>
            <Link
              href="/volunteer"
              className="px-8 py-3 bg-transparent text-white border-2 border-white/70 font-semibold rounded-lg hover:bg-white hover:text-blue-700 hover:border-white hover:-translate-y-0.5 transition-all duration-300 inline-block"
            >
              Volunteer With Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
