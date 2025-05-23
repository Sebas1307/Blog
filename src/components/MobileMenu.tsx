import { useState, useEffect } from 'react';

interface NavItem {
  href: string;
  text: string;
}

interface MobileMenuProps {
  navItems: NavItem[];
  currentPath: string;
}

export default function MobileMenu({ navItems, currentPath }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        className="md:hidden ml-2 p-2 rounded bg-white shadow border border-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
        onClick={() => setIsOpen(true)}
        aria-label="Menú"
      >
        <svg
          className="w-7 h-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className="md:hidden fixed inset-0 w-full h-full bg-white opacity-100 z-[2147483647] transition-all duration-300"
          style={{ zIndex: 2147483647 }}
        >
          <div className="flex flex-col space-y-6 mt-20 px-6 py-8 bg-white">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 focus:outline-none"
              aria-label="Cerrar menú"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-7 h-7 text-gray-700"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={handleClose}
                className={`text-gray-700 hover:text-[#20ecaa] transition-colors text-lg font-medium ${
                  currentPath === item.href ? 'text-[#20ecaa]' : ''
                }`}
              >
                {item.text}
              </a>
            ))}

            <a
              href="/about"
              onClick={handleClose}
              className="text-gray-700 hover:text-[#20ecaa] transition-colors text-lg font-medium"
            >
              Sobre mí
            </a>
          </div>
        </div>
      )}
    </>
  );
} 