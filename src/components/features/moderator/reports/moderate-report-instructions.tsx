import ModerateArtisanButton from './moderate-report-button';

function ModerateReportInstructions() {
  return (
    <div className="flex flex-col">
      <div className="w-full rounded-md border border-midnight p-2 text-midnight font-bold">
        <p>Instruções das ações</p>
      </div>

      <div className="flex flex-col text-sm font-semibold text-midnight">
        <div className="flex gap-6 mx-3 pt-4">
          <span>Ação/Botão</span>
          <span>Função</span>
        </div>

        <div className="flex gap-4 pt-2 items-center">
          <ModerateArtisanButton variant={'warn'} />
          <span>
            Envia uma notificação ao usuário alertando sobre a violação das
            regras, sem aplicar bloqueio.
          </span>
        </div>

        <div className="flex gap-4 pt-2 items-center">
          <ModerateArtisanButton variant={'exclude'} />
          <span>
            Exclui a publicação, comentário ou item denunciado da plataforma.
          </span>
        </div>

        <div className="flex gap-4 pt-2 items-center">
          <ModerateArtisanButton variant={'suspend'} />
          <span>Suspende o acesso do usuário por um período determinado.</span>
        </div>

        <div className="flex gap-4 pt-2 items-center">
          <ModerateArtisanButton variant={'ban'} />
          <span>
            Remove o acesso do usuário de forma definitiva, sem possibilidade de
            retorno.
          </span>
        </div>
        <div className="flex gap-4 pt-2 items-center">
          <ModerateArtisanButton variant={'archive'} />
          <span>
            Marca a denúncia como encerrada, mantendo apenas o histórico para
            consulta.
          </span>
        </div>
        <div className="flex gap-4 pt-2 items-center">
          <ModerateArtisanButton variant={'revert'} />
          <span>
            Reverte a remoção de um conteúdo que foi apagado por engano.
          </span>
        </div>
      </div>
    </div>
  );
}

export default ModerateReportInstructions;
