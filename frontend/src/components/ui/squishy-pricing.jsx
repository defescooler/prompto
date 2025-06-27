import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

export const Component = () => {
  return (
    <section className="px-8 py-16">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-white mb-8"
          >
            Simple pricing, powerful prompts
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed"
          >
            Start free, unlock advanced features. Perfect prompts for every user.
          </motion.p>
        </div>
        
        <div className="flex flex-row justify-center items-start gap-4 max-w-3xl mx-auto">
          <PricingCard
            title="Free"
            subtitle="Hacker"
            price="0"
            period="/month"
            description="Perfect for getting started with AI prompt optimization"
            features={[
              "50 enhanced prompts/month",
              "Basic optimization techniques", 
              "Chrome extension access",
              "Public prompt library",
              "Access to Claude & Gemini",
              "Community support"
            ]}
            buttonText="Start for free"
            popular={false}
            delay={0}
          />
          <PricingCard
            title="Pro"
            subtitle="For professional developers"
            price="5.99"
            period="/month"
            description="Everything in Free, plus advanced features for power users"
            features={[
              "Everything in Free, plus...",
              "Unlimited prompt enhancements",
              "Advanced AI techniques (25+)",
              "Private prompt collections",
              "Analytics & insights dashboard",
              "Team collaboration tools",
              "API access integration",
              "Priority support"
            ]}
            buttonText="Upgrade to Pro"
            popular={true}
            delay={0.1}
          />
        </div>
      </div>
    </section>
  );
};

const PricingCard = ({ title, subtitle, price, period, description, features, buttonText, popular, delay }) => {
  const handleClick = () => {
    window.location.href = "/auth";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, delay }}
      className="flex-shrink-0 w-[300px] relative"
    >
      {popular && (
        <div className="absolute -top-3 right-6 z-20">
          <div className="bg-gradient-to-r from-brand-green to-emerald-400 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-lg">
            Popular
          </div>
        </div>
      )}

      <div 
        className={`relative h-full rounded-2xl p-4 backdrop-blur-md transition-all duration-300 hover:transform hover:scale-[1.02] ${
          popular 
            ? 'bg-slate-800/90 border-2 border-brand-green/50 shadow-2xl shadow-brand-green/20' 
            : 'bg-[#202635]/90 border border-slate-600/60 shadow-xl shadow-slate-900/30'
        }`}
      >
        {/* Background Glow Effects for Popular Card */}
        {popular && (
          <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
            <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-r from-brand-green/8 to-emerald-400/8 rounded-full blur-2xl animate-pulse" />
            <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-gradient-to-r from-emerald-400/6 to-brand-green/6 rounded-full blur-xl animate-pulse delay-1000" />
          </div>
        )}

        <div className="relative z-10 h-full flex flex-col">
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
            <p className="text-slate-400 text-xs font-medium">{subtitle}</p>
          </div>

          {/* Price - Fixed height and alignment for perfect row alignment */}
          <div className="mb-6">
            <div className="flex items-baseline justify-start h-16 min-h-[64px] w-full">
              <span className="text-3xl font-bold text-white leading-none tracking-tight">${price}</span>
              <span className="text-slate-400 ml-2 text-base leading-none whitespace-nowrap">{period}</span>
            </div>
          </div>

          {/* Features */}
          <div className="flex-1 mb-8">
            <ul className="space-y-4">
              {features.map((feature, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.4, delay: delay + (index * 0.05) }}
                  className="flex items-start gap-3"
                >
                  <div className="flex-shrink-0 flex items-center justify-center mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5 text-brand-green stroke-2" />
                  </div>
                  <span className="text-slate-300 text-sm leading-relaxed">{feature}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* CTA Button */}
          <motion.button 
            whileHover={{ 
              scale: 1.02, 
              y: -2,
              boxShadow: popular 
                ? "0 20px 40px rgba(34, 197, 94, 0.3)" 
                : "0 10px 30px rgba(255, 255, 255, 0.1)"
            }}
            whileTap={{ scale: 0.98 }}
            onClick={handleClick}
            className={`relative z-20 w-full rounded-full py-4 text-center font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent min-h-[56px] text-base ${
              popular 
                ? 'bg-gradient-to-r from-brand-green to-emerald-400 hover:from-emerald-400 hover:to-brand-green text-white shadow-xl focus:ring-brand-green/50'
                : 'bg-slate-700/80 hover:bg-slate-600/80 text-white border border-slate-500/50 shadow-lg focus:ring-slate-500/50 rounded-full'
            }`}
          >
            {buttonText}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}; 