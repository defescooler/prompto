import { motion } from 'framer-motion';

export const Component = () => {
  return (
    <section className="px-4 py-24 transition-colors">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Simple pricing, powerful results
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Start free, scale with usage. Pay only when you enhance prompts.
          </p>
        </div>
        
        <div className="mx-auto flex justify-center items-center gap-8 max-w-4xl">
          <PricingCard
            label="Starter"
            monthlyPrice="Free"
            description="Perfect for getting started with AI prompt optimization"
            features={[
              "20 enhanced prompts/month",
              "Basic compression techniques",
              "Browser extension",
              "Community support"
            ]}
            cta="Get Started"
            background="bg-slate-800 border-slate-700"
            popular={false}
            BGComponent={BGComponent1}
          />
          <PricingCard
            label="Pro"
            monthlyPrice="12"
            description="For power users who want unlimited prompt enhancement"
            features={[
              "400 enhanced prompts/month",
              "All 25+ AI techniques",
              "Advanced compression",
              "Email support <24h"
            ]}
            cta="Get Pro"
            background="bg-gradient-to-br from-green-600 to-green-700"
            popular={false}
            BGComponent={BGComponent2}
          />
        </div>
      </div>
    </section>
  );
};

const PricingCard = ({ label, monthlyPrice, description, features, cta, background, popular, BGComponent }) => {
  const handleClick = () => {
    if (cta === "Get Started" || cta === "Get Pro") {
      window.location.href = "/auth";
    } else if (cta === "Book Demo") {
      window.location.href = "/demo";
    }
  };
  return (
    <motion.div
      whileHover="hover"
      transition={{ duration: 0.6, ease: "backInOut" }}
      variants={{ hover: { scale: 1.02, y: -8 } }}
      className={`relative h-[520px] w-80 shrink-0 overflow-hidden rounded-2xl p-6 ${background} shadow-xl hover:shadow-2xl transition-shadow border border-slate-600/50`}
    >
      <div className="relative z-10 text-white h-full flex flex-col">
        <div className="flex-1">
          <span className="mb-6 block w-fit rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 text-sm font-semibold text-white border border-white/20">
            {label}
          </span>
          
          <div className="mb-6">
            <motion.div
              initial={{ scale: 0.9 }}
              variants={{ hover: { scale: 1 } }}
              transition={{ duration: 0.6, ease: "backInOut" }}
              className="origin-top-left"
            >
              {monthlyPrice === "Free" ? (
                <span className="font-['Montserrat'] text-6xl font-black leading-[1.1] text-white">
                  Free
                </span>
              ) : (
                <span className="font-['Montserrat'] text-6xl font-black leading-[1.1] text-white">
                  ${monthlyPrice}<span className="text-3xl font-normal">/mo</span>
                </span>
              )}
            </motion.div>
          </div>
          
          <p className="text-white/90 mb-8 leading-relaxed text-base">{description}</p>
          
          <ul className="space-y-4 text-sm h-40 flex flex-col justify-start">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3 text-white/90">
                <svg className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mt-6">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleClick}
            className="w-full rounded-xl border-2 border-white bg-white py-4 text-center font-semibold text-slate-900 backdrop-blur-sm transition-all duration-200 hover:bg-white/90 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent"
          >
            {cta}
          </motion.button>
        </div>
      </div>
      
      <BGComponent />
    </motion.div>
  );
};

const BGComponent1 = () => (
  <motion.svg
    width="320"
    height="520"
    viewBox="0 0 320 520"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    variants={{ hover: { scale: 1.1, rotate: 5 } }}
    transition={{ duration: 0.6, ease: "backInOut" }}
    className="absolute inset-0 z-0"
  >
    <motion.circle
      variants={{ hover: { scale: 1.2, x: 20 } }}
      transition={{ duration: 0.8, ease: "backInOut", delay: 0.1 }}
      cx="160"
      cy="140"
      r="80"
      fill="rgba(148, 163, 184, 0.1)"
    />
    <motion.circle
      variants={{ hover: { scale: 0.8, x: -20 } }}
      transition={{ duration: 0.8, ease: "backInOut", delay: 0.2 }}
      cx="160"
      cy="340"
      r="60"
      fill="rgba(148, 163, 184, 0.05)"
    />
  </motion.svg>
);

const BGComponent2 = () => (
  <motion.svg
    width="320"
    height="520"
    viewBox="0 0 320 520"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    variants={{ hover: { scale: 1.05 } }}
    transition={{ duration: 0.6, ease: "backInOut" }}
    className="absolute inset-0 z-0"
  >
    <motion.path
      variants={{ hover: { rotate: 15, scale: 1.1 } }}
      transition={{ duration: 0.8, ease: "backInOut", delay: 0.1 }}
      d="M80 120L240 120L200 220L120 220Z"
      fill="rgba(255, 255, 255, 0.1)"
    />
    <motion.path
      variants={{ hover: { rotate: -10, scale: 0.9 } }}
      transition={{ duration: 0.8, ease: "backInOut", delay: 0.2 }}
      d="M60 300L280 300L260 400L80 400Z"
      fill="rgba(255, 255, 255, 0.05)"
    />
  </motion.svg>
); 