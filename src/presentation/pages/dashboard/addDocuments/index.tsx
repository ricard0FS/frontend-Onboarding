import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../../../services/api";
import { Input } from "../../../components";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineCheckCircle } from "react-icons/ai";
import "./styles.css";

interface AddDocumentProps {
  onClose?: () => void;
  selectedDocument?: { name: string } | null;
}

interface Document {
  documentType: string;
  validity: string;
  files: File[];
}

const AddDocument: React.FC<AddDocumentProps> = ({
  onClose,
  selectedDocument,
}) => {
  const { cnpjCliente } = useParams<{ cnpjCliente: string }>();
  const [documents, setDocuments] = useState<Document[]>([
    { documentType: "", validity: "", files: [] },
  ]);
  const [error, setError] = useState<string | null>(null);

  const allowedExtensions = [".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx"];

  const documentMapping: Record<string, { idDocumento: number; key: string }> =
    {
      "DOCUMENTO PESSOAL": { idDocumento: 1, key: "DOCUMENTO_PESSOAL" },
      "CONTRATO SOCIAL": { idDocumento: 2, key: "CONTRATO_SOCIAL" },
      CNPJ: { idDocumento: 3, key: "CNPJ" },
      "COMPROVANTE DE RESIDENCIA": {
        idDocumento: 5,
        key: "COMPROVANTE_RESIDENCIA",
      },
      "TERMO DE ADESÃO": { idDocumento: 4, key: "TERMO_ADESAO" },
    };

  const documentOptions = Object.keys(documentMapping).map((key) => ({
    value: key,
    label: key,
  }));
  useEffect(() => {
    if (selectedDocument) {
      setDocuments((prevDocuments) =>
        prevDocuments.map((doc, index) =>
          index === 0 ? { ...doc, documentType: selectedDocument.name } : doc
        )
      );
    }
  }, [selectedDocument]);

  const handleFileChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      const validFiles = newFiles.filter((file) => {
        const fileExtension = file.name.split(".").pop()?.toLowerCase();
        return allowedExtensions.includes(`.${fileExtension}`);
      });

      setDocuments((prevDocuments) =>
        prevDocuments.map((doc, idx) =>
          idx === index ? { ...doc, files: [...doc.files, ...validFiles] } : doc
        )
      );
    }
  };

  const handleRemoveFile = (docIndex: number, fileIndex: number) => {
    setDocuments((prevDocuments) =>
      prevDocuments.map((doc, idx) =>
        idx === docIndex
          ? { ...doc, files: doc.files.filter((_, i) => i !== fileIndex) }
          : doc
      )
    );
  };

  const handleAddDocument = () => {
    setDocuments([...documents, { documentType: "", validity: "", files: [] }]);
  };

  const handleRemoveDocument = (index: number) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (
      documents.some(
        (doc) => !doc.documentType || !doc.validity || doc.files.length === 0
      )
    ) {
      setError("Preencha todos os campos obrigatórios e selecione um arquivo.");
      return;
    }

    try {
      for (const doc of documents) {
        const mappedType = documentMapping[doc.documentType];
        if (!mappedType) {
          setError("Tipo de documento inválido.");
          return;
        }

        const formData = new FormData();
        doc.files.forEach((file) => formData.append("files", file));
        formData.append("fileTypes", mappedType.key);
        formData.append("cnpjCliente", cnpjCliente || "");

        const validityValue =
          doc.validity === "Indeterminado" ? null : doc.validity;
        if (validityValue) {
          formData.append("dataValidade", validityValue);
        }

        const response = await api.post("/api/file/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Upload bem-sucedido:", response.data);
      }

      toast.success("Upload bem-sucedido!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setError(null);
      if (onClose) onClose();
    } catch (error) {
      console.error("Erro no upload:", error);
      setError("Ocorreu um erro ao fazer o upload.");
      toast.error("Ocorreu um erro ao fazer o upload.");
    }
  };

  return (
    <div className="modalAdd-overlay">
      <div className="modalAdd">
        <h2>Incluir Documento</h2>
        <p className="required-fields">* Campos de Preenchimento Obrigatório</p>
        <form>
          {documents.map((document, index) => (
            <div key={index}>
              <div className="row">
                <Input
                  label="*Documento"
                  name="Documento"
                  value={document.documentType}
                  onChange={(e) => {
                    const updatedDocuments = [...documents];
                    updatedDocuments[index].documentType = e.target.value;
                    setDocuments(updatedDocuments);
                  }}
                  select
                  options={documentOptions}
                  disabled={selectedDocument ? true : false}
                />
                <Input
                  label="*Validade do Documento"
                  select
                  name="validade"
                  value={document.validity}
                  onChange={(e) => {
                    const updatedDocuments = [...documents];
                    updatedDocuments[index].validity = e.target.value;
                    setDocuments(updatedDocuments);
                  }}
                  options={[
                    { value: "30", label: "30 dias" },
                    { value: "90", label: "90 dias (3 meses)" },
                    { value: "120", label: "120 dias (4 meses)" },
                    { value: "180", label: "180 dias (6 meses)" },
                    { value: "365", label: "365 dias (1 ano)" },
                    { value: "Indeterminado", label: "Indeterminado" },
                  ]}
                />
              </div>

              <div className="file-upload-center">
                <div className="file-upload">
                  <label className="upload-button">
                    Selecionar arquivo
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleFileChange(index, e)}
                      accept=".pdf, .jpg, .jpeg, .png, .doc, .docx"
                      style={{ display: "none" }}
                    />
                  </label>
                  <p className="upload-instructions">
                    ou arraste e solte o arquivo aqui
                  </p>
                </div>
              </div>

              <div className="file-list">
                {document.files.length > 0 && (
                  <div className="file-list-container">
                    {document.files.map((file, fileIndex) => (
                      <div key={fileIndex} className="file-item">
                        <AiOutlineCheckCircle className="file-check-icon" />
                        <span>{file.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(index, fileIndex)}
                        >
                          Excluir
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="AddDocument-modal-btn">
                {index !== 0 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveDocument(index)}
                  >
                    Remover Documento
                  </button>
                )}
              </div>
            </div>
          ))}

          <div className="AddDocument-modal-btn">
            {selectedDocument ? null : (
              <button
                type="button"
                className="add-icon-btn"
                onClick={handleAddDocument}
                title="Adicionar Documento"
              >
                Adicionar novo documento
              </button>
            )}
            <button type="button" onClick={onClose}>
              Fechar
            </button>
            <button type="button" onClick={handleUpload}>
              Confirmar
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default AddDocument;
