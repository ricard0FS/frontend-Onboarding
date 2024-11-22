import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import CircularProgress from "@mui/material/CircularProgress";
import Input from "../../../../components/input";
import DataTable, { TableStyles } from "react-data-table-component";
import { IoEyeOutline } from "react-icons/io5";
import api from "../../../../../services/api";

interface ClientData {
  id_cliente: number;
  cnpjCliente: string;
  razaoSocial: string;
  nmFantasia: string;
  cdClienteExterno: string;
  nmEmpresa?: string;
}

function ListClientPage() {
  const navigate = useNavigate();
  const [clients, setClients] = useState<ClientData[]>([]);
  const [filters, setFilters] = useState({
    razaoSocial: "",
    cnpjCliente: "",
    codigoCliente: "",
    filial: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  const columns = [
    {
      name: "Cód Cliente",
      selector: (row: ClientData) => row.cdClienteExterno || "N/A",
    },
    {
      name: "Razão Social",
      selector: (row: ClientData) => row.razaoSocial || "N/A",
    },
    {
      name: "CNPJ",
      selector: (row: ClientData) => row.cnpjCliente || "N/A",
    },
    {
      name: "Filial",
      selector: (row: ClientData) => row.nmEmpresa || "N/A",
    },
    {
      name: "Detalhes",
      cell: (row: ClientData) => (
        <div
          className="detail-btn"
          onClick={() => navigate(`/clients/detail/${row.cnpjCliente}`)}
        >
          <IoEyeOutline />
        </div>
      ),
    },
  ];

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

  const fetchFilteredClients = async () => {
    setIsLoading(true);

    const hasActiveFilters = Object.values(filters).some(
      (value) => value.trim() !== ""
    );

    try {
      let response;

      const sanitizedFilters = {
        razaoSocial: filters.razaoSocial.trim() || null,
        cnpjCliente: filters.cnpjCliente.trim() || null,
        codigoCliente: filters.codigoCliente.trim() || null,
        filial: filters.filial.trim() || null,
      };

      console.log("Enviando dados para a API (findCliente):", sanitizedFilters);

      if (hasActiveFilters) {
        response = await api.post("/api/client/findCliente", sanitizedFilters);
      } else {
        console.log("Enviando dados para a API (findAll):", filters);
        response = await api.get("/api/client/findAll");
      }

      console.log("Resposta da API:", response.data);

      const responseData = response.data.content || [response.data];

      if (Array.isArray(responseData)) {
        setClients(responseData);
      } else if (responseData && typeof responseData === "object") {
        setClients([responseData]);
      } else {
        console.error("Resposta inesperada da API:", responseData);
        setClients([]);
      }
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      setClients([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFilteredClients();
  };

  return (
    <div className="client-page">
      <section className="content">
        <form className="filter-form" onSubmit={handleFilterSubmit}>
          <h2>Filtros avançados</h2>
          <div className="form-row">
            <Input
              label="Razão Social"
              placeholder="Razão Social"
              name="razaoSocial"
              value={filters.razaoSocial}
              onChange={(e) =>
                setFilters({ ...filters, razaoSocial: e.target.value })
              }
            />
            <Input
              label="CNPJ"
              placeholder="CNPJ"
              name="cnpjCliente"
              value={filters.cnpjCliente}
              onChange={(e) =>
                setFilters({ ...filters, cnpjCliente: e.target.value })
              }
            />
            <Input
              label="Cód Cliente"
              placeholder="Cód Cliente"
              name="codigoCliente"
              value={filters.codigoCliente}
              onChange={(e) =>
                setFilters({ ...filters, codigoCliente: e.target.value })
              }
            />
            <Input
              label="Filial"
              select
              value={filters.filial}
              name="filial"
              onChange={(e) =>
                setFilters({ ...filters, filial: e.target.value })
              }
              options={[
                { value: "", label: "Todos" },
                { value: "Filial 1", label: "Filial 1" },
                { value: "Filial 2", label: "Filial 2" },
                { value: "Filial 3", label: "Filial 3" },
                { value: "Filial 4", label: "Filial 4" },
                { value: "Filial 5", label: "Filial 5" },
              ]}
            />
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="btn-reset"
              onClick={() =>
                setFilters({
                  razaoSocial: "",
                  cnpjCliente: "",
                  codigoCliente: "",
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
          {isLoading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              <CircularProgress />
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={clients}
              pagination
              paginationServer
              paginationTotalRows={clients.length}
              paginationPerPage={rowsPerPage}
              paginationDefaultPage={currentPage}
              onChangeRowsPerPage={(newRowsPerPage) => {
                setRowsPerPage(newRowsPerPage);
                setCurrentPage(1);
              }}
              onChangePage={(newPage) => setCurrentPage(newPage)}
              customStyles={customStyles}
              noDataComponent={
                <div
                  style={{
                    textAlign: "center",
                    color: "#000",
                    padding: "20px",
                  }}
                >
                  Nenhum registro encontrado, faça uma nova pesquisa.
                </div>
              }
            />
          )}
        </div>
      </section>
    </div>
  );
}

export default ListClientPage;
