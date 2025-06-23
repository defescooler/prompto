import { Link } from 'react-router-dom'

export default function Footer({
  logo,
  brandName,
  socialLinks = [],
  mainLinks = [],
  legalLinks = [],
  copyright,
}) {
  return (
    <footer className="bg-slate-950 text-slate-400 py-12" data-slot="footer-root">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:justify-between gap-12">
          {/* Branding */}
          <div className="flex-shrink-0 space-y-4 max-w-xs">
            <div className="flex items-center space-x-3 text-white">
              {logo}
              {brandName && <span className="text-xl font-bold">{brandName}</span>}
            </div>
            {copyright?.text && (
              <p className="text-sm text-slate-500 leading-relaxed">
                {copyright.text}
                {copyright.license && (
                  typeof copyright.license === 'string'
                    ? ` · ${copyright.license}`
                    : <span className="inline-block ml-1">{copyright.license}</span>
                )}
              </p>
            )}
          </div>

          {/* Navigation */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 flex-1">
            <div>
              <h4 className="font-semibold mb-4 text-white">Main</h4>
              <ul className="space-y-2">
                {mainLinks.map(({ href, label }) => (
                  <li key={href}>
                    <Link to={href} className="hover:text-white transition">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Legal</h4>
              <ul className="space-y-2">
                {legalLinks.map(({ href, label }) => (
                  <li key={href}>
                    <Link to={href} className="hover:text-white transition">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {socialLinks.length > 0 && (
              <div>
                <h4 className="font-semibold mb-4 text-white">Follow</h4>
                <ul className="flex space-x-4">
                  {socialLinks.map(({ href, icon, label }) => (
                    <li key={href}>
                      <a
                        href={href}
                        aria-label={label}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-white transition"
                      >
                        {icon}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
} 