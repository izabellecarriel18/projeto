export default function Footer() {
  return (
    <footer className="bg-blue-950/70 backdrop-blur-sm border-t border-blue-900/50 py-6 sm:py-8">
      <div className="container mx-auto px-4 sm:px-6 text-center">
        <p className="text-white text-xs sm:text-sm">
          © {new Date().getFullYear()} ULTIMATECAR3D. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
