export default function Footer() {
  return (
    <footer className="border-t border-gray-800 py-8">
      <div className="container mx-auto px-6 text-center">
        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()} UltimateCars3D. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
