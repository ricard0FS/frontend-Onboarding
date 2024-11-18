import { useParams } from "react-router-dom";
import { BackButton } from "../../../../components";
import ProductComponent from "../../product/index";
import DocumentComponent from "../../documents/index";
import { useState } from "react";
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
          <p>Código do Cliente: {codCliente}</p>
          <p>Razão Social: </p>
          <p>Cnpj: </p>
          <p>Data Abertura: </p>
          <p>E-mail: </p>
          <p>Celular: </p>
          <p>Endereço: </p>
          <p>Tipo Empresa: </p>
          <p>CNAE: </p>
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
