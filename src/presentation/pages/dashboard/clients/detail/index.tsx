import { BackButton } from "../../../../components";
import ProductComponent from "../../product/index";
import DocumentComponent from "../../documents/index";
import { useState, useEffect } from "react";
import Input from "../../../../components/input/index";
import { useParams } from "react-router-dom";
import api from "../../../../../services/api";
import CircularProgress from "@mui/material/CircularProgress";

import "./styles.css";

type Contact = {
  name: string;
  email: string;
  phone1: string | null;
  phone2: string | null;
  mobile: string | null;
};

type Address = {
  street: string;
  number: string;
  city: string;
  state: string;
  postalCode: string;
};

type ClientData = {
  customerId?: string;
  customerCnpj?: string;
  economicGroup?: string;
  name?: string;
  tradeName?: string;
  customerIe?: string;
  cnae?: string;
  commercialActivity?: string;
  emails?: {
    primary: string;
    secondary: string;
  };
  address?: Address;
  contact?: Contact[];
};

function DetailClientPage() {
  const { cnpjCliente } = useParams<{ cnpjCliente: string }>();
  const [showProdutos, setShowProdutos] = useState(false);
  const [showDocumentos, setShowDocumentos] = useState(false);
  const [clientData, setClientData] = useState<ClientData>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClientDetails = async () => {
      setLoading(true);
      try {
        const response = await api.get(
          `/api/v1/cliente-real/find/cnpjCliente=${cnpjCliente}`
        );
        setClientData(response.data);
      } catch (error) {
        console.error("Erro ao buscar detalhes do cliente:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientDetails();
  }, [cnpjCliente]);

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
      {loading ? (
        <div className="loading-overlay">
          <CircularProgress style={{ color: "red" }} size={80} />
        </div>
      ) : (
        <section className="contentDetail">
          <div className="filter-form">
            <BackButton backRoute="*" />
            <h1>Detalhes do Cliente</h1>

            <div className="divider">
              <h2>Dados Cadastrais</h2>
              <div className="input-section">
                <Input
                  label="Código do Cliente"
                  name="codigoCliente"
                  value={clientData.customerId || "Código do Cliente"}
                  disabled
                />
                <Input
                  label="CNPJ"
                  name="cnpj"
                  value={clientData.customerCnpj || "CNPJ"}
                  disabled
                />
                <Input
                  label="Grupo Econômico"
                  name="grupoEconomico"
                  value={clientData.economicGroup || "Não Consta"}
                  disabled
                />
                <Input
                  label="Razão Social"
                  name="razaoSocial"
                  value={clientData.name || "Razão Social"}
                  disabled
                />
                <Input
                  label="Nome Fantasia"
                  name="nomeFantasia"
                  value={clientData.tradeName || "Nome Fantasia"}
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
                  value={
                    clientData.contact?.[0]?.phone1 ||
                    clientData.contact?.[0]?.phone2 ||
                    "Sem número disponível"
                  }
                  disabled
                />
                <Input
                  label="E-mail"
                  name="email"
                  value={clientData.emails?.primary || "E-mail"}
                  disabled
                />
                <Input
                  label="Rua/Avenida"
                  name="rua"
                  value={clientData.address?.street || "Rua/Avenida"}
                  disabled
                />
                <Input
                  label="Número"
                  name="numero"
                  value={clientData.address?.number || "Número"}
                  classname=""
                  disabled
                />
                <Input
                  label="Cidade"
                  name="cidade"
                  value={clientData.address?.city || "Cidade"}
                  disabled
                />
                <Input
                  label="Estado"
                  name="estado"
                  value={clientData.address?.state || "Estado"}
                  disabled
                />
                <Input
                  label="CEP"
                  name="cep"
                  value={clientData.address?.postalCode || "CEP"}
                  disabled
                />
              </div>
            </div>
            <div className="divider">
              <h2>Informações Empresariais</h2>
              <div className="input-section">
                <Input
                  label="Inscrição Estadual"
                  name="inscricaoEstadual"
                  value={clientData.customerIe || "Inscrição Estadual"}
                  disabled
                />
                <Input
                  label="CNAE"
                  name="cnae"
                  value={clientData.cnae || "CNAE"}
                  disabled
                />
                <Input
                  label="Ramo Atividade"
                  name="ramoAtividade"
                  value={clientData.commercialActivity || "Ramo Atividade"}
                  disabled
                />
              </div>
            </div>
            <div className="button-container">
              <button
                className="clientDetail-btn"
                onClick={handleProdutosClick}
              >
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
      )}
    </div>
  );
}

export default DetailClientPage;
