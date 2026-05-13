import Link from "next/link";

export default function PaginaInicio() {
  return (
    <div className="min-h-dvh bg-[#FEFAF6] flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-md">
        <span className="text-6xl">🍽️</span>
        <h1 className="font-[Playfair_Display] text-4xl font-bold text-[#2D2A26] mt-6">
          E-Kitchen
        </h1>
        <p className="text-[#78716C] mt-3 text-lg leading-relaxed">
          Menú digital interactivo para restaurantes. 
          Escanea el QR en tu mesa para ordenar sin descargar nada.
        </p>

        <div className="flex flex-col gap-3 mt-8">
          <Link
            href="/login"
            className="block w-full py-3.5 bg-[#C44536] text-white rounded-xl font-medium text-sm hover:bg-[#A8382C] transition-colors active:scale-[0.98]"
          >
            🔐 Iniciar Sesión
          </Link>
          <Link
            href="/cocina"
            className="block w-full py-3.5 border-2 border-[#48544a]/20 text-[#2D2A26] rounded-xl font-medium text-sm hover:bg-[#F5F0EB] transition-colors"
          >
            🔥 Panel de Cocina
          </Link>
          <Link
            href="/logistica"
            className="block w-full py-3.5 border-2 border-[#48544a]/20 text-[#2D2A26] rounded-xl font-medium text-sm hover:bg-[#F5F0EB] transition-colors"
          >
            📦 Panel de Entregas
          </Link>
          <Link
            href="/admin"
            className="block w-full py-3.5 border-2 border-[#48544a]/20 text-[#2D2A26] rounded-xl font-medium text-sm hover:bg-[#F5F0EB] transition-colors"
          >
            ⚙️ Administración
          </Link>
        </div>

        <p className="text-xs text-[#A8A29E] mt-8">
          ¿Comensal? Escanea el código QR de tu mesa para ver el menú
        </p>
      </div>
    </div>
  );
}
