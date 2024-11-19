import { useParams } from "react-router-dom";
import { BackButton } from "../../../../components";
import ProductComponent from "../../product/index";
import DocumentComponent from "../../documents/index";
import { useState } from "react";
import Input from "../../../../components/input/index";
import "./styles.css";

function DetailClientPage() {
  const { codCliente } = useParams();
  const [showProdutos, setShowProdutos] = useState(false);
  const [showDocumentos, setShowDocumentos] = useState(false);

  const handleProdutosClick = () => {
    setShowProdutos((prev) => !prev);
  };

  const handleDocumentosClick = () => {
    setShowDocumentos((prev) => !prev);
  };

  const containerClass =
    showProdutos && showDocumentos
      ? "expanded-both"
      : showProdutos
      ? "expanded-products"
      : showDocumentos
      ? "expanded-documents"
      : "";

  return (
    <div className={`client-page ${containerClass}`}>
      <section className="contentDetail">
        <div className="filter-form">
          <BackButton />

          <h1>Detalhes do Cliente</h1>
          <div className="divider">
            <h2>Dados Cadastrais</h2>
            <div className="input-section">
              <Input
                label="Código do Cliente"
                name="codigoCliente"
                placeholder={codCliente}
                disabled
              />
              <Input label="CNPJ" name="cnpj" placeholder="CNPJ" disabled />
              <Input
                label="Grupo Econômico"
                name="grupoEconomico"
                placeholder="Grupo Econômico"
                disabled
              />
              <Input
                label="Razão Social"
                name="razaoSocial"
                placeholder="Razão Social"
                disabled
              />
              <Input
                label="Nome Fantasia"
                name="nomeFantasia"
                placeholder="Nome Fantasia"
                disabled
              />
            </div>
          </div>
          <div className="divider">
            <h2>Contato</h2>
            <div className="input-section">
              <Input
                label="Celular"
                name="celular"
                placeholder="Celular"
                disabled
              />
              <Input
                label="E-mail"
                name="email"
                placeholder="E-mail"
                disabled
              />
              <Input
                label="Rua/Avenida"
                name="rua"
                placeholder="Rua/Avenida"
                disabled
              />
              <Input
                label="Número"
                name="numero"
                placeholder="Número"
                disabled
              />
              <Input
                label="Cidade"
                name="cidade"
                placeholder="Cidade"
                disabled
              />
              <Input
                label="Estado"
                name="estado"
                placeholder="Estado"
                disabled
              />
              <Input label="CEP" name="cep" placeholder="CEP" disabled />
            </div>
          </div>
          <div className="divider">
            <h2>Informações Empresariais</h2>
            <div className="input-section">
              <Input
                label="Inscrição Estadual"
                name="inscricaoEstadual"
                placeholder="Inscrição Estadual"
                disabled
              />
              <Input label="CNAE" name="cnae" placeholder="CNAE" disabled />
              <Input
                label="Ramo Atividade"
                name="ramoAtividade"
                placeholder="Ramo Atividade"
                disabled
              />
            </div>
          </div>
          <div className="button-container">
            <button className="clientDetail-btn" onClick={handleProdutosClick}>
              Produtos
            </button>
            <button
              className="clientDetail-btn"
              onClick={handleDocumentosClick}
            >
              Documentos
            </button>
          </div>
        </div>

        {showProdutos && (
          <div className="produtos-section">
            <ProductComponent />
          </div>
        )}

        {showDocumentos && (
          <div className="documentos-section">
            <DocumentComponent />
          </div>
        )}
      </section>
    </div>
  );
}

export default DetailClientPage;
