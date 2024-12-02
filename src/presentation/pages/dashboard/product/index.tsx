import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DataTable, { TableStyles } from "react-data-table-component";
import api from "../../../../services/api";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import AddDocument from "../addDocuments";
import "./styles.css";
import CircularProgress from "@mui/material/CircularProgress";

const ProductComponent: React.FC = () => {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDocument, setSelectedDocument] = useState<{
    name: string;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { cnpjCliente } = useParams<{ cnpjCliente: string }>();

  const isOutdated = (validade: string) =>
    new Date(validade).getTime() < new Date().getTime();

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!cnpjCliente) return;

      setLoading(true);
      try {
        const response = await api.post(
          "/api/documents/findCustomerDocuments",
          { cnpjCliente }
        );

        const { produtosSituacao, documentos } = response.data;

        const formattedProdutos = produtosSituacao.map((produto: any) => ({
          id: produto.nomePrograma,
          nome: produto.nomePrograma,
          contratado:
            produto.apto &&
            Object.values(produto.documentosSituacao).every(
              (situacao) => situacao
            ),
          documentos: Object.entries(produto.documentosSituacao).map(
            ([nome, situacao]) => {
              const docInfo = documentos.find(
                (doc: any) => doc.nomeDocumento === nome
              );
              return {
                nome,
                status: situacao
                  ? isOutdated(docInfo?.dataValidade)
                    ? "outdated"
                    : "valid"
                  : "invalid",
                validade: docInfo?.dataValidade,
              };
            }
          ),
        }));

        setProdutos(formattedProdutos);
      } catch (error) {
        console.error("Erro ao buscar os documentos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [cnpjCliente]);

  const handleDocumentClick = (doc: { nome: string }) => {
    setSelectedDocument({ name: doc.nome });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedDocument(null);
    setIsModalOpen(false);
  };

  const columns = [
    {
      name: "Produto",
      selector: (row: any) => row.nome,
    },
    {
      name: "Documentos",
      cell: (row: any) => {
        const hasInvalid = row.documentos.some(
          (doc: any) => doc.status === "invalid"
        );
        const hasOutdated = row.documentos.some(
          (doc: any) => doc.status === "outdated"
        );

        if (hasInvalid || hasOutdated) {
          return <FaTimesCircle color="red" size={20} />;
        }
        return <FaCheckCircle color="green" size={20} />;
      },
    },
    {
      name: "Contratado",
      cell: (row: any) =>
        row.contratado ? (
          <FaCheckCircle color="black" size={20} />
        ) : (
          <span>Não</span>
        ),
    },
  ];

  const customStyles: TableStyles = {
    headCells: {
      style: {
        color: "black",
        fontSize: "18px",
        justifyContent: "center",
      },
    },
    rows: {
      style: {
        padding: "5px",
      },
    },
    cells: {
      style: {
        fontSize: "16px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
    },
  };

  return (
    <div>
      <form className="filter-form">
        {loading ? (
          <div className="loading-overlay">
            <CircularProgress style={{ color: "red" }} size={80} />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={produtos}
            customStyles={customStyles}
            expandableRows
            expandableRowsComponent={({ data }) => (
              <div className="document">
                {data.documentos.map((doc: any) => (
                  <div key={doc.nome} className="document-row">
                    <span>{doc.nome}</span>
                    {doc.status === "valid" && (
                      <FaCheckCircle color="green" size={20} />
                    )}
                    {doc.status === "invalid" && (
                      <FaTimesCircle
                        size={20}
                        onClick={() => handleDocumentClick(doc)}
                        style={{ cursor: "pointer", color: "red" }}
                      />
                    )}
                    {doc.status === "outdated" && (
                      <FaExclamationTriangle
                        size={20}
                        onClick={() => handleDocumentClick(doc)}
                        style={{ cursor: "pointer", color: "orange" }}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
            noDataComponent={
              <div
                style={{
                  textAlign: "center",
                  color: "#000",
                  padding: "20px",
                }}
              >
                Nenhum registro encontrado.
              </div>
            }
          />
        )}

        <div className="table-footer">
          <div className="legend-item">
            <FaCheckCircle color="green" size={20} /> Documento Válido
          </div>
          <div className="legend-item">
            <FaTimesCircle color="red" size={20} /> Documento Pendente
          </div>
          <div className="legend-item">
            <FaExclamationTriangle color="orange" size={20} /> Documento
            Desatualizado
          </div>
        </div>
      </form>

      {isModalOpen && (
        <AddDocument
          selectedDocument={selectedDocument}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ProductComponent;
