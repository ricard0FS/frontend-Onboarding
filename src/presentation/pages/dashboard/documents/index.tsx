import React, { useState } from "react";
import DataTable, {
  TableColumn,
  TableStyles,
} from "react-data-table-component";
import {
  FaTrashAlt,
  FaUpload,
  FaDownload,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaPlus,
} from "react-icons/fa";
import "./styles.css";
import AddDocument from "../addDocuments";

interface Document {
  id: number;
  name: string;
  status: "valid" | "invalid" | "outdated";
}

const documents: Document[] = [
  { id: 1, name: "Documento 01", status: "valid" },
  { id: 2, name: "Documento 02", status: "valid" },
  { id: 3, name: "Documento 03", status: "valid" },
  { id: 4, name: "Documento 04", status: "valid" },
  { id: 5, name: "Documento 05", status: "valid" },
  { id: 6, name: "Documento 06", status: "valid" },
  { id: 7, name: "Documento 07", status: "invalid" },
  { id: 8, name: "Documento 08", status: "valid" },
  { id: 9, name: "Documento 09", status: "outdated" },
  { id: 10, name: "Documento 10", status: "valid" },
];

const columns: TableColumn<Document>[] = [
  {
    name: "Tipo de Documento",
    selector: (row) => row.name,
  },
  {
    name: "Status do documento",
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

const DocumentComponent: React.FC = () => {
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState<Document[]>([]);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleRowSelected = (selectedRows: { selectedRows: Document[] }) => {
    setSelectedDocuments(selectedRows.selectedRows);
    setErrorMessage("");
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

  const handleConfirmDelete = () => {
    if (documentToDelete) {
      const updatedDocuments = documents.filter(
        (doc) => doc.id !== documentToDelete.id
      );
      console.log("Documentos restantes após a exclusão:", updatedDocuments);
      setDocumentToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDocumentToDelete(null);
  };

  const handleAddDocument = () => {
    setIsAddFormVisible(true);
  };

  const handleCloseModal = () => {
    setIsAddFormVisible(false);
  };

  const handleConfirm = () => {
    console.log("Documento confirmado");
  };

  return (
    <div className="table">
      {isAddFormVisible ? (
        <div className="modalAdd-overlay">
          <div className="modalAdd">
            <AddDocument />
            <div className="modal-btn">
              <button onClick={handleCloseModal}>Descartar</button>
              <button onClick={handleConfirm}>Confirmar</button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <DataTable
            columns={columns}
            data={documents}
            customStyles={customStyles}
            selectableRows
            onSelectedRowsChange={handleRowSelected}
            responsive
            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={[5, 10, 20, 40, 100]}
            paginationComponentOptions={{
              rowsPerPageText: "Linhas por página",
              rangeSeparatorText: "de",
              selectAllRowsItem: true,
              selectAllRowsItemText: "Todos",
            }}
          />
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <div className="table-footer">
            <div className="action-buttons">
              <FaPlus
                className="action-icon add-icon"
                title="Adicionar Documento"
                onClick={handleAddDocument}
              />
              <FaTrashAlt className="trash-icon" title="Excluir" />
              <FaUpload
                className="action-icon"
                title="Upload"
                onClick={() =>
                  validateSelection(() => console.log("Upload realizado"))
                }
              />
              <FaDownload
                className="action-icon"
                title="Download"
                onClick={() =>
                  validateSelection(
                    () => console.log("Download realizado"),
                    true
                  )
                }
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

          {documentToDelete && (
            <div className="modal-overlay">
              <div className="modal">
                <h3>Tem certeza de que deseja excluir este documento?</h3>
                <div className="modal-actions">
                  <button onClick={handleCancelDelete}>Cancelar</button>
                  <button onClick={handleConfirmDelete}>Excluir</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DocumentComponent;
