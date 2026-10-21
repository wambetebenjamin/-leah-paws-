"use client";

import Link from "next/link";
import { Menu, PawPrint, Phone, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/sitters", label: "Find a sitter" },
  { href: "/my-bookings", label: "My bookings" },
  { href: "/become-a-sitter", label: "Become a sitter" }
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header>
      <div className="topbar">
        <div className="site-container topbar-inner">
          <p><Phone size={13} aria-hidden="true" /> +254 112 272 061</p>
          <p className="topbar-note">Happy pets. Worry-free owners.</p>
        </div>
      </div>
      <nav className="site-navigation" aria-label="Main navigation">
        <div className="site-container nav-inner">
          <Link className="brand" href="/" onClick={() => setOpen(false)}>
            <PawPrint size={29} strokeWidth={2.4} aria-hidden="true" />
            <span>Leah Paws</span>
          </Link>
          <button className="menu-toggle" type="button" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}>
            {open ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>
          <div className={`nav-links ${open ? "nav-open" : ""}`}>
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href)) ? "active" : ""}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link className="nav-book" href="/booking" onClick={() => setOpen(false)}>Book now</Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
