import { MdSupervisorAccount } from "react-icons/md"
import ModeratorCard from "./components/ModeratorCard"
import ModeratorHeader from "./components/ModeratorHeader"
import ModeratorTitle from "./components/ModeratorTitle"
import ModeratorNotification from "./components/ModeratorNotification"
import Footer from "@/components/Footer"

function page() {
  return (
    <div className="overflow-x-hidden">
      <ModeratorHeader />
      <ModeratorTitle title={'Moderação'} />
      <div className="w-2/3 mx-auto grid grid-cols-1 justify-items-center md:grid-cols-2 xl:grid-cols-4 gap-10 mb-20">
        <ModeratorCard title={"Artesãos"} description={"Aprovar, editar, desativar contas..."} pending={0} finished={56} />
        <ModeratorCard title={"Produtos"} description={"Visualizar, excluir produtos."} pending={0} finished={56} />
        <ModeratorCard title={"Denúncias"} description={"Gerenciar denúncias"} pending={0} finished={56} />
        <ModeratorCard title={"Documentação"} description={"Acessar documentos importantes."} pending={0} finished={56} />
      </div>
      <ModeratorNotification />
      <Footer />
    </div>

  )
}

export default page