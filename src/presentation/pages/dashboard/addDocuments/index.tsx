import React, { useState } from "react";
import { Input } from "../../../components";
import { AiOutlineCheckCircle } from "react-icons/ai";
import "./styles.css";

const AddDocument: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      const validFiles = newFiles.filter(
        (file) => file.size <= 150 * 1024 * 1024 // Limite de 150MB por arquivo
      );
      setFiles((prevFiles) => [...prevFiles, ...validFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files) {
      const newFiles = Array.from(event.dataTransfer.files);
      const validFiles = newFiles.filter(
        (file) => file.size <= 150 * 1024 * 1024
      );
      setFiles((prevFiles) => [...prevFiles, ...validFiles]);
    }
  };

  return (
    <>
      <h2>Incluir Documento</h2>
      <p className="required-fields">* Campos de Preenchimento Obrigatório</p>
      <form>
        <div className="row">
          <Input
            label="*Documento"
            select
            defaultValue=""
            name="Documento"
            options={[
              { value: "Tipo 1", label: "Tipo 1" },
              { value: "Tipo 2", label: "Tipo 2" },
            ]}
          />

          <Input
            label="*Validade do Documento"
            select
            defaultValue=""
            name="validade"
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
          <div
            className="file-upload"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <label className="upload-button">
              Selecionar arquivo
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                accept=".pdf, .jpg, .jpeg, .png"
                style={{ display: "none" }}
              />
            </label>
            <p className="upload-instructions">
              ou arraste e solte o arquivo aqui
            </p>
          </div>
        </div>

        <div className="file-list">
          {files.length > 0 && (
            <div className="file-list-container">
              {files.map((file, index) => (
                <div key={index} className="file-item">
                  <AiOutlineCheckCircle className="file-check-icon" />
                  <span>{file.name}</span>
                  <div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </form>
    </>
  );
};

export default AddDocument;
