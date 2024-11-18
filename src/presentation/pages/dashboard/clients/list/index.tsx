import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import Input from "../../../../components/input";
import DataTable, { TableStyles } from "react-data-table-component";
import { IoEyeOutline } from "react-icons/io5";

interface ClientData {
  razaoSocial: string;
  email: string;
  codCliente: string;
  flial: string;
  telefone: string;
}

function ListClientPage() {
  const navigate = useNavigate();
  const [clients, setClients] = useState<ClientData[]>([]);
  const [filters, setFilters] = useState({
    razaoSocial: "",
    cnpj: "",
    codCliente: "",
    filial: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const simulatedClients: ClientData[] = Array.from(
    { length: 100 },
    (_, index) => ({
      razaoSocial: `Cliente ${index + 1}`,
      email: `cliente${index + 1}@example.com`,
      codCliente: `C${index + 1}`,
      flial: `Filial ${(index % 5) + 1}`,
      telefone: `(${Math.floor(Math.random() * 100)}) ${Math.floor(
        Math.random() * 10000000
      )}`,
    })
  );

  useEffect(() => {
    setClients(simulatedClients);
  }, []);

  const handleFilterChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const filteredClients = clients.filter((client) => {
    return (
      client.razaoSocial.includes(filters.razaoSocial) &&
      client.codCliente.includes(filters.codCliente) &&
      client.flial.includes(filters.filial)
    );
  });

  const columns = [
    { name: "Cód Cliente", selector: (row: ClientData) => row.codCliente },
    { name: "Razão Social", selector: (row: ClientData) => row.razaoSocial },
    {
      name: "E-mail",
      selector: (row: ClientData) => row.email,
      width: "230px",
    },
    { name: "Filial", selector: (row: ClientData) => row.flial },
    { name: "Telefone", selector: (row: ClientData) => row.telefone },
    {
      name: "Detalhes",
      cell: (row: ClientData) => (
        <div
          className="detail-btn"
          onClick={() => navigate(`/clients/detail/${row.codCliente}`)}
        >
          <IoEyeOutline />
        </div>
      ),
    },
  ];

  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentClients = filteredClients.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const customStyles: TableStyles = {
    headCells: {
      style: {
        backgroundColor: "#010101",
        color: "white",
        fontSize: "16px",
        justifyContent: "center",
        position: "sticky",
        top: 0,
        zIndex: 1,
      },
    },
    cells: {
      style: {
        fontSize: "15px",
        padding: "4px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
    },
    rows: {
      style: {
        "&:hover": {
          backgroundColor: "#f0f0f0",
        },
      },
    },
    pagination: {
      style: {
        color: "#010101",
        backgroundColor: "#fcfcfc",
      },
      pageButtonsStyle: {
        color: "#010101",
        fill: "#010101",
        ":hover:not(:disabled)": {},
        ":focus": {
          outline: "none",
        },
      },
    },
  };

  return (
    <>
      <div className="client-page">
        <section className="content">
          <form className="filter-form">
            <h2>Filtros avançados</h2>
            <div className="form-row">
              <Input
                label="Razão Social"
                placeholder="Razão Social"
                name="razaoSocial"
                onChange={handleFilterChange}
              />
              <Input
                label="CNPJ"
                placeholder="CNPJ"
                name="cnpj"
                onChange={handleFilterChange}
              />
              <Input
                label="Cód Cliente"
                placeholder="Cód Cliente"
                name="codCliente"
                onChange={handleFilterChange}
              />
              <Input
                label="Filial"
                select
                defaultValue=""
                name="filial"
                options={[
                  { value: "", label: "Todos" },
                  { value: "Filial 1", label: "Filial 1" },
                  { value: "Filial 2", label: "Filial 2" },
                  { value: "Filial 3", label: "Filial 3" },
                  { value: "Filial 4", label: "Filial 4" },
                  { value: "Filial 5", label: "Filial 5" },
                ]}
                value={filters.filial}
                onChange={handleFilterChange}
              />
            </div>
            <div className="form-actions">
              <button
                type="reset"
                className="btn-reset"
                onClick={() =>
                  setFilters({
                    razaoSocial: "",
                    cnpj: "",
                    codCliente: "",
                    filial: "",
                  })
                }
              >
                Limpar Filtros
              </button>
              <button type="submit" className="btn-submit">
                Filtrar
              </button>
            </div>
          </form>

          <div className="table">
            <h2>Relatório de Contas</h2>
            <DataTable
              columns={columns}
              data={currentClients}
              pagination
              paginationServer
              paginationPerPage={rowsPerPage}
              paginationTotalRows={filteredClients.length}
              onChangeRowsPerPage={setRowsPerPage}
              onChangePage={setCurrentPage}
              paginationComponentOptions={{
                rowsPerPageText: "Linhas por página",
                rangeSeparatorText: "de",
                selectAllRowsItem: true,
                selectAllRowsItemText: "Todos",
              }}
              customStyles={customStyles}
            />
          </div>
        </section>
      </div>
    </>
  );
}

export default ListClientPage;
