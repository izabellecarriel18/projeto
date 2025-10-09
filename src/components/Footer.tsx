export default function Footer() {
  return (
    <footer className="border-t border-gray-800 py-6 sm:py-8">
      <div className="container mx-auto px-4 sm:px-6 text-center">
        <p className="text-gray-400 text-xs sm:text-sm">
          © {new Date().getFullYear()} UltimateCar3D. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
