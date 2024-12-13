const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">About PushNshop</h1>
      <div className="prose dark:prose-invert max-w-none">
        <p className="mb-4">
          PushNshop is a mobile-first ecommerce auction platform featuring permanent product links,
          seller listing management, and direct buyer-seller communication via WhatsApp.
        </p>
        <p className="mb-4">
          Our platform supports 120 concurrent product listings with automatic rotation,
          ensuring fair visibility for all sellers while maintaining a clean and organized
          marketplace for buyers.
        </p>
        <h2 className="text-2xl font-bold mt-8 mb-4">Key Features</h2>
        <ul className="list-disc pl-6 mb-6">
          <li>Direct WhatsApp communication between buyers and sellers</li>
          <li>120 permanent product links with automatic rotation</li>
          <li>Multiple currency support (XAF and USD)</li>
          <li>Flexible listing durations</li>
          <li>Mobile-first design</li>
          <li>Real-time updates</li>
        </ul>
      </div>
    </div>
  );
};

export default AboutPage;