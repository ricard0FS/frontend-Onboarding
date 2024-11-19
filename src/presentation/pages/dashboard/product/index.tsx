import React from "react";
import DataTable, { TableStyles } from "react-data-table-component";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import "./styles.css";

const produtosMock = [
  {
    id: 1,
    nome: "Permite",
    documentos: [
      { nome: "DOC 1", status: "valid" },
      { nome: "DOC 2", status: "outdated" },
      { nome: "DOC 3", status: "invalid" },
      { nome: "DOC 4", status: "valid" },
      { nome: "DOC 5", status: "outdated" },
      { nome: "DOC 6", status: "invalid" },
      { nome: "DOC 7", status: "valid" },
      { nome: "DOC 8", status: "outdated" },
      { nome: "DOC 9", status: "invalid" },
    ],
    contratado: false,
  },
  {
    id: 2,
    nome: "Programa Acelere",
    documentos: [
      { nome: "DOC 1", status: "valid" },
      { nome: "DOC 2", status: "valid" },
    ],
    contratado: true,
  },
];

const ProductComponent: React.FC = () => {
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
        <DataTable
          columns={columns}
          data={produtosMock}
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
