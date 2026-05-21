export function FondoLogin() {
  return (
    <>
      {/* Capa de imagen de fondo */}
      <div className="fixed inset-0 -z-10">
        <div
          className="absolute inset-0 bg-cover bg-no-repeat bg-left-top sm:bg-center"
          style={{ backgroundImage: "url('/images/background/fondo2.webp')" }}
        />
      </div>

      {/* Orbs decorativos flotantes */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-64 h-64 sm:w-72 sm:h-72 rounded-full bg-primario/12 blur-[80px] sm:blur-[100px] animate-float" />
        <div className="absolute -bottom-[10%] -right-[10%] w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-acento/12 blur-[90px] sm:blur-[120px] animate-float-delayed" />
        <div className="absolute top-[30%] right-[15%] w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-exito/8 blur-[60px] sm:blur-[80px] animate-float-slow hidden sm:block" />
      </div>
    </>
  );
}
