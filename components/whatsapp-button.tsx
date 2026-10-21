import { MessageCircle } from "lucide-react";

const message = "Hello Leah Paws, I would like to book a pet sitter or dog walker for my pet.";

export function WhatsAppButton() {
  return (
    <a
      className="whatsapp-button"
      href={`https://wa.me/254112272061?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
    >
      <MessageCircle size={26} strokeWidth={2.2} aria-hidden="true" />
      <span className="floating-tooltip">Chat with us on WhatsApp</span>
    </a>
  );
}
