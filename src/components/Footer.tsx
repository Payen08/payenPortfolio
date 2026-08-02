export default function Footer() {
  return (
    <footer className="py-10 md:py-12 px-4 sm:px-6 border-t border-neutral-800 text-center text-sm text-neutral-500">
      <p>&copy; {new Date().getFullYear()} My Portfolio. All rights reserved.</p>
    </footer>
  );
}
