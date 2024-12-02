import React, { useState, useEffect } from "react";
import DataTable, {
  TableColumn,
  TableStyles,
} from "react-data-table-component";
import { useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import {
  FaTrashAlt,
  FaDownload,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaPlus,
} from "react-icons/fa";
import "./styles.css";
import AddDocument from "../addDocuments";
import api from "../../../../services/api";
import { toast } from "react-toastify";

interface Document {
  id: string;
  name: string;
  status: "valid" | "invalid" | "outdated";
  dataValidade: string;
}

const DocumentComponent: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState<Document[]>([]);
  const { cnpjCliente } = useParams<{ cnpjCliente: string }>();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const documentMapping: Record<string, { idDocumento: number; key: string }> =
    {
      "DOCUMENTO PESSOAL": { idDocumento: 1, key: "DOCUMENTO_PESSOAL" },
      "CONTRATO SOCIAL": { idDocumento: 2, key: "CONTRATO_SOCIAL" },
      "DOCUMENTO PESSOAL SECUNDARIO": {
        idDocumento: 6,
        key: "DOCUMENTO_PESSOAL_SECUNDARIO",
      },
      CNPJ: { idDocumento: 3, key: "CNPJ" },
      "COMPROVANTE DE RESIDENCIA": {
        idDocumento: 5,
        key: "COMPROVANTE_RESIDENCIA",
      },
      "TERMO DE ADESAO": { idDocumento: 4, key: "TERMO_ADESAO" },
    };
  const isOutdated = (validade: string) =>
    new Date(validade).getTime() < new Date().getTime();

  const fetchDocuments = async (page: number, size: number) => {
    if (!cnpjCliente) return;

    setLoading(true);
    try {
      const response = await api.get(
        `/api/documents/findAllCustomerDocuments?cnpjCliente=${cnpjCliente}&page=${
          page - 1
        }&size=${size}`
      );
      if (!response.data || !response.data.content) {
        throw new Error("Dados de documentos não encontrados.");
      }

      const { content, totalPages } = response.data;

      const formattedDocuments = content.map((doc: any) => {
        const status = doc.dataValidade
          ? isOutdated(doc.dataValidade)
            ? "outdated"
            : "valid"
          : "invalid";

        return {
          id: doc.tipoArquivo,
          name: doc.tipoArquivo,
          status: status,
          dataValidade: doc.dataValidade,
        };
      });

      setDocuments(formattedDocuments);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Erro ao buscar os documentos:", error);
      setErrorMessage("Houve um erro ao carregar os documentos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments(currentPage, 10);
  }, [cnpjCliente, currentPage]);

  const handleDelete = async () => {
    if (!cnpjCliente || selectedDocuments.length === 0) {
      setErrorMessage("Nenhum documento selecionado para exclusão.");
      setIsDeleteModalVisible(false);
      return;
    }

    try {
      const idsToDelete = selectedDocuments
        .map((doc) => documentMapping[doc.name]?.idDocumento)
        .filter((id): id is number => id !== undefined);

      if (idsToDelete.length === 0) {
        setErrorMessage(
          "Não foi possível encontrar mapeamento para os documentos selecionados."
        );
        return;
      }

      await api.delete("/api/file/delete", {
        data: {
          cnpjCliente,
          descricaoDocumentos: idsToDelete,
        },
      });

      setDocuments((prevDocs) =>
        prevDocs.map((doc) =>
          idsToDelete.includes(documentMapping[doc.name]?.idDocumento!)
            ? { ...doc, status: "invalid" }
            : doc
        )
      );

      toast.success("Documento marcado como pendente!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Não foi possível excluir o documento.");
    } finally {
      setIsDeleteModalVisible(false);
    }
  };

  const columns: TableColumn<Document>[] = [
    {
      name: "Tipo de Documento",
      selector: (row) => row.name,
    },
    {
      name: "Status do Documento",
      cell: (row) => (
        <div className={`status-icon ${row.status}`}>
          {row.status === "valid" && <FaCheckCircle color="green" size={20} />}
          {row.status === "invalid" && <FaTimesCircle color="red" size={20} />}
          {row.status === "outdated" && (
            <FaExclamationTriangle color="orange" size={20} />
          )}
        </div>
      ),
    },
  ];

  const customStyles: TableStyles = {
    headCells: {
      style: {
        color: "black",
        fontSize: "18px",
        justifyContent: "center",
        position: "sticky",
        top: 0,
        zIndex: 1,
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
    pagination: {
      style: {
        color: "#010101",
        backgroundColor: "#fcfcfc",
      },
    },
  };

  const handleRowSelected = (selectedRows: { selectedRows: Document[] }) => {
    setSelectedDocuments(selectedRows.selectedRows);
    setErrorMessage("");
  };

  const handleDownload = async () => {
    if (!cnpjCliente || selectedDocuments.length === 0) {
      console.error("CNPJ ou documento não selecionado.");
      return;
    }

    try {
      const selectedDocument = selectedDocuments[0];
      const mappedType = documentMapping[selectedDocument.name];

      if (!mappedType) {
        throw new Error("Tipo de documento não mapeado.");
      }
      const descricaoDocumento = mappedType.key;

      const url = `/api/file/download?cnpjCliente=${cnpjCliente}&descricaoDocumento=${descricaoDocumento}`;

      const response = await api.get(url, { responseType: "blob" });

      const contentDisposition =
        response.headers["content-disposition"] ||
        response.headers["Content-Disposition"];

      let fileName = "documento";

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="([^"]+)"/);
        if (match && match[1]) {
          fileName = match[1];
        }
      } else {
        console.warn("Cabeçalho Content-Disposition não encontrado.");
      }

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });

      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Erro ao realizar o download:", error);
    }
  };

  const validateSelection = (action: () => void, allowMultiple = false) => {
    if (selectedDocuments.length === 0) {
      setErrorMessage(
        "Por favor, selecione pelo menos um documento antes de prosseguir."
      );
    } else if (!allowMultiple && selectedDocuments.length > 1) {
      setErrorMessage("Selecione apenas um documento para esta ação.");
    } else {
      setErrorMessage("");
      action();
    }
  };

  const handleAddDocument = () => {
    setIsAddFormVisible(true);
  };

  const handleCloseAddDocument = () => {
    setIsAddFormVisible(false);
  };

  return (
    <div className="table">
      {isAddFormVisible ? (
        <AddDocument onClose={handleCloseAddDocument} />
      ) : (
        <>
          {loading ? (
            <div className="loading-overlay">
              <CircularProgress style={{ color: "red" }} size={80} />
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={documents}
              customStyles={customStyles}
              selectableRows
              onSelectedRowsChange={handleRowSelected}
              responsive
              pagination
              paginationPerPage={10}
              paginationTotalRows={totalPages * 10}
              onChangePage={setCurrentPage}
              paginationRowsPerPageOptions={[5, 10, 20, 40, 100]}
              paginationComponentOptions={{
                rowsPerPageText: "Linhas por página",
                rangeSeparatorText: "de",
                selectAllRowsItem: true,
                selectAllRowsItemText: "Todos",
              }}
              keyField="id"
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
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <div className="table-footer">
            <div className="action-buttons">
              <FaPlus
                className="action-icon add-icon"
                title="Adicionar Documento"
                onClick={handleAddDocument}
              />
              <FaTrashAlt
                className="trash-icon"
                title="Excluir"
                onClick={() =>
                  validateSelection(() => setIsDeleteModalVisible(true), false)
                }
              />
              <FaDownload
                className="action-icon"
                title="Download"
                onClick={() => validateSelection(handleDownload, false)}
              />
            </div>
            <div className="legend">
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
          </div>
        </>
      )}
      {isDeleteModalVisible && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Tem certeza que deseja excluir o documento?</h3>
            <div className="modal-actions">
              <button onClick={() => setIsDeleteModalVisible(false)}>
                Cancelar
              </button>
              <button onClick={handleDelete}>Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentComponent;
