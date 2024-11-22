import React, { useEffect, useState } from "react";
import DataTable, { TableStyles } from "react-data-table-component";
import api from "../../../../services/api";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import "./styles.css";

const ProductComponent: React.FC = () => {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const cnpjCliente = "00685368000211"; // tornar dinâmico
        const response = await api.post(
          "/api/documents/findCustomerDocuments",
          {
            cnpjCliente,
          }
        );

        const { produtosSituacao } = response.data;

        const formattedProdutos = produtosSituacao.map((produto: any) => ({
          id: produto.nomePrograma,
          nome: produto.nomePrograma,
          contratado: produto.situacao,
          documentos: Object.entries(
            produto.documentosSituacao as Record<string, boolean>
          ).map(([nome, situacao]) => ({
            nome,
            status: situacao ? "valid" : "invalid",
          })),
        }));

        setProdutos(formattedProdutos);
      } catch (error) {
        console.error("Erro ao buscar os documentos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const columns = [
    {
      name: "Produto",
      selector: (row: any) => row.nome,
    },
    {
      name: "Documentos",
      cell: (row: any) =>
        row.documentos.every((doc: any) => doc.status === "valid") ? (
          <FaCheckCircle color="green" size={20} />
        ) : (
          <FaTimesCircle color="red" size={20} />
        ),
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
          <p>Carregando...</p>
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
                      <FaTimesCircle color="red" size={20} />
                    )}
                    {doc.status === "outdated" && (
                      <FaExclamationTriangle color="orange" size={20} />
                    )}
                  </div>
                ))}
              </div>
            )}
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
    </div>
  );
};

export default ProductComponent;
