export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-6 sm:py-8">
      <div className="container mx-auto px-4 sm:px-6 text-center">
        <p className="text-gray-600 text-xs sm:text-sm">
          © {new Date().getFullYear()} ULTIMATECAR3D. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
