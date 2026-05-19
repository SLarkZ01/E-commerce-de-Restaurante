import { AsistenteProvider } from "@/components/admin/AsistenteProvider";
import { AsistenteChat } from "@/components/admin/asistenteChat";

export default function PaginaAsistente() {
  return (
    <AsistenteProvider>
      <AsistenteChat />
    </AsistenteProvider>
  );
}
